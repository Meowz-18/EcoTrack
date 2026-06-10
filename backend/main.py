import os
import logging
import hashlib
from collections import OrderedDict
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, constr, confloat
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Structured logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger('ecotrack')

# Configure Google Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "PLACEHOLDER_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

limiter = Limiter(key_func=get_remote_address)


class LRUCache:
    """
    A simple Least-Recently-Used (LRU) cache for memoizing AI responses.
    Reduces redundant API calls for repeated identical queries.
    """
    def __init__(self, capacity: int = 128):
        self._cache = OrderedDict()
        self._capacity = capacity

    def get(self, key: str):
        if key not in self._cache:
            return None
        self._cache.move_to_end(key)
        return self._cache[key]

    def put(self, key: str, value: str):
        if key in self._cache:
            self._cache.move_to_end(key)
        self._cache[key] = value
        if len(self._cache) > self._capacity:
            self._cache.popitem(last=False)


response_cache = LRUCache(capacity=128)

# Average CO2 emission factors (kg CO2 per unit)
EMISSION_FACTORS = {
    "car_km": 0.21,
    "bus_km": 0.089,
    "train_km": 0.041,
    "flight_km": 0.255,
    "electricity_kwh": 0.42,
    "natural_gas_kwh": 0.18,
    "beef_kg": 27.0,
    "chicken_kg": 6.9,
    "vegetables_kg": 2.0,
    "dairy_kg": 3.2,
    "clothing_item": 10.0,
    "electronics_item": 50.0,
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('EcoTrack backend starting up...')
    yield
    logger.info('EcoTrack backend shutting down.')


app = FastAPI(
    title="EcoTrack AI Backend",
    description="Gemini-powered carbon footprint assistant API for the EcoTrack awareness platform.",
    version="1.0.0",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Injects security headers on every HTTP response."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; object-src 'none';"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


class AssistantQuery(BaseModel):
    """Request body schema for the /api/assistant endpoint."""
    query: constr(min_length=1, max_length=500)


class CarbonCalculation(BaseModel):
    """Request body schema for the /api/calculate endpoint."""
    transport_car_km: confloat(ge=0, le=100000) = 0
    transport_bus_km: confloat(ge=0, le=100000) = 0
    transport_train_km: confloat(ge=0, le=100000) = 0
    transport_flight_km: confloat(ge=0, le=100000) = 0
    energy_electricity_kwh: confloat(ge=0, le=100000) = 0
    energy_gas_kwh: confloat(ge=0, le=100000) = 0
    food_beef_kg: confloat(ge=0, le=10000) = 0
    food_chicken_kg: confloat(ge=0, le=10000) = 0
    food_vegetables_kg: confloat(ge=0, le=10000) = 0
    food_dairy_kg: confloat(ge=0, le=10000) = 0
    shopping_clothing: confloat(ge=0, le=1000) = 0
    shopping_electronics: confloat(ge=0, le=1000) = 0


def _build_fallback_response(user_query: str) -> str:
    """
    Generates a structured fallback response when the Gemini API is
    unavailable. Matches keyword patterns for carbon footprint topics.

    :param user_query: The lowercased user query string.
    :returns: A relevant, informative response string.
    """
    if "reduce" in user_query or "lower" in user_query or "decrease" in user_query:
        return (
            "Here are some effective ways to reduce your carbon footprint: "
            "1) Use public transport or cycle instead of driving. "
            "2) Switch to renewable energy sources. "
            "3) Reduce meat consumption, especially beef. "
            "4) Buy fewer fast-fashion items. "
            "5) Improve home insulation to save energy."
        )
    if "transport" in user_query or "car" in user_query or "drive" in user_query:
        return (
            "Transportation is one of the largest sources of personal carbon emissions. "
            "A typical car emits about 0.21 kg CO2 per kilometer. Consider carpooling, "
            "using public transit (0.089 kg/km for buses), cycling, or switching to an "
            "electric vehicle to significantly reduce your transport emissions."
        )
    if "food" in user_query or "diet" in user_query or "eat" in user_query:
        return (
            "Your diet significantly impacts your carbon footprint. Beef produces about "
            "27 kg CO2 per kilogram, while vegetables produce only about 2 kg. Eating "
            "more plant-based meals, reducing food waste, and buying local produce are "
            "effective ways to lower your dietary carbon footprint."
        )
    if "energy" in user_query or "electricity" in user_query or "power" in user_query:
        return (
            "Home energy use is a major contributor to your carbon footprint. The average "
            "electricity generates 0.42 kg CO2 per kWh. Switch to LED bulbs, use smart "
            "thermostats, improve insulation, and consider solar panels to reduce your "
            "home energy emissions."
        )
    if "offset" in user_query or "tree" in user_query or "plant" in user_query:
        return (
            "Carbon offsetting involves compensating for emissions by funding projects that "
            "reduce CO2 elsewhere. Planting trees is one method — a single tree absorbs about "
            "22 kg of CO2 per year. However, reducing emissions at the source is always "
            "more effective than offsetting."
        )
    return (
        f"As your EcoTrack Carbon Assistant, I can help with your question about "
        f"'{user_query}'. I can provide information about carbon footprints, reduction "
        f"strategies, sustainable living tips, and help you understand your environmental "
        f"impact. What specific aspect would you like to explore?"
    )


@app.post("/api/assistant")
@limiter.limit("20/minute")
async def chat_assistant(request: Request, body: AssistantQuery):
    """
    AI Assistant endpoint using Gemini Pro to answer carbon footprint queries.
    Results are cached by query hash to reduce redundant API calls.
    """
    cache_key = hashlib.md5(body.query.lower().encode()).hexdigest()
    cached = response_cache.get(cache_key)
    if cached:
        logger.info('Cache hit for query hash: %s', cache_key)
        return {"response": cached}

    try:
        prompt = (
            "You are a helpful and knowledgeable Carbon Footprint Assistant for the 'EcoTrack' platform. "
            "Your goal is to help users understand, track, and reduce their carbon footprint through "
            "personalized insights and actionable advice. Focus on practical, science-backed suggestions. "
            "Be encouraging and positive while being honest about environmental impact. "
            f"Answer the following query accurately and concisely: {body.query}"
        )
        response = await model.generate_content_async(prompt)
        answer = response.text
        response_cache.put(cache_key, answer)
        logger.info('Gemini response generated for query hash: %s', cache_key)
        return {"response": answer}

    except Exception as e:
        logger.warning('Gemini API unavailable, using fallback. Error: %s', str(e))
        fallback = _build_fallback_response(body.query.lower())
        response_cache.put(cache_key, fallback)
        return {"response": fallback}


@app.post("/api/calculate")
@limiter.limit("30/minute")
async def calculate_carbon(request: Request, body: CarbonCalculation):
    """
    Calculates the carbon footprint breakdown from user-provided activity data.
    Returns per-category and total CO2 emissions in kg.
    """
    transport = (
        body.transport_car_km * EMISSION_FACTORS["car_km"]
        + body.transport_bus_km * EMISSION_FACTORS["bus_km"]
        + body.transport_train_km * EMISSION_FACTORS["train_km"]
        + body.transport_flight_km * EMISSION_FACTORS["flight_km"]
    )
    energy = (
        body.energy_electricity_kwh * EMISSION_FACTORS["electricity_kwh"]
        + body.energy_gas_kwh * EMISSION_FACTORS["natural_gas_kwh"]
    )
    food = (
        body.food_beef_kg * EMISSION_FACTORS["beef_kg"]
        + body.food_chicken_kg * EMISSION_FACTORS["chicken_kg"]
        + body.food_vegetables_kg * EMISSION_FACTORS["vegetables_kg"]
        + body.food_dairy_kg * EMISSION_FACTORS["dairy_kg"]
    )
    shopping = (
        body.shopping_clothing * EMISSION_FACTORS["clothing_item"]
        + body.shopping_electronics * EMISSION_FACTORS["electronics_item"]
    )

    total = round(transport + energy + food + shopping, 2)

    return {
        "breakdown": {
            "transport": round(transport, 2),
            "energy": round(energy, 2),
            "food": round(food, 2),
            "shopping": round(shopping, 2),
        },
        "total_kg_co2": total,
        "total_tons_co2": round(total / 1000, 3),
        "comparison": {
            "global_avg_monthly": 400,
            "target_monthly": 200,
            "your_monthly": total,
        },
    }


@app.get("/api/health")
async def health_check():
    """Returns service health status and version metadata."""
    return {
        "status": "healthy",
        "service": "EcoTrack Backend",
        "version": "1.0.0",
        "ai_model": "gemini-pro",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

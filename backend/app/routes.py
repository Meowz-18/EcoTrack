"""
API route handlers for the EcoTrack backend.

Defines all HTTP endpoints as an APIRouter, keeping route logic
separate from application initialization and middleware configuration.
"""

import hashlib
import logging

from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.schemas import (
    AssistantQuery,
    AssistantResponse,
    CalculationResponse,
    CarbonCalculation,
    HealthResponse,
)
from app.services import (
    LRUCache,
    build_fallback_response,
    calculate_emissions,
)

logger = logging.getLogger("ecotrack")

# Module-level cache instance shared across requests
response_cache = LRUCache(capacity=128)

# Route-level limiter (same key function; attached to app state in main.py)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api", tags=["EcoTrack"])


@router.post("/assistant", response_model=AssistantResponse)
@limiter.limit("20/minute")
async def chat_assistant(request: Request, body: AssistantQuery):
    """AI Assistant endpoint using Gemini Pro for carbon footprint queries.

    Checks the LRU cache first. On cache miss, builds a personalized
    prompt (optionally injecting the user's carbon breakdown) and calls
    the Gemini API. Falls back to keyword-matched local responses on
    API failure.
    """
    from main import model  # lazy import to avoid circular dependency

    cache_key = hashlib.md5(body.query.lower().encode()).hexdigest()
    cached = response_cache.get(cache_key)
    if cached:
        logger.info("Cache hit for query hash: %s", cache_key)
        return {"response": cached}

    try:
        carbon_info = ""
        if body.carbon_data and body.carbon_data.total > 0:
            carbon_info = (
                f" The user has tracked their monthly carbon footprint breakdown: "
                f"Total: {body.carbon_data.total} kg CO2, "
                f"Transport: {body.carbon_data.transport} kg, "
                f"Energy: {body.carbon_data.energy} kg, "
                f"Food: {body.carbon_data.food} kg, "
                f"Shopping: {body.carbon_data.shopping} kg. "
                "Tailor your response and suggest specific ways to reduce "
                "their highest categories."
            )

        prompt = (
            "You are a helpful and knowledgeable Carbon Footprint Assistant "
            "for the 'EcoTrack' platform. Your goal is to help users "
            "understand, track, and reduce their carbon footprint through "
            "personalized insights and actionable advice. Focus on practical, "
            "science-backed suggestions. Be encouraging and positive while "
            "being honest about environmental impact."
            f"{carbon_info}"
            f" Answer the following query accurately and concisely: {body.query}"
        )
        response = await model.generate_content_async(prompt)
        answer = response.text
        response_cache.put(cache_key, answer)
        logger.info("Gemini response generated for query hash: %s", cache_key)
        return {"response": answer}

    except Exception as exc:
        logger.warning(
            "Gemini API unavailable, using fallback. Error: %s", str(exc)
        )
        fallback = build_fallback_response(body.query.lower())
        response_cache.put(cache_key, fallback)
        return {"response": fallback}


@router.post("/calculate", response_model=CalculationResponse)
@limiter.limit("30/minute")
async def calculate_carbon(request: Request, body: CarbonCalculation):
    """Calculate carbon footprint from user-provided activity data.

    Delegates all computation to the service layer and returns
    per-category and total CO₂ emissions in kg.
    """
    return calculate_emissions(
        transport_car_km=body.transport_car_km,
        transport_bus_km=body.transport_bus_km,
        transport_train_km=body.transport_train_km,
        transport_flight_km=body.transport_flight_km,
        energy_electricity_kwh=body.energy_electricity_kwh,
        energy_gas_kwh=body.energy_gas_kwh,
        food_beef_kg=body.food_beef_kg,
        food_chicken_kg=body.food_chicken_kg,
        food_vegetables_kg=body.food_vegetables_kg,
        food_dairy_kg=body.food_dairy_kg,
        shopping_clothing=body.shopping_clothing,
        shopping_electronics=body.shopping_electronics,
    )


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Return service health status and version metadata."""
    return {
        "status": "healthy",
        "service": "EcoTrack Backend",
        "version": "1.0.0",
        "ai_model": "gemini-pro",
    }

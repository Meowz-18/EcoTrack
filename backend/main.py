"""
EcoTrack AI Backend — Application Entry Point.

Assembles the FastAPI application from modular subpackages:
- ``app.routes``     — API endpoint handlers
- ``app.middleware``  — Security headers and CORS
- ``app.schemas``     — Pydantic request/response models
- ``app.services``    — Business logic and caching

Run with: ``uvicorn main:app --reload``
"""

import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import google.generativeai as genai
from dotenv import load_dotenv

from app.middleware import add_security_headers, configure_cors
from app.routes import router, limiter

load_dotenv()

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("ecotrack")

# ---------------------------------------------------------------------------
# Google Gemini AI Configuration
# ---------------------------------------------------------------------------

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "PLACEHOLDER_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-pro")

# ---------------------------------------------------------------------------
# Application Lifecycle
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Log application startup and shutdown events."""
    logger.info("EcoTrack backend starting up...")
    yield
    logger.info("EcoTrack backend shutting down.")


# ---------------------------------------------------------------------------
# Application Assembly
# ---------------------------------------------------------------------------

app = FastAPI(
    title="EcoTrack AI Backend",
    description=(
        "Gemini-powered carbon footprint assistant API "
        "for the EcoTrack awareness platform."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Security headers (must be added before CORS)
app.middleware("http")(add_security_headers)

# CORS
configure_cors(app)

# Routes
app.include_router(router)


# ---------------------------------------------------------------------------
# Development Runner
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

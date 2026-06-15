"""
Pydantic request/response schemas for the EcoTrack API.

Centralizes all data validation models used across endpoints,
enforcing strict input constraints and typed API contracts.
"""

from typing import Optional
from pydantic import BaseModel, constr, confloat


# ---------------------------------------------------------------------------
# Assistant Endpoint Schemas
# ---------------------------------------------------------------------------

class CarbonDataSchema(BaseModel):
    """User's current carbon footprint breakdown, passed for personalized AI."""

    transport: float = 0
    energy: float = 0
    food: float = 0
    shopping: float = 0
    total: float = 0


class AssistantQuery(BaseModel):
    """Request body for ``POST /api/assistant``.

    Attributes:
        query: The user's natural-language question (1–500 chars).
        carbon_data: Optional current footprint for personalized advice.
    """

    query: constr(min_length=1, max_length=500)
    carbon_data: Optional[CarbonDataSchema] = None


class AssistantResponse(BaseModel):
    """Response body for ``POST /api/assistant``."""

    response: str


# ---------------------------------------------------------------------------
# Calculator Endpoint Schemas
# ---------------------------------------------------------------------------

class CarbonCalculation(BaseModel):
    """Request body for ``POST /api/calculate``.

    Each field represents a measurable lifestyle activity with a
    constrained numeric range to prevent abuse or invalid inputs.
    """

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


class CalculationBreakdown(BaseModel):
    """Per-category CO₂ breakdown returned by the calculator."""

    transport: float
    energy: float
    food: float
    shopping: float


class ComparisonData(BaseModel):
    """Benchmark comparison data returned alongside calculations."""

    global_avg_monthly: float
    target_monthly: float
    your_monthly: float


class CalculationResponse(BaseModel):
    """Response body for ``POST /api/calculate``."""

    breakdown: CalculationBreakdown
    total_kg_co2: float
    total_tons_co2: float
    comparison: ComparisonData


# ---------------------------------------------------------------------------
# Health Endpoint Schema
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    """Response body for ``GET /api/health``."""

    status: str
    service: str
    version: str
    ai_model: str

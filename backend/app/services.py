"""
Business logic and service layer for the EcoTrack API.

Contains the LRU cache, emission factor constants, carbon
calculation logic, and AI fallback response generation.
Decoupled from HTTP concerns for independent testability.
"""

from collections import OrderedDict


# ---------------------------------------------------------------------------
# Response Cache
# ---------------------------------------------------------------------------

class LRUCache:
    """Least-Recently-Used cache for memoizing AI responses.

    Reduces redundant Gemini API calls for repeated identical queries.
    Thread-safe for single-worker async usage (OrderedDict operations
    are atomic in CPython).

    Attributes:
        _cache: Internal ordered dictionary storing key-value pairs.
        _capacity: Maximum number of entries before eviction.
    """

    def __init__(self, capacity: int = 128) -> None:
        self._cache: OrderedDict[str, str] = OrderedDict()
        self._capacity = capacity

    def get(self, key: str) -> str | None:
        """Retrieve a cached value, promoting it to most-recent."""
        if key not in self._cache:
            return None
        self._cache.move_to_end(key)
        return self._cache[key]

    def put(self, key: str, value: str) -> None:
        """Insert or update a cache entry, evicting LRU if at capacity."""
        if key in self._cache:
            self._cache.move_to_end(key)
        self._cache[key] = value
        if len(self._cache) > self._capacity:
            self._cache.popitem(last=False)


# ---------------------------------------------------------------------------
# Emission Factors (kg CO₂ per unit)
# Sources: IPCC AR6 (2023), US EPA GHG Equivalencies Calculator
# ---------------------------------------------------------------------------

EMISSION_FACTORS: dict[str, float] = {
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


# ---------------------------------------------------------------------------
# Carbon Calculation Service
# ---------------------------------------------------------------------------

def calculate_emissions(
    transport_car_km: float = 0,
    transport_bus_km: float = 0,
    transport_train_km: float = 0,
    transport_flight_km: float = 0,
    energy_electricity_kwh: float = 0,
    energy_gas_kwh: float = 0,
    food_beef_kg: float = 0,
    food_chicken_kg: float = 0,
    food_vegetables_kg: float = 0,
    food_dairy_kg: float = 0,
    shopping_clothing: float = 0,
    shopping_electronics: float = 0,
) -> dict:
    """Calculate per-category and total CO₂ emissions.

    Args:
        Individual activity amounts for each emission category.

    Returns:
        Dictionary with ``breakdown``, ``total_kg_co2``,
        ``total_tons_co2``, and ``comparison`` benchmark data.
    """
    transport = (
        transport_car_km * EMISSION_FACTORS["car_km"]
        + transport_bus_km * EMISSION_FACTORS["bus_km"]
        + transport_train_km * EMISSION_FACTORS["train_km"]
        + transport_flight_km * EMISSION_FACTORS["flight_km"]
    )
    energy = (
        energy_electricity_kwh * EMISSION_FACTORS["electricity_kwh"]
        + energy_gas_kwh * EMISSION_FACTORS["natural_gas_kwh"]
    )
    food = (
        food_beef_kg * EMISSION_FACTORS["beef_kg"]
        + food_chicken_kg * EMISSION_FACTORS["chicken_kg"]
        + food_vegetables_kg * EMISSION_FACTORS["vegetables_kg"]
        + food_dairy_kg * EMISSION_FACTORS["dairy_kg"]
    )
    shopping = (
        shopping_clothing * EMISSION_FACTORS["clothing_item"]
        + shopping_electronics * EMISSION_FACTORS["electronics_item"]
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


# ---------------------------------------------------------------------------
# AI Fallback Response Generator
# ---------------------------------------------------------------------------

def build_fallback_response(user_query: str) -> str:
    """Generate a structured fallback when the Gemini API is unavailable.

    Matches keyword patterns against the lowercased query and returns
    a relevant, informative response about carbon footprint topics.

    Args:
        user_query: The lowercased user query string.

    Returns:
        A contextually relevant response string.
    """
    if any(kw in user_query for kw in ("reduce", "lower", "decrease")):
        return (
            "Here are some effective ways to reduce your carbon footprint: "
            "1) Use public transport or cycle instead of driving. "
            "2) Switch to renewable energy sources. "
            "3) Reduce meat consumption, especially beef. "
            "4) Buy fewer fast-fashion items. "
            "5) Improve home insulation to save energy."
        )
    if any(kw in user_query for kw in ("transport", "car", "drive")):
        return (
            "Transportation is one of the largest sources of personal carbon emissions. "
            "A typical car emits about 0.21 kg CO2 per kilometer. Consider carpooling, "
            "using public transit (0.089 kg/km for buses), cycling, or switching to an "
            "electric vehicle to significantly reduce your transport emissions."
        )
    if any(kw in user_query for kw in ("food", "diet", "eat")):
        return (
            "Your diet significantly impacts your carbon footprint. Beef produces about "
            "27 kg CO2 per kilogram, while vegetables produce only about 2 kg. Eating "
            "more plant-based meals, reducing food waste, and buying local produce are "
            "effective ways to lower your dietary carbon footprint."
        )
    if any(kw in user_query for kw in ("energy", "electricity", "power")):
        return (
            "Home energy use is a major contributor to your carbon footprint. The average "
            "electricity generates 0.42 kg CO2 per kWh. Switch to LED bulbs, use smart "
            "thermostats, improve insulation, and consider solar panels to reduce your "
            "home energy emissions."
        )
    if any(kw in user_query for kw in ("offset", "tree", "plant")):
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

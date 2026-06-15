"""
Test suite for the EcoTrack backend API.

Covers all endpoints, security headers, caching, CORS, rate limiting,
input validation, Gemini mock success/failure, and service-layer logic.
"""

import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from main import app
from app.routes import response_cache, limiter
from app.services import EMISSION_FACTORS, LRUCache, build_fallback_response

client = TestClient(app)
limiter.enabled = False


# ---------------------------------------------------------------------------
# Assistant Endpoint Tests
# ---------------------------------------------------------------------------

class TestAssistantEndpoint:
    """Tests for ``POST /api/assistant``."""

    def test_reduce_query(self):
        """Reduction queries should return practical carbon reduction advice."""
        response_cache._cache.clear()
        res = client.post("/api/assistant", json={"query": "how to reduce my carbon footprint?"})
        assert res.status_code == 200
        body = res.json()["response"].lower()
        assert "reduce" in body or "carbon" in body

    def test_transport_query(self):
        """Transport queries should return mobility-related carbon info."""
        response_cache._cache.clear()
        res = client.post("/api/assistant", json={"query": "how does driving affect carbon emissions?"})
        assert res.status_code == 200
        assert len(res.json()["response"]) > 20

    def test_general_query(self):
        """General queries should return a helpful EcoTrack-branded response."""
        response_cache._cache.clear()
        res = client.post("/api/assistant", json={"query": "hello"})
        assert res.status_code == 200
        assert "EcoTrack" in res.json()["response"]

    def test_with_carbon_data(self):
        """Personalized prompt should be generated when carbon_data is provided."""
        response_cache._cache.clear()
        mock_response = AsyncMock()
        mock_response.text = "Based on your high transport emissions..."

        with patch("app.routes.model", create=True):
            with patch("main.model.generate_content_async", return_value=mock_response):
                res = client.post("/api/assistant", json={
                    "query": "tips for me",
                    "carbon_data": {
                        "transport": 150,
                        "energy": 50,
                        "food": 30,
                        "shopping": 10,
                        "total": 240,
                    },
                })
                assert res.status_code == 200

    def test_gemini_success_mock(self):
        """Assistant returns response from Gemini when API succeeds."""
        response_cache._cache.clear()
        mock_response = AsyncMock()
        mock_response.text = "This is a mock Gemini answer for eco questions."

        with patch("main.model.generate_content_async", return_value=mock_response) as mock_gen:
            res = client.post("/api/assistant", json={"query": "how to reuse plastic?"})
            assert res.status_code == 200
            assert res.json()["response"] == "This is a mock Gemini answer for eco questions."
            mock_gen.assert_called_once()

    def test_gemini_failure_fallback(self):
        """Assistant falls back gracefully when Gemini raises an exception."""
        response_cache._cache.clear()
        with patch("main.model.generate_content_async", side_effect=Exception("Gemini key error")) as mock_gen:
            res = client.post("/api/assistant", json={"query": "diet recommendations"})
            assert res.status_code == 200
            assert "diet" in res.json()["response"].lower()
            assert "beef" in res.json()["response"].lower()
            mock_gen.assert_called_once()

    def test_response_caching(self):
        """Identical queries should return the same response (cache hit)."""
        response_cache._cache.clear()
        query = {"query": "what is carbon offsetting?"}
        first = client.post("/api/assistant", json=query).json()["response"]
        second = client.post("/api/assistant", json=query).json()["response"]
        assert first == second


# ---------------------------------------------------------------------------
# Input Validation Tests
# ---------------------------------------------------------------------------

class TestInputValidation:
    """Tests for Pydantic request body validation."""

    def test_empty_query_rejected(self):
        """Empty query should be rejected with 422."""
        res = client.post("/api/assistant", json={"query": ""})
        assert res.status_code == 422

    def test_too_long_query_rejected(self):
        """Excessively long query should be rejected with 422."""
        res = client.post("/api/assistant", json={"query": "x" * 501})
        assert res.status_code == 422

    def test_negative_values_rejected(self):
        """Negative calculator values should be rejected with 422."""
        res = client.post("/api/calculate", json={"transport_car_km": -100})
        assert res.status_code == 422

    def test_too_large_values_rejected(self):
        """Excessively large calculator values should be rejected with 422."""
        res = client.post("/api/calculate", json={"transport_car_km": 1000000})
        assert res.status_code == 422


# ---------------------------------------------------------------------------
# Calculator Endpoint Tests
# ---------------------------------------------------------------------------

class TestCalculatorEndpoint:
    """Tests for ``POST /api/calculate``."""

    def test_correct_breakdown(self):
        """Calculator should return correct per-category breakdown."""
        payload = {
            "transport_car_km": 100,
            "energy_electricity_kwh": 200,
            "food_beef_kg": 5,
        }
        res = client.post("/api/calculate", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["breakdown"]["transport"] == round(100 * EMISSION_FACTORS["car_km"], 2)
        assert data["breakdown"]["energy"] == round(200 * EMISSION_FACTORS["electricity_kwh"], 2)
        assert data["breakdown"]["food"] == round(5 * EMISSION_FACTORS["beef_kg"], 2)
        assert data["total_kg_co2"] > 0

    def test_empty_payload_returns_zero(self):
        """Calculator with no data should return zero totals."""
        res = client.post("/api/calculate", json={})
        assert res.status_code == 200
        data = res.json()
        assert data["total_kg_co2"] == 0
        assert all(v == 0 for v in data["breakdown"].values())

    def test_tons_conversion(self):
        """Calculator should correctly convert kg to tonnes."""
        payload = {"transport_car_km": 10000}
        res = client.post("/api/calculate", json=payload)
        data = res.json()
        assert data["total_tons_co2"] == round(data["total_kg_co2"] / 1000, 3)

    def test_comparison_data_present(self):
        """Calculator response should include comparison benchmarks."""
        res = client.post("/api/calculate", json={"food_beef_kg": 1})
        data = res.json()
        assert data["comparison"]["global_avg_monthly"] == 400
        assert data["comparison"]["target_monthly"] == 200


# ---------------------------------------------------------------------------
# Security & Infrastructure Tests
# ---------------------------------------------------------------------------

class TestSecurityAndInfrastructure:
    """Tests for security headers, CORS, rate limiting, and health check."""

    def test_security_headers(self):
        """All responses should include required security headers."""
        res = client.get("/api/health")
        assert res.headers.get("x-content-type-options") == "nosniff"
        assert res.headers.get("x-frame-options") == "DENY"
        assert res.headers.get("referrer-policy") == "strict-origin-when-cross-origin"
        assert res.headers.get("permissions-policy") == "camera=(), microphone=(), geolocation=()"
        assert "no-store" in res.headers.get("cache-control", "")

    def test_health_endpoint_fields(self):
        """Health endpoint should return all required metadata fields."""
        res = client.get("/api/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert data["service"] == "EcoTrack Backend"
        assert "version" in data
        assert data["ai_model"] == "gemini-pro"

    def test_cors_preflight(self):
        """CORS preflight should allow the Vite dev server origin."""
        res = client.options("/api/assistant", headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        })
        assert res.status_code == 200
        assert res.headers.get("access-control-allow-origin") == "http://localhost:5173"

    def test_rate_limiting(self):
        """Sustained bursts of requests should trigger a 429 rate limit."""
        limiter.enabled = True
        try:
            hit_limit = False
            for _ in range(25):
                res = client.post("/api/assistant", json={"query": "safe"})
                if res.status_code == 429:
                    hit_limit = True
                    break
                assert res.status_code == 200
            assert hit_limit, "Rate limit of 429 was never reached"
        finally:
            limiter.enabled = False


# ---------------------------------------------------------------------------
# Service Layer Unit Tests
# ---------------------------------------------------------------------------

class TestServiceLayer:
    """Direct tests for business logic in ``app.services``."""

    def test_lru_cache_basic(self):
        """LRU cache should store and retrieve values."""
        cache = LRUCache(capacity=2)
        cache.put("a", "alpha")
        assert cache.get("a") == "alpha"
        assert cache.get("missing") is None

    def test_lru_cache_eviction(self):
        """LRU cache should evict the least-recently-used entry at capacity."""
        cache = LRUCache(capacity=2)
        cache.put("a", "1")
        cache.put("b", "2")
        cache.put("c", "3")  # should evict "a"
        assert cache.get("a") is None
        assert cache.get("b") == "2"
        assert cache.get("c") == "3"

    def test_lru_cache_promotion(self):
        """Accessing an entry should promote it, preventing eviction."""
        cache = LRUCache(capacity=2)
        cache.put("a", "1")
        cache.put("b", "2")
        cache.get("a")  # promote "a"
        cache.put("c", "3")  # should evict "b", not "a"
        assert cache.get("a") == "1"
        assert cache.get("b") is None

    def test_fallback_energy_keywords(self):
        """Energy-related keywords should return energy advice."""
        result = build_fallback_response("how to save electricity")
        assert "energy" in result.lower() or "kwh" in result.lower()

    def test_fallback_offset_keywords(self):
        """Offset-related keywords should return offsetting advice."""
        result = build_fallback_response("how do tree planting offsets work")
        assert "offset" in result.lower() or "tree" in result.lower()

    def test_fallback_generic(self):
        """Unknown queries should return a branded generic response."""
        result = build_fallback_response("something random xyz")
        assert "EcoTrack" in result

import pytest
from fastapi.testclient import TestClient
from main import app, response_cache, EMISSION_FACTORS

client = TestClient(app)


def test_chat_assistant_reduce():
    """Reduction queries should return practical carbon reduction advice."""
    response = client.post("/api/assistant", json={"query": "how to reduce my carbon footprint?"})
    assert response.status_code == 200
    assert "reduce" in response.json()["response"].lower() or "carbon" in response.json()["response"].lower()


def test_chat_assistant_transport():
    """Transport queries should return mobility-related carbon info."""
    response = client.post("/api/assistant", json={"query": "how does driving affect carbon emissions?"})
    assert response.status_code == 200
    assert len(response.json()["response"]) > 20


def test_chat_assistant_general():
    """General queries should return a helpful EcoTrack-branded response."""
    response = client.post("/api/assistant", json={"query": "hello"})
    assert response.status_code == 200
    assert "EcoTrack" in response.json()["response"]


def test_security_headers():
    """All responses should include required security headers."""
    response = client.get("/api/health")
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"
    assert response.headers.get("referrer-policy") == "strict-origin-when-cross-origin"


def test_health_endpoint_fields():
    """Health endpoint should return all required metadata fields."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "EcoTrack Backend"
    assert "version" in data
    assert data["ai_model"] == "gemini-pro"


def test_response_caching():
    """Identical queries should return the same response (cache hit)."""
    response_cache._cache.clear()
    query = {"query": "what is carbon offsetting?"}
    first = client.post("/api/assistant", json=query).json()["response"]
    second = client.post("/api/assistant", json=query).json()["response"]
    assert first == second


def test_carbon_calculator():
    """Calculator endpoint should return correct breakdown and totals."""
    payload = {
        "transport_car_km": 100,
        "energy_electricity_kwh": 200,
        "food_beef_kg": 5,
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "breakdown" in data
    assert "total_kg_co2" in data
    assert data["breakdown"]["transport"] == round(100 * EMISSION_FACTORS["car_km"], 2)
    assert data["breakdown"]["energy"] == round(200 * EMISSION_FACTORS["electricity_kwh"], 2)
    assert data["breakdown"]["food"] == round(5 * EMISSION_FACTORS["beef_kg"], 2)
    assert data["total_kg_co2"] > 0


def test_carbon_calculator_empty():
    """Calculator with no data should return zero totals."""
    response = client.post("/api/calculate", json={})
    assert response.status_code == 200
    data = response.json()
    assert data["total_kg_co2"] == 0
    assert all(v == 0 for v in data["breakdown"].values())


def test_cors_headers_options():
    """CORS preflight should allow the Vite dev server origin."""
    res = client.options("/api/assistant", headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST"
    })
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_input_validation_empty():
    """Empty query should be rejected by Pydantic validation."""
    response = client.post("/api/assistant", json={"query": ""})
    assert response.status_code == 422


def test_input_validation_too_long():
    """Excessively long query should be rejected by Pydantic validation."""
    response = client.post("/api/assistant", json={"query": "x" * 501})
    assert response.status_code == 422


def test_workflow_rate_limiting():
    """Sustained bursts of requests should trigger a 429 rate limit response."""
    hit_limit = False
    for _ in range(25):
        res = client.post("/api/assistant", json={"query": "safe"})
        if res.status_code == 429:
            hit_limit = True
            break
        assert res.status_code == 200

    assert hit_limit, "Rate limit of 429 was never reached"

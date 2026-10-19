"""
Integration Tests for Flask Routes and API Endpoints in LogicLab X
"""

import pytest
from app import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_main_pages_load(client):
    pages = ["/", "/converter", "/gates", "/arithmetic", "/learn"]
    for path in pages:
        response = client.get(path)
        assert response.status_code == 200, f"Page {path} failed to load with 200 OK"
        assert b"LogicLab" in response.data


def test_api_convert_endpoint(client):
    res = client.post("/api/convert", json={
        "value": "125.625",
        "source_base": 10,
        "target_base": 2,
        "precision": 4
    })
    assert res.status_code == 200
    json_data = res.get_json()
    assert json_data["success"] is True
    assert json_data["result"] == "1111101.101"
    assert "all_bases" in json_data


def test_api_convert_invalid(client):
    res = client.post("/api/convert", json={
        "value": "1028",
        "source_base": 2,
        "target_base": 10
    })
    assert res.status_code == 400
    json_data = res.get_json()
    assert json_data["success"] is False


def test_api_gate_endpoint(client):
    res = client.post("/api/gate", json={"gate": "XOR", "a": 1, "b": 0})
    assert res.status_code == 200
    json_data = res.get_json()
    assert json_data["success"] is True
    assert json_data["output"] == 1


def test_api_arithmetic_endpoint(client):
    res = client.post("/api/arithmetic", json={"circuit": "FULL_ADDER", "a": 1, "b": 1, "cin_bin": 1})
    assert res.status_code == 200
    json_data = res.get_json()
    assert json_data["success"] is True
    assert json_data["data"]["outputs"]["Sum"] == 1
    assert json_data["data"]["outputs"]["Cout"] == 1


def test_api_truth_table_csv(client):
    res = client.get("/api/truth-table/csv?type=gate&name=AND")
    assert res.status_code == 200
    assert "text/csv" in res.headers["Content-Type"]
    assert b"Input A" in res.data
    assert b"Output Y" in res.data

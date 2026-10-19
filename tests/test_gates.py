"""
Unit Tests for Logic Gates Simulator in LogicLab X
Tests all 7 fundamental gates across all binary combinations,
truth tables, and comparative mode.
"""

import pytest
from logiclab.gates import simulate_gate, calculate_gate_raw, compare_all_gates, generate_gate_truth_table


def test_and_gate_truth_table():
    assert calculate_gate_raw("AND", 0, 0) == 0
    assert calculate_gate_raw("AND", 0, 1) == 0
    assert calculate_gate_raw("AND", 1, 0) == 0
    assert calculate_gate_raw("AND", 1, 1) == 1


def test_or_gate_truth_table():
    assert calculate_gate_raw("OR", 0, 0) == 0
    assert calculate_gate_raw("OR", 0, 1) == 1
    assert calculate_gate_raw("OR", 1, 0) == 1
    assert calculate_gate_raw("OR", 1, 1) == 1


def test_not_gate_truth_table():
    assert calculate_gate_raw("NOT", 0) == 1
    assert calculate_gate_raw("NOT", 1) == 0


def test_nand_gate_truth_table():
    assert calculate_gate_raw("NAND", 0, 0) == 1
    assert calculate_gate_raw("NAND", 0, 1) == 1
    assert calculate_gate_raw("NAND", 1, 0) == 1
    assert calculate_gate_raw("NAND", 1, 1) == 0


def test_nor_gate_truth_table():
    assert calculate_gate_raw("NOR", 0, 0) == 1
    assert calculate_gate_raw("NOR", 0, 1) == 0
    assert calculate_gate_raw("NOR", 1, 0) == 0
    assert calculate_gate_raw("NOR", 1, 1) == 0


def test_xor_gate_truth_table():
    assert calculate_gate_raw("XOR", 0, 0) == 0
    assert calculate_gate_raw("XOR", 0, 1) == 1
    assert calculate_gate_raw("XOR", 1, 0) == 1
    assert calculate_gate_raw("XOR", 1, 1) == 0


def test_xnor_gate_truth_table():
    assert calculate_gate_raw("XNOR", 0, 0) == 1
    assert calculate_gate_raw("XNOR", 0, 1) == 0
    assert calculate_gate_raw("XNOR", 1, 0) == 0
    assert calculate_gate_raw("XNOR", 1, 1) == 1


def test_simulate_gate_structure():
    res = simulate_gate("XOR", 1, 0)
    assert res["success"] is True
    assert res["output"] == 1
    assert "expression" in res
    assert "explanation" in res
    assert len(res["truth_table"]) == 4
    # Check that row (1, 0) is flagged active
    active_row = next(r for r in res["truth_table"] if r["is_active"])
    assert active_row["a"] == 1
    assert active_row["b"] == 0
    assert active_row["y"] == 1


def test_not_gate_structure():
    res = simulate_gate("NOT", 1, 0)
    assert res["success"] is True
    assert res["output"] == 0
    assert len(res["truth_table"]) == 2


def test_compare_all_gates():
    res = compare_all_gates(1, 1)
    gates = res["gates"]
    assert gates["AND"]["output"] == 1
    assert gates["OR"]["output"] == 1
    assert gates["NOT"]["output"] == 0
    assert gates["NAND"]["output"] == 0
    assert gates["NOR"]["output"] == 0
    assert gates["XOR"]["output"] == 0
    assert gates["XNOR"]["output"] == 1

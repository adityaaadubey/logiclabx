"""
Unit Tests for Arithmetic Circuits in LogicLab X
Tests Half Adder, Full Adder, Half Subtractor, and Full Subtractor
across all input permutations, intermediate states, and truth tables.
"""

import pytest
from logiclab.arithmetic import (
    simulate_half_adder,
    simulate_full_adder,
    simulate_half_subtractor,
    simulate_full_subtractor,
    simulate_arithmetic_circuit,
    compare_all_arithmetic
)


def test_half_adder_all_permutations():
    # 0 + 0 = 0
    r00 = simulate_half_adder(0, 0)
    assert r00["outputs"]["Sum"] == 0
    assert r00["outputs"]["Carry"] == 0

    # 0 + 1 = 1
    r01 = simulate_half_adder(0, 1)
    assert r01["outputs"]["Sum"] == 1
    assert r01["outputs"]["Carry"] == 0

    # 1 + 0 = 1
    r10 = simulate_half_adder(1, 0)
    assert r10["outputs"]["Sum"] == 1
    assert r10["outputs"]["Carry"] == 0

    # 1 + 1 = 2 (Sum 0, Carry 1)
    r11 = simulate_half_adder(1, 1)
    assert r11["outputs"]["Sum"] == 0
    assert r11["outputs"]["Carry"] == 1


def test_full_adder_all_permutations():
    expected_fa = [
        # (A, B, Cin) -> (Sum, Cout)
        (0, 0, 0, 0, 0),
        (0, 0, 1, 1, 0),
        (0, 1, 0, 1, 0),
        (0, 1, 1, 0, 1),
        (1, 0, 0, 1, 0),
        (1, 0, 1, 0, 1),
        (1, 1, 0, 0, 1),
        (1, 1, 1, 1, 1),
    ]

    for a, b, cin, exp_sum, exp_cout in expected_fa:
        res = simulate_full_adder(a, b, cin)
        assert res["outputs"]["Sum"] == exp_sum, f"Failed FA Sum for A={a}, B={b}, Cin={cin}"
        assert res["outputs"]["Cout"] == exp_cout, f"Failed FA Cout for A={a}, B={b}, Cin={cin}"
        assert "S1" in res["intermediates"]
        assert "C1" in res["intermediates"]
        assert "C2" in res["intermediates"]


def test_half_subtractor_all_permutations():
    # 0 - 0 = 0 (Diff 0, Borrow 0)
    r00 = simulate_half_subtractor(0, 0)
    assert r00["outputs"]["Diff"] == 0
    assert r00["outputs"]["Borrow"] == 0

    # 0 - 1 = -1 (Diff 1, Borrow 1)
    r01 = simulate_half_subtractor(0, 1)
    assert r01["outputs"]["Diff"] == 1
    assert r01["outputs"]["Borrow"] == 1

    # 1 - 0 = 1 (Diff 1, Borrow 0)
    r10 = simulate_half_subtractor(1, 0)
    assert r10["outputs"]["Diff"] == 1
    assert r10["outputs"]["Borrow"] == 0

    # 1 - 1 = 0 (Diff 0, Borrow 0)
    r11 = simulate_half_subtractor(1, 1)
    assert r11["outputs"]["Diff"] == 0
    assert r11["outputs"]["Borrow"] == 0


def test_full_subtractor_all_permutations():
    expected_fs = [
        # (A, B, Bin) -> (Diff, Bout)
        (0, 0, 0, 0, 0),
        (0, 0, 1, 1, 1),
        (0, 1, 0, 1, 1),
        (0, 1, 1, 0, 1),
        (1, 0, 0, 1, 0),
        (1, 0, 1, 0, 0),
        (1, 1, 0, 0, 0),
        (1, 1, 1, 1, 1),
    ]

    for a, b, bin_val, exp_diff, exp_bout in expected_fs:
        res = simulate_full_subtractor(a, b, bin_val)
        assert res["outputs"]["Diff"] == exp_diff, f"Failed FS Diff for A={a}, B={b}, Bin={bin_val}"
        assert res["outputs"]["Bout"] == exp_bout, f"Failed FS Bout for A={a}, B={b}, Bin={bin_val}"
        assert "D1" in res["intermediates"]
        assert "B1" in res["intermediates"]
        assert "B2" in res["intermediates"]


def test_arithmetic_dispatcher():
    res_ha = simulate_arithmetic_circuit("HALF_ADDER", 1, 1)
    assert res_ha["outputs"]["Carry"] == 1

    res_fa = simulate_arithmetic_circuit("FULL_ADDER", 1, 1, 1)
    assert res_fa["outputs"]["Sum"] == 1
    assert res_fa["outputs"]["Cout"] == 1


def test_compare_all_arithmetic():
    comp = compare_all_arithmetic(1, 0, 1)
    # FA: 1 + 0 + 1 = 2 (Sum 0, Cout 1)
    assert comp["full_adder"]["outputs"]["Sum"] == 0
    assert comp["full_adder"]["outputs"]["Cout"] == 1
    # FS: 1 - 0 - 1 = 0 (Diff 0, Bout 0)
    assert comp["full_subtractor"]["outputs"]["Diff"] == 0
    assert comp["full_subtractor"]["outputs"]["Bout"] == 0

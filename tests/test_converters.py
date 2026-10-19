"""
Unit Tests for Number System Converter in LogicLab X
Tests all 12 directed cross-base conversions, fractions, negative values,
hexadecimal case-insensitivity, validation, and edge cases.
"""

import pytest
from logiclab.converters import convert_number, validate_number, convert_all_bases


def test_validation_rules():
    # Valid
    assert validate_number("1010", 2)[0] is True
    assert validate_number("755", 8)[0] is True
    assert validate_number("982", 10)[0] is True
    assert validate_number("1A3F", 16)[0] is True
    assert validate_number("1a3f", 16)[0] is True  # lower case
    assert validate_number("-42.5", 10)[0] is True
    assert validate_number("+101.1", 2)[0] is True

    # Invalid
    assert validate_number("102", 2)[0] is False  # '2' invalid in base 2
    assert validate_number("789", 8)[0] is False  # '8','9' invalid in base 8
    assert validate_number("1G", 16)[0] is False   # 'G' invalid in base 16
    assert validate_number("", 10)[0] is False     # empty
    assert validate_number("12.3.4", 10)[0] is False # multiple points
    assert validate_number("-", 10)[0] is False    # lone sign


def test_decimal_to_binary_integer():
    res = convert_number("42", 10, 2)
    assert res["success"] is True
    assert res["result"] == "101010"
    assert len(res["steps"]) > 0


def test_binary_to_decimal_integer():
    res = convert_number("101010", 2, 10)
    assert res["success"] is True
    assert res["result"] == "42"


def test_decimal_to_hexadecimal_integer():
    res = convert_number("255", 10, 16)
    assert res["success"] is True
    assert res["result"] == "FF"


def test_hexadecimal_to_decimal_integer():
    res = convert_number("3E", 16, 10)
    assert res["success"] is True
    assert res["result"] == "62"


def test_decimal_to_octal_integer():
    res = convert_number("64", 10, 8)
    assert res["success"] is True
    assert res["result"] == "100"


def test_octal_to_decimal_integer():
    res = convert_number("175", 8, 10)
    assert res["success"] is True
    assert res["result"] == "125"


def test_binary_to_octal_grouping():
    res = convert_number("110101", 2, 8)
    assert res["success"] is True
    assert res["result"] == "65"


def test_octal_to_binary_expansion():
    res = convert_number("65", 8, 2)
    assert res["success"] is True
    assert res["result"] == "110101"


def test_binary_to_hex_grouping():
    res = convert_number("11010111", 2, 16)
    assert res["success"] is True
    assert res["result"] == "D7"


def test_hex_to_binary_expansion():
    res = convert_number("D7", 16, 2)
    assert res["success"] is True
    assert res["result"] == "11010111"


def test_octal_to_hex_via_binary():
    res = convert_number("75", 8, 16)
    assert res["success"] is True
    assert res["result"] == "3D"


def test_hex_to_octal_via_binary():
    res = convert_number("3D", 16, 8)
    assert res["success"] is True
    assert res["result"] == "75"


def test_fractional_conversion():
    # 125.625 in Dec -> 1111101.101 in Bin
    res1 = convert_number("125.625", 10, 2, precision=4)
    assert res1["success"] is True
    assert res1["result"] == "1111101.101"

    # 1010.101 in Bin -> 10.625 in Dec
    res2 = convert_number("1010.101", 2, 10, precision=4)
    assert res2["success"] is True
    assert res2["result"] == "10.625"


def test_negative_numbers():
    res = convert_number("-25", 10, 2)
    assert res["success"] is True
    assert res["result"] == "-11001"
    assert res["is_negative"] is True


def test_zero_edge_cases():
    res = convert_number("0", 10, 2)
    assert res["success"] is True
    assert res["result"] == "0"


def test_same_base_identity():
    res = convert_number("10110", 2, 2)
    assert res["success"] is True
    assert res["result"] == "10110"


def test_all_bases_generation():
    bases = convert_all_bases("42", 10)
    assert "error" not in bases
    assert bases["2"] == "101010"
    assert bases["8"] == "52"
    assert bases["10"] == "42"
    assert bases["16"] == "2A"

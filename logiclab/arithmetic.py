"""
Arithmetic Circuit Laboratory for LogicLab X
Simulates:
1. Half Adder (Sum, Carry)
2. Full Adder (Sum, Carry-out, HA1 & HA2 decomposition)
3. Half Subtractor (Difference, Borrow)
4. Full Subtractor (Difference, Borrow-out, HS1 & HS2 decomposition)
Provides truth tables, intermediate gate signals, and plain-English explanations.
"""

CIRCUIT_METADATA = {
    "HALF_ADDER": {
        "name": "Half Adder",
        "inputs": ["A", "B"],
        "outputs": ["Sum", "Carry"],
        "formulas": {
            "Sum": "S = A ⊕ B",
            "Carry": "C = A · B"
        },
        "description": "Adds two 1-bit binary numbers. It cannot account for a carry-in bit from a previous stage.",
        "applications": "Used in the least significant bit (LSB) stage of multi-bit parallel adders."
    },
    "FULL_ADDER": {
        "name": "Full Adder",
        "inputs": ["A", "B", "Cin"],
        "outputs": ["Sum", "Cout"],
        "formulas": {
            "Sum": "S = A ⊕ B ⊕ Cin",
            "Cout": "Cout = (A · B) + (Cin · (A ⊕ B))"
        },
        "description": "Adds two 1-bit numbers along with a Carry-in from a lower bit position. Composed of two Half Adders and an OR gate.",
        "applications": "Core building block of Arithmetic Logic Units (ALUs), Ripple Carry Adders, and multipliers."
    },
    "HALF_SUBTRACTOR": {
        "name": "Half Subtractor",
        "inputs": ["A", "B"],
        "outputs": ["Difference", "Borrow"],
        "formulas": {
            "Difference": "D = A ⊕ B",
            "Borrow": "B = Ā · B"
        },
        "description": "Subtracts bit B from bit A (A - B). Generates a Difference and a Borrow bit.",
        "applications": "Used in the LSB position of multi-bit binary subtraction circuits."
    },
    "FULL_SUBTRACTOR": {
        "name": "Full Subtractor",
        "inputs": ["A", "B", "Bin"],
        "outputs": ["Difference", "Bout"],
        "formulas": {
            "Difference": "D = A ⊕ B ⊕ Bin",
            "Bout": "Bout = (Ā · B) + (¬(A ⊕ B) · Bin)"
        },
        "description": "Performs binary subtraction (A - B - Bin) considering borrow-in from the previous lower digit.",
        "applications": "Cascaded to build multi-bit binary subtractors or replaced by 2's complement adders."
    }
}


def simulate_half_adder(a: int, b: int) -> dict:
    """Half Adder computation and signal flow."""
    a = 1 if int(a) else 0
    b = 1 if int(b) else 0

    sum_out = a ^ b
    carry_out = a & b

    explanation = (
        f"Adding A={a} and B={b}: "
        f"Arithmetic value = {a} + {b} = {a + b}₁₀ = {carry_out}{sum_out}₂. "
        f"XOR gate produces Sum = {sum_out}. "
        f"AND gate produces Carry = {carry_out}."
    )

    # Truth table
    truth_table = []
    for idx, (ta, tb) in enumerate([(0, 0), (0, 1), (1, 0), (1, 1)]):
        truth_table.append({
            "row_index": idx,
            "inputs": {"A": ta, "B": tb},
            "outputs": {"Sum": ta ^ tb, "Carry": ta & tb},
            "is_active": (ta == a and tb == b)
        })

    return {
        "circuit": "HALF_ADDER",
        "meta": CIRCUIT_METADATA["HALF_ADDER"],
        "inputs": {"A": a, "B": b},
        "outputs": {"Sum": sum_out, "Carry": carry_out},
        "signals": {
            "A": a,
            "B": b,
            "Sum": sum_out,
            "Carry": carry_out
        },
        "active_row_index": next(r["row_index"] for r in truth_table if r["is_active"]),
        "explanation": explanation,
        "truth_table": truth_table
    }


def simulate_full_adder(a: int, b: int, cin: int) -> dict:
    """
    Full Adder computation showing two-stage Half Adder decomposition:
    Stage 1: HA1: S1 = A ^ B, C1 = A & B
    Stage 2: HA2: S = S1 ^ Cin, C2 = S1 & Cin
    Stage 3: Cout = C1 | C2
    """
    a = 1 if int(a) else 0
    b = 1 if int(b) else 0
    cin = 1 if int(cin) else 0

    s1 = a ^ b
    c1 = a & b
    sum_out = s1 ^ cin
    c2 = s1 & cin
    cout = c1 | c2

    total_dec = a + b + cin
    explanation = (
        f"Adding A={a}, B={b}, and Cin={cin}: "
        f"Total arithmetic sum = {a} + {b} + {cin} = {total_dec}₁₀ ({bin(total_dec)[2:].zfill(2)}₂). "
        f"First Half Adder gives intermediate Sum S₁ = {s1} and Carry C₁ = {c1}. "
        f"Second Half Adder combines S₁ with Cin, yielding final Sum = {sum_out} and C₂ = {c2}. "
        f"OR gate combines C₁ and C₂ to produce Carry-out Cout = {cout}."
    )

    truth_table = []
    idx = 0
    for ta in [0, 1]:
        for tb in [0, 1]:
            for tc in [0, 1]:
                ts1 = ta ^ tb
                tc1 = ta & tb
                tsum = ts1 ^ tc
                tc2 = ts1 & tc
                tcout = tc1 | tc2
                truth_table.append({
                    "row_index": idx,
                    "inputs": {"A": ta, "B": tb, "Cin": tc},
                    "intermediates": {"S1": ts1, "C1": tc1, "C2": tc2},
                    "outputs": {"Sum": tsum, "Cout": tcout},
                    "is_active": (ta == a and tb == b and tc == cin)
                })
                idx += 1

    return {
        "circuit": "FULL_ADDER",
        "meta": CIRCUIT_METADATA["FULL_ADDER"],
        "inputs": {"A": a, "B": b, "Cin": cin},
        "outputs": {"Sum": sum_out, "Cout": cout},
        "intermediates": {
            "S1": s1,
            "C1": c1,
            "C2": c2
        },
        "signals": {
            "A": a,
            "B": b,
            "Cin": cin,
            "S1": s1,
            "C1": c1,
            "C2": c2,
            "Sum": sum_out,
            "Cout": cout
        },
        "active_row_index": next(r["row_index"] for r in truth_table if r["is_active"]),
        "explanation": explanation,
        "truth_table": truth_table
    }


def simulate_half_subtractor(a: int, b: int) -> dict:
    """Half Subtractor: D = A ^ B, Bout = (~A) & B."""
    a = 1 if int(a) else 0
    b = 1 if int(b) else 0

    not_a = 1 if a == 0 else 0
    diff = a ^ b
    borrow = not_a & b

    explanation = (
        f"Subtracting B={b} from A={a} (A - B): "
        f"Arithmetic difference = {a} - {b} = {a - b}. "
    )
    if a == 0 and b == 1:
        explanation += (
            "Because 0 < 1, a Borrow is required from the higher bit position (Bout=1). "
            "With borrowed base 2, (2 + 0) - 1 = 1, giving Difference D=1."
        )
    else:
        explanation += f"No borrow needed (Bout=0), giving Difference D={diff}."

    truth_table = []
    for idx, (ta, tb) in enumerate([(0, 0), (0, 1), (1, 0), (1, 1)]):
        t_not_a = 1 if ta == 0 else 0
        tdiff = ta ^ tb
        tborrow = t_not_a & tb
        truth_table.append({
            "row_index": idx,
            "inputs": {"A": ta, "B": tb},
            "outputs": {"Diff": tdiff, "Borrow": tborrow},
            "is_active": (ta == a and tb == b)
        })

    return {
        "circuit": "HALF_SUBTRACTOR",
        "meta": CIRCUIT_METADATA["HALF_SUBTRACTOR"],
        "inputs": {"A": a, "B": b},
        "outputs": {"Diff": diff, "Borrow": borrow},
        "intermediates": {"NotA": not_a},
        "signals": {
            "A": a,
            "B": b,
            "NotA": not_a,
            "Diff": diff,
            "Borrow": borrow
        },
        "active_row_index": next(r["row_index"] for r in truth_table if r["is_active"]),
        "explanation": explanation,
        "truth_table": truth_table
    }


def simulate_full_subtractor(a: int, b: int, bin_val: int) -> dict:
    """
    Full Subtractor: A - B - Bin.
    Decomposed into two Half Subtractors and an OR gate:
    HS1: D1 = A ^ B, B1 = (~A) & B
    HS2: D = D1 ^ Bin, B2 = (~D1) & Bin
    Bout = B1 | B2
    """
    a = 1 if int(a) else 0
    b = 1 if int(b) else 0
    bin_val = 1 if int(bin_val) else 0

    not_a = 1 if a == 0 else 0
    d1 = a ^ b
    b1 = not_a & b
    not_d1 = 1 if d1 == 0 else 0
    diff = d1 ^ bin_val
    b2 = not_d1 & bin_val
    bout = b1 | b2

    arith_result = a - b - bin_val
    explanation = (
        f"Computing {a} - {b} - {bin_val} = {arith_result}. "
        f"First stage: D₁ = A ⊕ B = {d1}, initial borrow B₁ = Ā · B = {b1}. "
        f"Second stage: final Difference D = D₁ ⊕ Bin = {diff}, second borrow B₂ = ¬(D₁) · Bin = {b2}. "
        f"OR gate combines borrowings giving Bout = {bout}."
    )

    truth_table = []
    idx = 0
    for ta in [0, 1]:
        for tb in [0, 1]:
            for tbin in [0, 1]:
                t_na = 1 if ta == 0 else 0
                td1 = ta ^ tb
                tb1 = t_na & tb
                t_nd1 = 1 if td1 == 0 else 0
                tdiff = td1 ^ tbin
                tb2 = t_nd1 & tbin
                tbout = tb1 | tb2
                truth_table.append({
                    "row_index": idx,
                    "inputs": {"A": ta, "B": tb, "Bin": tbin},
                    "intermediates": {"D1": td1, "B1": tb1, "B2": tb2},
                    "outputs": {"Diff": tdiff, "Bout": tbout},
                    "is_active": (ta == a and tb == b and tbin == bin_val)
                })
                idx += 1

    return {
        "circuit": "FULL_SUBTRACTOR",
        "meta": CIRCUIT_METADATA["FULL_SUBTRACTOR"],
        "inputs": {"A": a, "B": b, "Bin": bin_val},
        "outputs": {"Diff": diff, "Bout": bout},
        "intermediates": {
            "NotA": not_a,
            "D1": d1,
            "B1": b1,
            "NotD1": not_d1,
            "B2": b2
        },
        "signals": {
            "A": a,
            "B": b,
            "Bin": bin_val,
            "D1": d1,
            "B1": b1,
            "B2": b2,
            "Diff": diff,
            "Bout": bout
        },
        "active_row_index": next(r["row_index"] for r in truth_table if r["is_active"]),
        "explanation": explanation,
        "truth_table": truth_table
    }


def simulate_arithmetic_circuit(circuit_name: str, a: int, b: int, c_or_b: int = 0) -> dict:
    """Unified arithmetic circuit dispatcher."""
    c_name = circuit_name.upper().replace("-", "_").replace(" ", "_")
    if c_name in ["HALF_ADDER", "HA"]:
        return simulate_half_adder(a, b)
    elif c_name in ["FULL_ADDER", "FA"]:
        return simulate_full_adder(a, b, c_or_b)
    elif c_name in ["HALF_SUBTRACTOR", "HS"]:
        return simulate_half_subtractor(a, b)
    elif c_name in ["FULL_SUBTRACTOR", "FS"]:
        return simulate_full_subtractor(a, b, c_or_b)
    else:
        return {
            "success": False,
            "error": f"Unknown arithmetic circuit '{circuit_name}'. Supported: HALF_ADDER, FULL_ADDER, HALF_SUBTRACTOR, FULL_SUBTRACTOR."
        }


def compare_all_arithmetic(a: int, b: int, carry_borrow_in: int = 0) -> dict:
    """Computes all 4 arithmetic circuits in parallel for side-by-side comparison."""
    return {
        "inputs": {"A": a, "B": b, "In": carry_borrow_in},
        "half_adder": simulate_half_adder(a, b),
        "full_adder": simulate_full_adder(a, b, carry_borrow_in),
        "half_subtractor": simulate_half_subtractor(a, b),
        "full_subtractor": simulate_full_subtractor(a, b, carry_borrow_in)
    }

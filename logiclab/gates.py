"""
Logic Gate Simulator for LogicLab X
Supports all 7 fundamental gates: AND, OR, NOT, NAND, NOR, XOR, XNOR.
Provides Boolean expressions, animated states, truth tables with active row tracking,
and plain-English educational explanations.
"""

GATE_METADATA = {
    "AND": {
        "name": "AND",
        "symbol": "·",
        "expression": "Y = A · B",
        "tex_expression": "Y = A \\cdot B",
        "description": "Output is HIGH (1) only if BOTH inputs A and B are HIGH (1).",
        "inputs": 2,
        "category": "Basic"
    },
    "OR": {
        "name": "OR",
        "symbol": "+",
        "expression": "Y = A + B",
        "tex_expression": "Y = A + B",
        "description": "Output is HIGH (1) if AT LEAST ONE input is HIGH (1).",
        "inputs": 2,
        "category": "Basic"
    },
    "NOT": {
        "name": "NOT",
        "symbol": "¬",
        "expression": "Y = Ā",
        "tex_expression": "Y = \\overline{A}",
        "description": "Inverts the input: Output is HIGH (1) when input A is LOW (0), and vice versa.",
        "inputs": 1,
        "category": "Basic"
    },
    "NAND": {
        "name": "NAND",
        "symbol": "↑",
        "expression": "Y = ¬(A · B)",
        "tex_expression": "Y = \\overline{A \\cdot B}",
        "description": "Universal Gate: NOT-AND. Output is LOW (0) only if BOTH inputs A and B are HIGH (1).",
        "inputs": 2,
        "category": "Universal"
    },
    "NOR": {
        "name": "NOR",
        "symbol": "↓",
        "expression": "Y = ¬(A + B)",
        "tex_expression": "Y = \\overline{A + B}",
        "description": "Universal Gate: NOT-OR. Output is HIGH (1) only when BOTH inputs are LOW (0).",
        "inputs": 2,
        "category": "Universal"
    },
    "XOR": {
        "name": "XOR",
        "symbol": "⊕",
        "expression": "Y = A ⊕ B",
        "tex_expression": "Y = A \\oplus B",
        "description": "Exclusive OR: Output is HIGH (1) if inputs are DIFFERENT (odd parity).",
        "inputs": 2,
        "category": "Arithmetic"
    },
    "XNOR": {
        "name": "XNOR",
        "symbol": "⊙",
        "expression": "Y = ¬(A ⊕ B)",
        "tex_expression": "Y = \\overline{A \\oplus B}",
        "description": "Equivalence Gate: Output is HIGH (1) if inputs are IDENTICAL (both 0 or both 1).",
        "inputs": 2,
        "category": "Arithmetic"
    }
}


def calculate_gate_raw(gate_name: str, a: int, b: int = 0) -> int:
    """Calculate raw binary output (0 or 1) for a gate."""
    name = gate_name.upper().strip()
    a = 1 if int(a) else 0
    b = 1 if int(b) else 0

    if name == "AND":
        return 1 if (a == 1 and b == 1) else 0
    elif name == "OR":
        return 1 if (a == 1 or b == 1) else 0
    elif name == "NOT":
        return 1 if a == 0 else 0
    elif name == "NAND":
        return 0 if (a == 1 and b == 1) else 1
    elif name == "NOR":
        return 1 if (a == 0 and b == 0) else 0
    elif name == "XOR":
        return 1 if a != b else 0
    elif name == "XNOR":
        return 1 if a == b else 0
    else:
        raise ValueError(f"Unknown logic gate: '{gate_name}'")


def get_gate_explanation(gate_name: str, a: int, b: int, output: int) -> str:
    """Generates beginner-friendly plain-English rationale for the output state."""
    name = gate_name.upper()

    if name == "AND":
        if a == 1 and b == 1:
            return "Both inputs A (1) and B (1) are HIGH, fulfilling the AND condition. The output Y is HIGH (1)."
        elif a == 0 and b == 0:
            return "Both inputs A (0) and B (0) are LOW. For an AND gate, any LOW input forces the output Y to LOW (0)."
        elif a == 0:
            return "Input A is LOW (0). Since an AND gate requires all inputs to be HIGH, the output Y is LOW (0)."
        else:
            return "Input B is LOW (0). Since an AND gate requires all inputs to be HIGH, the output Y is LOW (0)."

    elif name == "OR":
        if a == 0 and b == 0:
            return "Both inputs A (0) and B (0) are LOW. Because neither input is HIGH, the output Y is LOW (0)."
        elif a == 1 and b == 1:
            return "Both inputs A (1) and B (1) are HIGH. Meeting the OR condition produces a HIGH (1) output."
        elif a == 1:
            return "Input A is HIGH (1). For an OR gate, a single HIGH input is sufficient to drive output Y HIGH (1)."
        else:
            return "Input B is HIGH (1). For an OR gate, a single HIGH input is sufficient to drive output Y HIGH (1)."

    elif name == "NOT":
        if a == 1:
            return "Input A is HIGH (1). The NOT gate inverts the logic level, producing a LOW (0) output."
        else:
            return "Input A is LOW (0). The NOT gate inverts the logic level, producing a HIGH (1) output."

    elif name == "NAND":
        if a == 1 and b == 1:
            return "Both inputs A and B are HIGH (1), producing 1 inside the AND stage, which the inverter bubble flips to LOW (0)."
        else:
            return f"At least one input is LOW (A={a}, B={b}). The AND stage yields 0, which the inverter bubble flips to HIGH (1)."

    elif name == "NOR":
        if a == 0 and b == 0:
            return "Both inputs A and B are LOW (0). The OR stage is 0, which the inverter bubble flips to HIGH (1)."
        else:
            return f"At least one input is HIGH (A={a}, B={b}). The OR stage yields 1, which the inverter bubble flips to LOW (0)."

    elif name == "XOR":
        if a != b:
            return f"Inputs are unequal (A={a}, B={b}). XOR (Exclusive OR) detects difference, producing HIGH (1)."
        else:
            return f"Inputs are identical (A={a}, B={b}). XOR produces LOW (0) when inputs match."

    elif name == "XNOR":
        if a == b:
            return f"Inputs are identical (both {a}). XNOR (Equivalence Gate) detects equality, producing HIGH (1)."
        else:
            return f"Inputs differ (A={a}, B={b}). XNOR produces LOW (0) because the inputs do not match."

    return f"Logic output computed for {name} gate."


def generate_gate_truth_table(gate_name: str, current_a: int = 0, current_b: int = 0) -> list[dict]:
    """Builds complete truth table with the active row flagged."""
    name = gate_name.upper()
    meta = GATE_METADATA.get(name, {})
    is_single_input = (meta.get("inputs", 2) == 1)

    combinations = [(0, None), (1, None)] if is_single_input else [(0, 0), (0, 1), (1, 0), (1, 1)]

    table = []
    for idx, (a, b) in enumerate(combinations):
        b_val = 0 if b is None else b
        y = calculate_gate_raw(name, a, b_val)
        if is_single_input:
            is_active = (a == current_a)
            table.append({
                "row_index": idx,
                "a": a,
                "b": "-",
                "y": y,
                "is_active": is_active
            })
        else:
            is_active = (a == current_a and b == current_b)
            table.append({
                "row_index": idx,
                "a": a,
                "b": b,
                "y": y,
                "is_active": is_active
            })
    return table


def simulate_gate(gate_name: str, a: int, b: int = 0) -> dict:
    """Complete simulation data for a single logic gate."""
    name = gate_name.upper().strip()
    if name not in GATE_METADATA:
        return {"success": False, "error": f"Invalid gate '{gate_name}'. Valid gates: {list(GATE_METADATA.keys())}"}

    a = 1 if int(a) else 0
    b = 1 if int(b) else 0
    meta = GATE_METADATA[name]
    output = calculate_gate_raw(name, a, b)
    explanation = get_gate_explanation(name, a, b, output)
    truth_table = generate_gate_truth_table(name, a, b)

    active_row = next((r["row_index"] for r in truth_table if r["is_active"]), 0)

    return {
        "success": True,
        "gate": name,
        "name": meta["name"],
        "symbol": meta["symbol"],
        "expression": meta["expression"],
        "tex_expression": meta["tex_expression"],
        "description": meta["description"],
        "inputs_count": meta["inputs"],
        "category": meta["category"],
        "input_a": a,
        "input_b": None if meta["inputs"] == 1 else b,
        "output": output,
        "active_row_index": active_row,
        "explanation": explanation,
        "truth_table": truth_table
    }


def compare_all_gates(a: int, b: int) -> dict:
    """Calculates outputs for all 7 gates simultaneously for Compare Mode."""
    a = 1 if int(a) else 0
    b = 1 if int(b) else 0
    gates_data = {}
    for gate_name in ["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"]:
        gates_data[gate_name] = simulate_gate(gate_name, a, b)

    return {
        "input_a": a,
        "input_b": b,
        "gates": gates_data
    }

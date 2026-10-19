"""
LogicLab X — Interactive Digital Electronics Simulator
Flask Application Server
Tagline: Understand the Logic. See the Signals. Master Digital Electronics.
"""

from io import StringIO
import csv
from flask import Flask, render_template, request, jsonify, make_response

from logiclab.converters import convert_number, convert_all_bases, BASE_NAMES
from logiclab.gates import simulate_gate, compare_all_gates, generate_gate_truth_table, GATE_METADATA
from logiclab.arithmetic import (
    simulate_arithmetic_circuit,
    compare_all_arithmetic,
    CIRCUIT_METADATA
)
from logiclab.explanations import (
    LEARNING_MODULES,
    FINAL_EXAM_QUESTIONS,
    GLOSSARY_TERMS
)

app = Flask(__name__)
app.config["SECRET_KEY"] = "logiclab-x-academic-secret-key-2026"
app.config["JSON_SORT_KEYS"] = False


# ---------------- PAGE ROUTES ----------------

@app.route("/")
def index():
    """Home Dashboard and Interactive Overview."""
    return render_template(
        "index.html",
        active_page="home",
        page_title="LogicLab X — Digital Electronics Playground"
    )


@app.route("/converter")
def number_converter():
    """Page 1: Comprehensive Number System Converter."""
    return render_template(
        "number_converter.html",
        active_page="converter",
        page_title="Number System Converter — LogicLab X",
        base_names=BASE_NAMES
    )


@app.route("/gates")
def logic_gates():
    """Page 2: Fundamental Logic Gate Simulator."""
    return render_template(
        "logic_gates.html",
        active_page="gates",
        page_title="Logic Gate Simulator — LogicLab X",
        gate_meta=GATE_METADATA
    )


@app.route("/arithmetic")
def arithmetic_circuits():
    """Page 3: Digital Arithmetic Circuit Laboratory."""
    return render_template(
        "arithmetic_circuits.html",
        active_page="arithmetic",
        page_title="Arithmetic Circuits — LogicLab X",
        circuits=CIRCUIT_METADATA
    )


@app.route("/learn")
def learn():
    """Page 4: Structured Interactive Learning Hub & Quizzes."""
    return render_template(
        "learn.html",
        active_page="learn",
        page_title="Learn Digital Electronics — LogicLab X",
        modules=LEARNING_MODULES,
        glossary=GLOSSARY_TERMS,
        final_questions=FINAL_EXAM_QUESTIONS
    )


# ---------------- API ENDPOINTS ----------------

@app.route("/api/convert", methods=["POST"])
def api_convert():
    """
    POST /api/convert
    Body: { "value": "125.625", "source_base": 10, "target_base": 2, "precision": 4 }
    """
    data = request.get_json(silent=True) or request.form
    val_str = data.get("value", "")
    try:
        source_base = int(data.get("source_base", 10))
        target_base = int(data.get("target_base", 2))
        precision = int(data.get("precision", 4))
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid base or precision parameters."}), 400

    result = convert_number(val_str, source_base, target_base, precision)
    if not result.get("success"):
        return jsonify(result), 400
    return jsonify(result)


@app.route("/api/convert/all", methods=["POST"])
def api_convert_all():
    """
    POST /api/convert/all
    Body: { "value": "42", "source_base": 10, "precision": 4 }
    """
    data = request.get_json(silent=True) or request.form
    val_str = data.get("value", "")
    try:
        source_base = int(data.get("source_base", 10))
        precision = int(data.get("precision", 4))
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid base parameter."}), 400

    result = convert_all_bases(val_str, source_base, precision)
    if "error" in result:
        return jsonify({"success": False, "error": result["error"]}), 400
    return jsonify({"success": True, "bases": result})


@app.route("/api/gate", methods=["POST"])
def api_gate():
    """
    POST /api/gate
    Body: { "gate": "AND", "a": 1, "b": 0 }
    """
    data = request.get_json(silent=True) or request.form
    gate = data.get("gate", "AND")
    try:
        a = int(data.get("a", 0))
        b = int(data.get("b", 0))
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Inputs A and B must be binary (0 or 1)."}), 400

    result = simulate_gate(gate, a, b)
    if not result.get("success"):
        return jsonify(result), 400
    return jsonify(result)


@app.route("/api/gates/compare", methods=["POST"])
def api_gates_compare():
    """
    POST /api/gates/compare
    Body: { "a": 1, "b": 0 }
    """
    data = request.get_json(silent=True) or request.form
    try:
        a = int(data.get("a", 0))
        b = int(data.get("b", 0))
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Inputs must be binary integers (0 or 1)."}), 400

    result = compare_all_gates(a, b)
    return jsonify({"success": True, "data": result})


@app.route("/api/arithmetic", methods=["POST"])
def api_arithmetic():
    """
    POST /api/arithmetic
    Body: { "circuit": "HALF_ADDER", "a": 1, "b": 1, "cin_bin": 0 }
    """
    data = request.get_json(silent=True) or request.form
    circuit = data.get("circuit", "HALF_ADDER")
    try:
        a = int(data.get("a", 0))
        b = int(data.get("b", 0))
        cin_bin = int(data.get("cin_bin", data.get("cin", data.get("bin", 0))))
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Circuit inputs must be binary (0 or 1)."}), 400

    result = simulate_arithmetic_circuit(circuit, a, b, cin_bin)
    if "error" in result and not result.get("success", True):
        return jsonify(result), 400
    return jsonify({"success": True, "data": result})


@app.route("/api/arithmetic/compare", methods=["POST"])
def api_arithmetic_compare():
    """
    POST /api/arithmetic/compare
    Body: { "a": 1, "b": 1, "cin_bin": 0 }
    """
    data = request.get_json(silent=True) or request.form
    try:
        a = int(data.get("a", 0))
        b = int(data.get("b", 0))
        cin_bin = int(data.get("cin_bin", 0))
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Inputs must be binary (0 or 1)."}), 400

    result = compare_all_arithmetic(a, b, cin_bin)
    return jsonify({"success": True, "data": result})


@app.route("/api/truth-table/csv", methods=["GET"])
def api_truth_table_csv():
    """
    GET /api/truth-table/csv?type=gate&name=AND
    or ?type=arithmetic&name=FULL_ADDER
    Generates downloadable CSV export of the requested truth table.
    """
    table_type = request.args.get("type", "gate").lower()
    name = request.args.get("name", "AND").upper()

    si = StringIO()
    writer = csv.writer(si)

    if table_type == "gate":
        if name not in GATE_METADATA:
            return jsonify({"error": f"Invalid gate '{name}'"}), 400
        table = generate_gate_truth_table(name)
        if GATE_METADATA[name]["inputs"] == 1:
            writer.writerow(["Row", "Input A", "Output Y"])
            for r in table:
                writer.writerow([r["row_index"] + 1, r["a"], r["y"]])
        else:
            writer.writerow(["Row", "Input A", "Input B", "Output Y"])
            for r in table:
                writer.writerow([r["row_index"] + 1, r["a"], r["b"], r["y"]])
        filename = f"{name}_truth_table.csv"

    elif table_type == "arithmetic":
        circuit_res = simulate_arithmetic_circuit(name, 0, 0, 0)
        if not circuit_res.get("truth_table"):
            return jsonify({"error": f"Invalid circuit '{name}'"}), 400
        table = circuit_res["truth_table"]
        first_row = table[0]
        headers = ["Row"] + list(first_row["inputs"].keys()) + list(first_row["outputs"].keys())
        writer.writerow(headers)
        for r in table:
            row_data = [r["row_index"] + 1]
            row_data.extend(r["inputs"].values())
            row_data.extend(r["outputs"].values())
            writer.writerow(row_data)
        filename = f"{name}_truth_table.csv"

    else:
        return jsonify({"error": "Unknown type. Use 'gate' or 'arithmetic'."}), 400

    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = f"attachment; filename={filename}"
    output.headers["Content-type"] = "text/csv; charset=utf-8"
    return output


@app.route("/api/glossary", methods=["GET"])
def api_glossary():
    """Returns digital electronics glossary."""
    return jsonify({"success": True, "glossary": GLOSSARY_TERMS})


@app.route("/api/quiz/final", methods=["GET"])
def api_final_quiz():
    """Returns final certification quiz questions."""
    return jsonify({"success": True, "questions": FINAL_EXAM_QUESTIONS})


# ---------------- ERROR HANDLERS ----------------

@app.errorhandler(404)
def page_not_found(e):
    return render_template(
        "index.html",
        active_page="",
        page_title="404 - Page Not Found",
        error_message="The requested lab page was not found."
    ), 404


@app.errorhandler(500)
def internal_server_error(e):
    return render_template(
        "index.html",
        active_page="",
        page_title="500 - System Error",
        error_message="An internal logic simulation error occurred."
    ), 500


if __name__ == "__main__":
    print("================================================================")
    print("  LogicLab X — Digital Electronics Playground Server Starting")
    print("  Understand the Logic. See the Signals. Master Digital Electronics.")
    print("  Local URL: http://127.0.0.1:5000")
    print("================================================================")
    app.run(host="127.0.0.1", port=5000, debug=True)

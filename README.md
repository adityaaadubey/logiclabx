# LogicLab X: Digital Electronics Playground

> **Tagline:** *Understand the Logic. See the Signals. Master Digital Electronics.*

LogicLab X is a comprehensive, interactive digital electronics laboratory and simulation platform built for university and college courses in **Digital Electronics & Logic Design (DELD)** and **Computer Organization & Architecture (COA)**.

Built using **Python Flask**, **HTML5**, **CSS3 (Cyber-Lab Design System)**, **JavaScript (ES6)**, **SVG**, and **Canvas**, LogicLab X provides real-time simulation, animated signal traces, live truth tables, step-by-step algorithms, and curriculum assessments without requiring external hardware or paid APIs.

---

## 🌟 Key Highlights & Main Pages

The application is structured into **four core laboratory pages** plus an interactive dashboard:

### 1. Dashboard (`/`)
- **Quick Signal Playground:** Interactive live gate tester directly on the landing page with binary switches, glowing LED output, and real-time formula evaluation.
- **Laboratory Hub:** Instant launchpad for all four specialized modules with key architectural metrics.
- **Academic Metadata:** Course overview, tech stack highlights, and curriculum alignment.

### 2. Number System Converter (`/converter`)
- **Complete Directed Conversions:** Supports all 12 directed cross-base conversions between **Binary (Base 2)**, **Octal (Base 8)**, **Decimal (Base 10)**, and **Hexadecimal (Base 16)**, plus same-base validation.
- **Full Numeric Support:**
  - Standard integers (e.g., `42`, `255`, `101010`)
  - Fractional numbers (e.g., `125.625`, `1010.101`, `2F.C`)
  - Negative signed numbers (e.g., `-19.75`, `-7A.4`)
  - Case-insensitive Hexadecimal (`a–f` or `A–F`)
- **Visual Mathematical Process:**
  - **Decimal to Base:** Repeated division table with quotient, remainder, and bottom-to-top reading arrow (↑).
  - **Decimal Fraction to Base:** Repeated multiplication table with product, extracted digit, remaining fraction, and top-to-bottom reading arrow (↓).
  - **Base to Decimal:** Positional notation expansion table ($Digit \times Base^{Power}$) with accumulated sum.
  - **Binary to Octal/Hex:** Direct 3-bit / 4-bit grouping with zero-padding indicators and digit mapping.
  - **Octal/Hex to Binary:** Direct 3-bit / 4-bit expansion.
  - **Octal $\leftrightarrow$ Hex:** Two-stage bridge via binary.
- **Simultaneous 4-Base Comparison Panel:** Live cards displaying the exact same physical value across Binary, Octal, Decimal, and Hexadecimal simultaneously.
- **Precision Slider:** Select 1 to 10 decimal/fractional digits.
- **History & Presets:** LocalStorage-backed conversion history with one-click restore and educational presets.

### 3. Logic Gate Simulator (`/gates`)
- **All 7 Fundamental Gates:** `AND`, `OR`, `NOT`, `NAND`, `NOR`, `XOR`, and `XNOR`.
- **Interactive Binary Switches:** Toggle inputs A and B between `0` (LOW, 0V) and `1` (HIGH, +5V). Input B is automatically hidden for the single-input `NOT` gate.
- **Animated SVG Schematic:** Standard ANSI/IEEE gate symbols with animated neon glowing signal paths and wire value badges.
- **Dual Output LEDs:** Illuminated neon glow for HIGH (1) and dark bezel for LOW (0).
- **Dynamic Truth Tables:** Full truth table with the currently active row automatically highlighted.
- **Compare All 7 Gates Mode:** Parallel comparator view showing all 7 gates receiving identical inputs A and B in real time.
- **Prediction Challenge Mode:** Interactive quiz game where users analyze input states and predict whether output Y will be 0 or 1 before revealing the result.
- **CSV Truth Table Export:** Download any gate's truth table as a `.csv` file.

### 4. Digital Arithmetic Circuit Laboratory (`/arithmetic`)
- **Four Dedicated Arithmetic Circuits:**
  1. **Half Adder (HA):** $Sum = A \oplus B$, $Carry = A \cdot B$
  2. **Full Adder (FA):** $Sum = A \oplus B \oplus C_{in}$, $C_{out} = AB + C_{in}(A \oplus B)$ (visually decomposed into two Half Adders and an OR gate).
  3. **Half Subtractor (HS):** $Diff = A \oplus B$, $Borrow = \overline{A} \cdot B$
  4. **Full Subtractor (FS):** $Diff = A \oplus B \oplus B_{in}$, $B_{out} = \overline{A}B + \overline{(A \oplus B)}B_{in}$ (visually decomposed into two Half Subtractors and an OR gate).
- **Dedicated Output LEDs:**
  - **SUM:** Cyan LED
  - **CARRY:** Amber LED
  - **DIFFERENCE:** Magenta LED
  - **BORROW:** Coral Red LED
- **Internal Signal Inspection:** Step through intermediate stages ($S_1, C_1, C_2$ and $D_1, B_1, B_2$) to understand semiconductor propagation delays.
- **4-Circuit Comparison Mode:** Side-by-side comparative laboratory evaluating Adders against Subtractors with shared inputs.
- **Truth Table Synchronization:** Full 4-row or 8-row truth tables with active row highlighting and CSV export.

### 5. Learn Digital Electronics (`/learn`)
- **Structured Curriculum Modules:**
  1. Introduction to Digital Electronics & Analog vs. Digital Signals
  2. Number Systems, Radix & Positional Place Values
  3. Conversion Methods & Solved Numerical Problems
  4. Boolean Algebra Axioms, Theorems & De Morgan's Laws
  5. The 7 Fundamental Logic Gates & Universal Logic (NAND/NOR)
  6. Adders, Subtractors & Carry Lookahead Concepts
  7. Combinational Circuits (MUX, DEMUX, Encoders, Decoders) & Sequential Logic (SR, D, JK, T Flip-Flops)
- **Educational Tools:**
  - Searchable topic filter and category navigation.
  - Expandable theory cards with mathematical formulas and step-by-step solved numericals.
  - In-module concept check MCQs with instant answer feedback and explanations.
  - Curriculum progress tracker with localStorage persistence.
  - **10-Question Certification Exam:** Comprehensive DELD assessment with score percentage and an academic achievement badge.
  - Searchable **Digital Electronics Glossary** with key technical definitions.

---

## 🛠 Technology Stack

- **Backend:** Python 3.12, Flask 3.0.3, Jinja2 Templates
- **Testing:** Pytest 9.1.1 (40 automated unit & route tests)
- **Frontend:** Vanilla HTML5, Vanilla CSS3 (Cyber-Lab Glassmorphic Design System), Modern Vanilla JavaScript (ES6)
- **Graphics & Vectors:** Scalable Vector Graphics (SVG), Dynamic Path Styling, Drop-Shadow Glow Filters
- **Storage:** Client-side LocalStorage for theme, progress, and history (no SQL database setup required)

---

## 📂 Project Directory Structure

```text
deld-mini-project/
├── app.py                      # Flask Application Server & API Routes
├── requirements.txt            # Python Dependencies
├── README.md                   # Comprehensive Documentation
├── .gitignore                  # Git Ignored Files
├── logiclab/                   # Core Python Simulation Engine
│   ├── __init__.py             # Package Initializer
│   ├── converters.py           # Multi-base Converter & Math Step Generator
│   ├── gates.py                # 7 Logic Gates Simulator & Truth Tables
│   ├── arithmetic.py           # Half/Full Adders & Subtractors Simulator
│   └── explanations.py         # Course Modules, Quizzes & Glossary Data
├── templates/                  # Jinja2 HTML Templates
│   ├── base.html               # Shared Shell, Nav, Search Modal & Footer
│   ├── index.html              # Landing Page & Quick-Lab Hero Widget
│   ├── number_converter.html   # Page 1: Number System Converter
│   ├── logic_gates.html        # Page 2: Logic Gate Simulator
│   ├── arithmetic_circuits.html# Page 3: Arithmetic Circuit Laboratory
│   └── learn.html              # Page 4: Learn & Certification Hub
├── static/                     # Static Web Assets
│   ├── css/
│   │   └── style.css           # Futuristic Cyber-Lab CSS Design System
│   └── js/
│       ├── main.js             # Global Nav, Theme Toggle, Search Modal
│       ├── converter.js        # Converter Controller & Step Renderer
│       ├── gates.js            # Gate Controller, SVG Paths & Challenge Mode
│       ├── circuits.js         # Animated SVG Arithmetic Circuit Renderer
│       ├── arithmetic.js       # Arithmetic Lab Controller & Compare Mode
│       └── learning.js         # Curriculum Progress & Exam Engine
└── tests/                      # Automated Pytest Test Suite
    ├── test_converters.py      # Unit Tests for All 12 Base Conversions
    ├── test_gates.py           # Unit Tests for All 7 Logic Gates
    ├── test_arithmetic.py      # Unit Tests for HA, FA, HS, FS Circuits
    └── test_api_routes.py      # Integration Tests for Flask Routes & APIs
```

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
- Python 3.10, 3.11, or 3.12 installed on your machine.
- Verify installation:
  ```bash
  python --version
  ```

### 2. Create and Activate Virtual Environment (Recommended)

**Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

**Linux / macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Application

Start the Flask development server:
```bash
python app.py
```

Open your web browser and navigate to:
```text
http://127.0.0.1:5000
```

---

## 🧪 Running Automated Tests

LogicLab X includes 40 comprehensive unit and integration tests covering all base conversion algorithms, gate truth tables, arithmetic circuits, and Flask HTTP/JSON endpoints.

Run the test suite with:
```bash
python -m pytest -v
```

Expected output:
```text
============================= test session starts =============================
collected 40 items

tests/test_api_routes.py::test_main_pages_load PASSED                    [  2%]
tests/test_api_routes.py::test_api_convert_endpoint PASSED               [  5%]
tests/test_api_routes.py::test_api_convert_invalid PASSED                [  7%]
tests/test_api_routes.py::test_api_gate_endpoint PASSED                  [ 10%]
tests/test_api_routes.py::test_api_arithmetic_endpoint PASSED            [ 12%]
tests/test_api_routes.py::test_api_truth_table_csv PASSED                [ 15%]
tests/test_arithmetic.py::test_half_adder_all_permutations PASSED        [ 17%]
tests/test_arithmetic.py::test_full_adder_all_permutations PASSED        [ 20%]
tests/test_arithmetic.py::test_half_subtractor_all_permutations PASSED   [ 22%]
tests/test_arithmetic.py::test_full_subtractor_all_permutations PASSED   [ 25%]
tests/test_arithmetic.py::test_arithmetic_dispatcher PASSED              [ 27%]
tests/test_arithmetic.py::test_compare_all_arithmetic PASSED             [ 30%]
tests/test_converters.py::test_validation_rules PASSED                   [ 32%]
tests/test_converters.py::test_decimal_to_binary_integer PASSED          [ 35%]
tests/test_converters.py::test_binary_to_decimal_integer PASSED          [ 37%]
tests/test_converters.py::test_decimal_to_hexadecimal_integer PASSED     [ 40%]
tests/test_converters.py::test_hexadecimal_to_decimal_integer PASSED     [ 42%]
tests/test_converters.py::test_decimal_to_octal_integer PASSED           [ 45%]
tests/test_converters.py::test_octal_to_decimal_integer PASSED           [ 47%]
tests/test_converters.py::test_binary_to_octal_grouping PASSED           [ 50%]
tests/test_converters.py::test_octal_to_binary_expansion PASSED          [ 52%]
tests/test_converters.py::test_binary_to_hex_grouping PASSED             [ 55%]
tests/test_converters.py::test_hex_to_binary_expansion PASSED            [ 57%]
tests/test_converters.py::test_octal_to_hex_via_binary PASSED            [ 60%]
tests/test_converters.py::test_hex_to_octal_via_binary PASSED            [ 62%]
tests/test_converters.py::test_fractional_conversion PASSED              [ 65%]
tests/test_converters.py::test_negative_numbers PASSED                   [ 67%]
tests/test_converters.py::test_zero_edge_cases PASSED                    [ 70%]
tests/test_converters.py::test_same_base_identity PASSED                 [ 72%]
tests/test_converters.py::test_all_bases_generation PASSED               [ 75%]
tests/test_gates.py::test_and_gate_truth_table PASSED                    [ 77%]
tests/test_gates.py::test_or_gate_truth_table PASSED                     [ 80%]
tests/test_gates.py::test_not_gate_truth_table PASSED                    [ 82%]
tests/test_gates.py::test_nand_gate_truth_table PASSED                   [ 85%]
tests/test_gates.py::test_nor_gate_truth_table PASSED                    [ 87%]
tests/test_gates.py::test_xor_gate_truth_table PASSED                    [ 90%]
tests/test_gates.py::test_xnor_gate_truth_table PASSED                   [ 92%]
tests/test_gates.py::test_simulate_gate_structure PASSED                 [ 95%]
tests/test_gates.py::test_not_gate_structure PASSED                      [ 97%]
tests/test_gates.py::test_compare_all_gates PASSED                       [100%]

============================= 40 passed in 0.42s ==============================
```

---

## 💡 Example Conversions & Simulation Scenarios

### Example 1: Decimal Fraction to Binary
- **Input:** `125.625` (Base 10) $\rightarrow$ Base 2
- **Integer (125):** Repeated division by 2 yields remainders `1, 0, 1, 1, 1, 1, 1`. Read in reverse: `1111101₂`.
- **Fraction (0.625):** Repeated multiplication by 2 extracts integers `1, 0, 1`. Read top-down: `.101₂`.
- **Final Result:** `1111101.101₂`

### Example 2: Hexadecimal to Binary (Direct 4-bit Expansion)
- **Input:** `2F.C₁₆` $\rightarrow$ Base 2
- `2` $\rightarrow$ `0010`
- `F` $\rightarrow$ `1111`
- `C` $\rightarrow$ `1100`
- **Result:** `101111.11₂` (Decimal: `47.75₁₀`)

### Example 3: Full Adder with All HIGH Inputs
- **Inputs:** $A=1$, $B=1$, $C_{in}=1$
- **Stage 1 (HA1):** $S_1 = 1 \oplus 1 = 0$, $C_1 = 1 \cdot 1 = 1$
- **Stage 2 (HA2):** $Sum = S_1 \oplus C_{in} = 0 \oplus 1 = 1$, $C_2 = S_1 \cdot C_{in} = 0 \cdot 1 = 0$
- **Stage 3 (OR Gate):** $C_{out} = C_1 + C_2 = 1 + 0 = 1$
- **Outputs:** $Sum = 1$, $C_{out} = 1$ ($1 + 1 + 1 = 3_{10} = 11_2$)

---

## 🔧 Troubleshooting Common Questions

1. **Port 5000 Already in Use?**
   - If port 5000 is occupied by another service (like macOS AirPlay), run on a different port:
     ```python
     # in app.py or via command line:
     flask run --port 5050
     ```

2. **Characters not displaying on Windows Terminal?**
   - UTF-8 characters are rendered cleanly in the web browser. For terminal logs on older Windows cmd prompts, enable UTF-8 mode:
     ```cmd
     chcp 65001
     ```

3. **No External Database Setup Required:**
   - LogicLab X is designed as a standalone educational sandbox. All state and calculation logic execute deterministically on demand; user preferences and topic progress use browser `localStorage`.

---

## 📜 License & Academic Credits

- **Project:** LogicLab X — Interactive Digital Electronics Playground
- **Academic Context:** College Mini-Project for Digital Electronics & Logic Design (DELD)
- **Coursework Standards:** Aligned with IEEE logic symbology and ANSI digital circuit standards.

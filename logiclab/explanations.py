"""
Educational Content and Curated Knowledge Repository for LogicLab X
Contains structured lessons, solved problems, interactive quiz data,
final certification exam questions, and a comprehensive glossary of Digital Electronics.
"""

LEARNING_MODULES = [
    {
        "id": "intro-digital",
        "title": "1. Introduction to Digital Electronics",
        "category": "Fundamentals",
        "icon": "cpu",
        "summary": "Understand analog vs digital signals, noise immunity, and modern digital systems.",
        "content_html": """
            <h4>Analog vs. Digital Signals</h4>
            <p>An <strong>Analog Signal</strong> is continuous in both time and magnitude. Examples include real-world sound waves, ambient temperature, and light intensity. Because it can take any infinitely divisible voltage value, analog signals are highly susceptible to noise and signal degradation.</p>
            <p>A <strong>Digital Signal</strong> is discrete in time and quantized in magnitude. In binary digital systems, signals are represented by only two discrete voltage levels:</p>
            <ul>
                <li><strong>Logic HIGH (1):</strong> Typically represented by +5V (in TTL logic) or +3.3V (in CMOS logic).</li>
                <li><strong>Logic LOW (0):</strong> Typically represented by 0V (ground level).</li>
            </ul>
            <div class="note-box">
                <strong>Why Digital?</strong> Digital systems offer high noise margins, easy programmability, straightforward data storage, and zero drift over time.
            </div>
        """,
        "key_takeaways": [
            "Analog signals are continuous; digital signals exist in discrete states (0 and 1).",
            "Threshold voltages define what counts as a valid 0 or 1, providing high noise immunity.",
            "Integrated Circuits (ICs) pack billions of nanoscale transistors operating as binary switches."
        ],
        "quiz": {
            "question": "Which characteristic gives digital signals higher noise immunity compared to analog signals?",
            "options": [
                "They use continuous infinite voltages",
                "They operate on discrete voltage thresholds where small noise fluctuations are filtered out",
                "They always require a physical wire",
                "They can only process audio frequencies"
            ],
            "correct": 1,
            "explanation": "Digital logic circuits interpret voltages within distinct ranges (e.g. 2.0V-5.0V as HIGH). As long as noise doesn't cross the threshold into the illegal/transition zone, the binary value remains unaltered."
        }
    },
    {
        "id": "number-systems",
        "title": "2. Number Systems & Place Values",
        "category": "Number Systems",
        "icon": "hash",
        "summary": "Master Base-2, Base-8, Base-10, and Base-16 representations and positional weights.",
        "content_html": """
            <h4>Radix and Positional Notation</h4>
            <p>A positional number system represents a quantity through digits multiplied by powers of the radix (base $R$):</p>
            <p class="formula-block">$$\\text{Value} = \\sum_{i=-m}^{n-1} d_i \\cdot R^i = d_{n-1}R^{n-1} + \\dots + d_0 R^0 + d_{-1}R^{-1} + \\dots + d_{-m}R^{-m}$$</p>
            <div class="table-responsive">
                <table class="lab-table">
                    <thead>
                        <tr><th>System</th><th>Radix (Base)</th><th>Allowed Digits / Symbols</th><th>Application in Computing</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><strong>Binary</strong></td><td>2</td><td>0, 1</td><td>Hardware machine code, transistor states</td></tr>
                        <tr><td><strong>Octal</strong></td><td>8</td><td>0, 1, 2, 3, 4, 5, 6, 7</td><td>Unix file permissions, compact 3-bit grouping</td></tr>
                        <tr><td><strong>Decimal</strong></td><td>10</td><td>0, 1, 2, 3, 4, 5, 6, 7, 8, 9</td><td>Human-readable everyday arithmetic</td></tr>
                        <tr><td><strong>Hexadecimal</strong></td><td>16</td><td>0–9, A–F (A=10, B=11, C=12, D=13, E=14, F=15)</td><td>Memory addresses, web colors, byte notation</td></tr>
                    </tbody>
                </table>
            </div>
            <h4>Bits, Nibbles, and Bytes</h4>
            <ul>
                <li><strong>Bit:</strong> The smallest unit of binary data (single 0 or 1).</li>
                <li><strong>Nibble:</strong> A group of 4 bits (e.g., <code>1010</code> = Hex <code>A</code>).</li>
                <li><strong>Byte:</strong> A group of 8 bits (e.g., <code>11111111</code> = Hex <code>FF</code> = Decimal <code>255</code>).</li>
                <li><strong>Word:</strong> Natural unit of data used by a processor (e.g., 32-bit or 64-bit words).</li>
            </ul>
        """,
        "key_takeaways": [
            "Any number's value is the sum of its digits multiplied by their positional base weights.",
            "Hexadecimal is widely preferred because 1 hex digit represents exactly 4 binary bits (one nibble).",
            "An 8-bit byte can represent $2^8 = 256$ unique unsigned combinations (0 to 255)."
        ],
        "quiz": {
            "question": "How many binary bits can be represented by a single Hexadecimal digit?",
            "options": ["2 bits", "3 bits", "4 bits", "8 bits"],
            "correct": 2,
            "explanation": "Because $2^4 = 16$, exactly 4 binary bits (a nibble) correspond to one hexadecimal digit (0-F)."
        }
    },
    {
        "id": "conversions-theory",
        "title": "3. Conversion Methods & Solved Problems",
        "category": "Number Systems",
        "icon": "arrow-left-right",
        "summary": "Step-by-step algorithms: Repeated division/multiplication, power expansion, and direct bit-grouping.",
        "content_html": """
            <h4>1. Decimal to Any Base: The Double-Dabble Method</h4>
            <p><strong>Integer Part:</strong> Repeatedly divide the decimal number by the target base $R$. Record remainders until quotient is 0. Read remainders from bottom to top (LSB to MSB).</p>
            <p><strong>Fractional Part:</strong> Repeatedly multiply the fraction by target base $R$. Extract the integer digit. Read from top to bottom.</p>

            <h4>2. Any Base to Decimal: Positional Expansion</h4>
            <p>Multiply each digit by $R^i$, where $i$ is the positional index starting from 0 at the radix point to the left, and negative indices $(-1, -2, \\dots)$ to the right.</p>

            <h4>3. Direct Grouping: Binary $\\leftrightarrow$ Hex & Octal</h4>
            <ul>
                <li><strong>Binary to Octal:</strong> Partition bits into groups of 3 starting from the radix point. Pad missing bits with 0s.</li>
                <li><strong>Binary to Hexadecimal:</strong> Partition bits into groups of 4 from the radix point. Pad missing bits with 0s.</li>
            </ul>
        """,
        "solved_examples": [
            {
                "problem": "Convert (125.625)₁₀ to Binary.",
                "solution": "1. Integer part 125 ÷ 2: 125/2=62 R1, 62/2=31 R0, 31/2=15 R1, 15/2=7 R1, 7/2=3 R1, 3/2=1 R1, 1/2=0 R1. Reading bottom-up gives: 1111101₂.\\n2. Fractional part 0.625 × 2: 0.625×2=1.25 (extract 1), 0.25×2=0.5 (extract 0), 0.5×2=1.0 (extract 1, rem 0). Reading top-down gives: .101₂.\\nResult = 1111101.101₂."
            },
            {
                "problem": "Convert (2F.4)₁₆ to Decimal.",
                "solution": "Integer: 2×16¹ + 15×16⁰ = 32 + 15 = 47.\\nFraction: 4×16⁻¹ = 4/16 = 0.25.\\nResult = 47.25₁₀."
            }
        ],
        "key_takeaways": [
            "Integer division remainders are read in reverse order (bottom-to-top / LSB-to-MSB).",
            "Fractional multiplication extracts are read in natural order (top-to-bottom).",
            "Never convert Octal directly to Hex without using Binary as an easy intermediate 3-bit / 4-bit bridge."
        ],
        "quiz": {
            "question": "What is the Octal representation of the binary number 110101₂?",
            "options": ["53₈", "65₈", "35₈", "71₈"],
            "correct": 1,
            "explanation": "Group into sets of 3 from right: (110) (101). (110)₂ = 6₈, (101)₂ = 5₈. Thus, 110101₂ = 65₈."
        }
    },
    {
        "id": "boolean-algebra",
        "title": "4. Boolean Algebra & De Morgan's Laws",
        "category": "Boolean Logic",
        "icon": "book-open",
        "summary": "Postulates, Boolean theorems, De Morgan's laws, and algebraic simplification.",
        "content_html": """
            <h4>Fundamental Boolean Axioms</h4>
            <p>Boolean algebra deals with binary variables ($A, B \\in \\{0, 1\\}$) and three primary operations: AND ($\\cdot$), OR ($+$), and NOT ($\\overline{\\quad}$).</p>
            <div class="table-responsive">
                <table class="lab-table">
                    <thead><tr><th>Law Name</th><th>AND Form</th><th>OR Form</th></tr></thead>
                    <tbody>
                        <tr><td>Identity Law</td><td>$A \\cdot 1 = A$</td><td>$A + 0 = A$</td></tr>
                        <tr><td>Null / Annihilation Law</td><td>$A \\cdot 0 = 0$</td><td>$A + 1 = 1$</td></tr>
                        <tr><td>Idempotent Law</td><td>$A \\cdot A = A$</td><td>$A + A = A$</td></tr>
                        <tr><td>Complement Law</td><td>$A \\cdot \\overline{A} = 0$</td><td>$A + \\overline{A} = 1$</td></tr>
                        <tr><td>Involution (Double NOT)</td><td colspan="2">$\\overline{\\overline{A}} = A$</td></tr>
                        <tr><td>Commutative Law</td><td>$A \\cdot B = B \\cdot A$</td><td>$A + B = B + A$</td></tr>
                        <tr><td>Associative Law</td><td>$A \\cdot (B \\cdot C) = (A \\cdot B) \\cdot C$</td><td>$A + (B + C) = (A + B) + C$</td></tr>
                        <tr><td>Distributive Law</td><td>$A \\cdot (B + C) = AB + AC$</td><td>$A + (B \\cdot C) = (A + B)(A + C)$</td></tr>
                    </tbody>
                </table>
            </div>

            <h4>De Morgan's Theorems</h4>
            <p><strong>First Theorem:</strong> The complement of a product equals the sum of complements:</p>
            <p class="formula-block">$$\\overline{A \\cdot B} = \\overline{A} + \\overline{B}$$</p>
            <p><strong>Second Theorem:</strong> The complement of a sum equals the product of complements:</p>
            <p class="formula-block">$$\\overline{A + B} = \\overline{A} \\cdot \\overline{B}$$</p>
        """,
        "key_takeaways": [
            "De Morgan's laws state: 'Break the line, change the sign.'",
            "Boolean simplification reduces the number of logic gates needed in silicon layout, saving chip area and power."
        ],
        "quiz": {
            "question": "According to De Morgan's Law, what is the equivalent expression for ¬(A + B)?",
            "options": ["Ā · B̄", "Ā + B̄", "A · B", "¬(A · B)"],
            "correct": 0,
            "explanation": "De Morgan's second law states that ¬(A + B) = Ā · B̄. The NOR operation is equivalent to a bubbled AND."
        }
    },
    {
        "id": "logic-gates-deep",
        "title": "5. Logic Gates & Universal Logic",
        "category": "Logic Gates",
        "icon": "zap",
        "summary": "Detailed analysis of all 7 gates, ANSI symbols, truth tables, and why NAND & NOR are universal.",
        "content_html": """
            <h4>The 7 Primary Logic Gates</h4>
            <ul>
                <li><strong>AND ($Y = A \\cdot B$):</strong> Output is 1 only when all inputs are 1. Used for enabling/masking signals.</li>
                <li><strong>OR ($Y = A + B$):</strong> Output is 1 if any input is 1. Used for combining condition flags.</li>
                <li><strong>NOT ($Y = \\overline{A}$):</strong> Unary inverter gate. Inverts logic level.</li>
                <li><strong>NAND ($Y = \\overline{A \\cdot B}$):</strong> Inverted AND. Output is 0 only when both inputs are 1.</li>
                <li><strong>NOR ($Y = \\overline{A + B}$):</strong> Inverted OR. Output is 1 only when all inputs are 0.</li>
                <li><strong>XOR ($Y = A \\oplus B = A\\overline{B} + \\overline{A}B$):</strong> Odd detector / Difference gate. Output 1 when inputs differ.</li>
                <li><strong>XNOR ($Y = \\overline{A \\oplus B} = AB + \\overline{A}\\overline{B}$):</strong> Equivalence detector. Output 1 when inputs are equal.</li>
            </ul>

            <h4>Universal Gates: NAND & NOR</h4>
            <p>NAND and NOR gates are termed <strong>universal gates</strong> because any arbitrary Boolean function (AND, OR, NOT, XOR, XNOR) can be implemented using NAND gates alone or NOR gates alone.</p>
        """,
        "key_takeaways": [
            "NAND and NOR can synthesize any logic function, making them cheaper to manufacture uniformly in CMOS silicon.",
            "XOR is the fundamental core of binary addition and parity checking."
        ],
        "quiz": {
            "question": "Why are NAND and NOR known as 'Universal Gates'?",
            "options": [
                "Because they are used in all universes",
                "Because any logic circuit can be designed using only NAND or only NOR gates",
                "Because they consume zero electrical power",
                "Because they have infinite input pins"
            ],
            "correct": 1,
            "explanation": "NAND and NOR gates form a complete functional set. Any boolean equation can be implemented using exclusively NAND or exclusively NOR gates."
        }
    },
    {
        "id": "arithmetic-circuits",
        "title": "6. Adders, Subtractors & Carry Propagation",
        "category": "Arithmetic Circuits",
        "icon": "layers",
        "summary": "Half Adder vs Full Adder, Half Subtractor vs Full Subtractor, and multi-bit Ripple Carry Adders.",
        "content_html": """
            <h4>Half Adder vs. Full Adder</h4>
            <p>A <strong>Half Adder</strong> computes the sum of two single-bit operands $A$ and $B$, generating $Sum = A \\oplus B$ and $Carry = A \\cdot B$. However, it has no input for a carry from a preceding lower bit stage.</p>
            <p>A <strong>Full Adder</strong> solves this by adding three inputs: $A$, $B$, and $C_{in}$. It is implemented internally using two Half Adders and an OR gate:</p>
            <ul>
                <li>HA 1: $S_1 = A \\oplus B$, $C_1 = A \\cdot B$</li>
                <li>HA 2: $Sum = S_1 \\oplus C_{in}$, $C_2 = S_1 \\cdot C_{in}$</li>
                <li>OR Gate: $C_{out} = C_1 + C_2 = (A \\cdot B) + ((A \\oplus B) \\cdot C_{in})$</li>
            </ul>

            <h4>Half Subtractor vs. Full Subtractor</h4>
            <p>A <strong>Half Subtractor</strong> computes $A - B$, generating Difference $D = A \\oplus B$ and Borrow $B = \\overline{A} \\cdot B$.</p>
            <p>A <strong>Full Subtractor</strong> computes $A - B - B_{in}$ using two Half Subtractors and an OR gate for borrow combination: $B_{out} = (\\overline{A} \\cdot B) + (\\overline{A \\oplus B} \\cdot B_{in})$.</p>
        """,
        "key_takeaways": [
            "A Full Adder requires 2 XOR gates, 2 AND gates, and 1 OR gate.",
            "Multi-bit addition chains Full Adders where each stage's $C_{out}$ connects to the next stage's $C_{in}$."
        ],
        "quiz": {
            "question": "How many Half Adders and OR gates are needed to construct a 1-bit Full Adder?",
            "options": [
                "1 Half Adder and 2 OR gates",
                "2 Half Adders and 1 OR gate",
                "3 Half Adders and no OR gate",
                "2 Half Adders and 2 OR gates"
            ],
            "correct": 1,
            "explanation": "A standard Full Adder is constructed from exactly two Half Adders (HA1 and HA2) and one OR gate to combine the carry outputs C1 and C2."
        }
    },
    {
        "id": "combinational-sequential",
        "title": "7. Combinational & Sequential Logic Foundations",
        "category": "Advanced Circuits",
        "icon": "shuffle",
        "summary": "Explore Multiplexers (MUX), Demultiplexers, Encoders, Decoders, and Latches / Flip-Flops.",
        "content_html": """
            <h4>Combinational Logic</h4>
            <p>In <strong>combinational circuits</strong>, the output at any instant depends <em>strictly</em> on the current combination of inputs (no memory or feedback loops).</p>
            <ul>
                <li><strong>Multiplexer (MUX):</strong> A data selector with $2^n$ data inputs, $n$ select lines, and 1 output.</li>
                <li><strong>Demultiplexer (DEMUX):</strong> Takes 1 input and routes it to one of $2^n$ outputs based on $n$ select lines.</li>
                <li><strong>Encoder:</strong> Converts $2^n$ input lines into an $n$-bit binary code (e.g. 8-to-3 Octal Priority Encoder).</li>
                <li><strong>Decoder:</strong> Converts an $n$-bit binary input into $2^n$ unique output activations (e.g. 3-to-8 decoder, 7-segment display decoder).</li>
            </ul>

            <h4>Sequential Logic & Flip-Flops</h4>
            <p>In <strong>sequential circuits</strong>, outputs depend on both current inputs AND past output states (memory element). Core flip-flop types include:</p>
            <ul>
                <li><strong>SR Flip-Flop:</strong> Set-Reset latch. Invalid when $S=1, R=1$.</li>
                <li><strong>D Flip-Flop:</strong> Data / Delay latch. Stores input $D$ on clock edge. Eliminates invalid state.</li>
                <li><strong>JK Flip-Flop:</strong> Universal flip-flop. Toggles output when $J=1, K=1$.</li>
                <li><strong>T Flip-Flop:</strong> Toggle flip-flop. Toggles on every clock pulse when $T=1$ (basis of binary counters).</li>
            </ul>
        """,
        "key_takeaways": [
            "Combinational logic has no memory; sequential logic uses feedback and clock signals to store binary state.",
            "Flip-flops form registers, CPU cache SRAM, program counters, and finite state machines (FSM)."
        ],
        "quiz": {
            "question": "What is the primary difference between combinational logic and sequential logic?",
            "options": [
                "Combinational logic uses transistors while sequential does not",
                "Combinational outputs depend only on present inputs; sequential outputs depend on present inputs and past history/clock",
                "Sequential logic cannot do arithmetic",
                "Combinational circuits require a constant clock pulse"
            ],
            "correct": 1,
            "explanation": "Combinational circuits have no memory element; outputs reflect the current input states. Sequential circuits use feedback or latches to store state over time."
        }
    }
]

FINAL_EXAM_QUESTIONS = [
    {
        "id": 1,
        "question": "What is the binary representation of decimal 53₁₀?",
        "options": ["110101₂", "111001₂", "101101₂", "110011₂"],
        "correct": 0,
        "explanation": "53 = 32 + 16 + 4 + 1 = 2⁵ + 2⁴ + 2² + 2⁰ = 110101₂."
    },
    {
        "id": 2,
        "question": "Which logic gate outputs 1 if and only if its two inputs are different?",
        "options": ["AND", "OR", "XOR", "XNOR"],
        "correct": 2,
        "explanation": "XOR (Exclusive OR) outputs 1 when inputs are unequal (0,1 or 1,0)."
    },
    {
        "id": 3,
        "question": "What is the Carry-out (Cout) equation for a Full Adder with inputs A, B, and Cin?",
        "options": [
            "Cout = A ⊕ B ⊕ Cin",
            "Cout = (A · B) + (B · Cin) + (A · Cin)",
            "Cout = A + B + Cin",
            "Cout = Ā · B · Cin"
        ],
        "correct": 1,
        "explanation": "The carry-out is generated when any two or all three inputs are 1: AB + BCin + ACin."
    },
    {
        "id": 4,
        "question": "Convert the Hexadecimal value (3E)₁₆ to Decimal.",
        "options": ["58₁₀", "60₁₀", "62₁₀", "64₁₀"],
        "correct": 2,
        "explanation": "3 × 16¹ + 14 × 16⁰ = 48 + 14 = 62₁₀."
    },
    {
        "id": 5,
        "question": "In a Half Subtractor, when A=0 and B=1, what are the Difference and Borrow outputs?",
        "options": [
            "Difference = 0, Borrow = 0",
            "Difference = 1, Borrow = 0",
            "Difference = 0, Borrow = 1",
            "Difference = 1, Borrow = 1"
        ],
        "correct": 3,
        "explanation": "0 - 1 requires a borrow (Borrow=1). In base 2, (2 + 0) - 1 = 1 (Difference=1)."
    },
    {
        "id": 6,
        "question": "Which of the following gate combinations are Universal Gates?",
        "options": ["AND and OR", "NOT and XOR", "NAND and NOR", "OR and XNOR"],
        "correct": 2,
        "explanation": "NAND and NOR are universal gates capable of synthesizing any logic circuit."
    },
    {
        "id": 7,
        "question": "According to De Morgan's Law, ¬(A · B) is algebraically equivalent to:",
        "options": ["Ā · B̄", "Ā + B̄", "¬(A + B)", "A + B"],
        "correct": 1,
        "explanation": "¬(A · B) = Ā + B̄ ('break the line, change the sign')."
    },
    {
        "id": 8,
        "question": "How many select lines does an 8-to-1 Multiplexer (MUX) require?",
        "options": ["2 select lines", "3 select lines", "4 select lines", "8 select lines"],
        "correct": 1,
        "explanation": "An $2^n$-to-1 MUX requires $n$ select lines. For 8 inputs, $2^3 = 8$, so 3 select lines are needed."
    },
    {
        "id": 9,
        "question": "What is the result of binary addition 1₂ + 1₂?",
        "options": ["Sum 0, Carry 0", "Sum 1, Carry 0", "Sum 0, Carry 1", "Sum 1, Carry 1"],
        "correct": 2,
        "explanation": "1 + 1 = 2₁₀ = 10₂, meaning Sum is 0 and Carry is 1."
    },
    {
        "id": 10,
        "question": "What is the 3-bit binary equivalent of Octal digit 7₈?",
        "options": ["101₂", "110₂", "111₂", "011₂"],
        "correct": 2,
        "explanation": "7₈ = 4 + 2 + 1 = 111₂."
    }
]

GLOSSARY_TERMS = [
    {"term": "ALU (Arithmetic Logic Unit)", "def": "The high-speed digital circuit inside a CPU that performs arithmetic (addition, subtraction) and bitwise logical operations."},
    {"term": "Binary (Base-2)", "def": "The foundational numbering system in electronics utilizing two discrete symbols: 0 and 1."},
    {"term": "Bit", "def": "A single binary digit (abbreviation of Binary Digit), representing either a 0 or 1."},
    {"term": "Boolean Algebra", "def": "A branch of algebra dealing with truth values true (1) and false (0), formalised by George Boole."},
    {"term": "Borrow", "def": "A signal generated during subtraction when the subtrahend is greater than the minuend."},
    {"term": "Carry", "def": "A signal generated during addition when the sum of digits exceeds the maximum digit value of the base."},
    {"term": "De Morgan's Laws", "def": "Two transformation rules relating conjunctions and disjunctions of propositions through logical negation: ¬(A·B)=Ā+B̄ and ¬(A+B)=Ā·B̄."},
    {"term": "Decoder", "def": "A combinational circuit that converts an n-bit binary input code into at most 2^n unique output lines."},
    {"term": "Demultiplexer (DEMUX)", "def": "A circuit that takes a single input signal and directs it to one of multiple output channels based on select lines."},
    {"term": "Flip-Flop", "def": "A bistable multivibrator circuit with two stable states that can be used to store state information (1 bit of memory)."},
    {"term": "Full Adder", "def": "A logic circuit that adds three 1-bit binary digits (A, B, and Carry-in) and outputs a Sum and a Carry-out."},
    {"term": "Full Subtractor", "def": "A logic circuit that subtracts two bits and a borrow-in, producing Difference and Borrow-out."},
    {"term": "Half Adder", "def": "A circuit adding two single bits (A, B) producing Sum (A XOR B) and Carry (A AND B) without carry-in."},
    {"term": "Half Subtractor", "def": "A circuit subtracting bit B from bit A producing Difference (A XOR B) and Borrow (NOT A AND B)."},
    {"term": "Hexadecimal (Base-16)", "def": "A radix-16 number system using digits 0–9 and letters A–F to compactly represent 4-bit nibbles."},
    {"term": "Logic Gate", "def": "An idealized physical device implementing a Boolean function using semiconductor transistors."},
    {"term": "Multiplexer (MUX)", "def": "A combinational circuit that selects binary information from one of many input lines and directs it to a single output."},
    {"term": "Nibble", "def": "A collection of 4 adjacent binary bits, corresponding to one hexadecimal digit."},
    {"term": "Noise Margin", "def": "The allowable noise voltage that can be added to an input signal without causing an undesirable change in circuit output."},
    {"term": "Octal (Base-8)", "def": "A radix-8 numbering system using digits 0–7, with each digit corresponding to a 3-bit binary group."},
    {"term": "Propagation Delay", "def": "The time delay between the application of an input signal and the transition of the resulting output signal."},
    {"term": "Truth Table", "def": "A mathematical table setting out the functional values of logical propositions for each combination of inputs."},
    {"term": "Universal Gate", "def": "A logic gate (such as NAND or NOR) that can implement any Boolean function without using any other gate types."}
]

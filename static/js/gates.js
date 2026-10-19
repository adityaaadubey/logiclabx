/**
 * LogicLab X — Logic Gate Simulator Controller (gates.js)
 * Simulates all 7 logic gates with animated SVG schematics,
 * wire signal paths, LED indicators, active truth tables, Compare Mode, and Challenge Mode.
 */

document.addEventListener("DOMContentLoaded", function() {
    // Current State
    let currentGate = "AND";
    let stateA = 0;
    let stateB = 0;

    // Challenge Mode State
    let isChallengeMode = false;
    let challengeScore = 0;
    let challengeTotal = 0;
    let currentChallengeExpected = 0;

    // DOM Elements
    const gateTabBtns = document.querySelectorAll(".gate-tab-btn");
    const switchA = document.getElementById("gate-switch-a");
    const switchB = document.getElementById("gate-switch-b");
    const switchBContainer = document.getElementById("switch-b-container");
    const switchAStatus = document.getElementById("switch-a-status");
    const switchBStatus = document.getElementById("switch-b-status");
    const mainLed = document.getElementById("main-gate-led");
    const gateOutputText = document.getElementById("gate-output-text");

    const currentGateTitle = document.getElementById("current-gate-title");
    const currentGateCategory = document.getElementById("current-gate-category");
    const gateBooleanExpr = document.getElementById("gate-boolean-expression");
    const gatePlainExplanation = document.getElementById("gate-plain-explanation");
    const gateDescText = document.getElementById("gate-desc-text");
    const btnExportCsv = document.getElementById("btn-export-csv");

    // SVG Elements
    const wireA = document.getElementById("wire-a");
    const wireB = document.getElementById("wire-b");
    const wireY = document.getElementById("wire-y");
    const badgeA = document.getElementById("svg-badge-a");
    const badgeB = document.getElementById("svg-badge-b");
    const badgeY = document.getElementById("svg-badge-y");
    const badgeBGroup = document.getElementById("badge-b-group");
    const svgLabelB = document.getElementById("svg-label-b");
    const svgLedCore = document.getElementById("svg-led-core");
    const gateSymbolGroup = document.getElementById("gate-symbol-group");

    // Truth Table Elements
    const truthTableBody = document.getElementById("truth-table-body");
    const thB = document.getElementById("th-b");

    // Mode Toggle Elements
    const btnToggleCompare = document.getElementById("btn-toggle-compare-mode");
    const btnCloseCompare = document.getElementById("btn-close-compare");
    const singleGateWorkbench = document.getElementById("single-gate-workbench");
    const compareModeContainer = document.getElementById("compare-mode-container");
    const compareCardsGrid = document.getElementById("compare-cards-grid");
    const compareSwitchA = document.getElementById("compare-switch-a");
    const compareSwitchB = document.getElementById("compare-switch-b");

    const btnToggleChallenge = document.getElementById("btn-toggle-challenge-mode");
    const challengeBanner = document.getElementById("challenge-banner");
    const challengeScoreVal = document.getElementById("challenge-score-val");
    const challengeTotalVal = document.getElementById("challenge-total-val");
    const challengeFeedback = document.getElementById("challenge-feedback");
    const btnGuess0 = document.getElementById("btn-guess-0");
    const btnGuess1 = document.getElementById("btn-guess-1");
    const btnNextChallenge = document.getElementById("btn-next-challenge");

    const btnResetGate = document.getElementById("btn-reset-gate");
    const btnRandomInputs = document.getElementById("btn-random-inputs");

    // --- SVG ANSI Gate Symbol Paths ---
    const GATE_SVG_PATHS = {
        AND: `
            <path d="M 0 0 L 60 0 C 105 0 105 120 60 120 L 0 120 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-cyan)" stroke-width="3.5"/>
            <line x1="0" y1="40" x2="-20" y2="40" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="0" y1="80" x2="-20" y2="80" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="100" y1="60" x2="160" y2="60" stroke="var(--border-color)" stroke-width="3"/>
            <text x="45" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="20" font-weight="bold" text-anchor="middle">&amp;</text>
        `,
        OR: `
            <path d="M 0 0 Q 30 60 0 120 Q 75 120 110 60 Q 75 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-cyan)" stroke-width="3.5"/>
            <line x1="15" y1="40" x2="-20" y2="40" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="15" y1="80" x2="-20" y2="80" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="110" y1="60" x2="160" y2="60" stroke="var(--border-color)" stroke-width="3"/>
            <text x="45" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="20" font-weight="bold" text-anchor="middle">≥</text>
        `,
        NOT: `
            <polygon points="0,15 90,60 0,105" fill="var(--bg-surface-elevated)" stroke="var(--neon-cyan)" stroke-width="3.5"/>
            <circle cx="100" cy="60" r="10" fill="var(--bg-surface-elevated)" stroke="var(--neon-cyan)" stroke-width="3"/>
            <line x1="0" y1="60" x2="-20" y2="60" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="110" y1="60" x2="160" y2="60" stroke="var(--border-color)" stroke-width="3"/>
            <text x="35" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="20" font-weight="bold" text-anchor="middle">1</text>
        `,
        NAND: `
            <path d="M 0 0 L 60 0 C 105 0 105 120 60 120 L 0 120 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-violet)" stroke-width="3.5"/>
            <circle cx="108" cy="60" r="10" fill="var(--bg-surface-elevated)" stroke="var(--neon-violet)" stroke-width="3"/>
            <line x1="0" y1="40" x2="-20" y2="40" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="0" y1="80" x2="-20" y2="80" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="118" y1="60" x2="160" y2="60" stroke="var(--border-color)" stroke-width="3"/>
            <text x="45" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="20" font-weight="bold" text-anchor="middle">&amp;</text>
        `,
        NOR: `
            <path d="M 0 0 Q 30 60 0 120 Q 75 120 110 60 Q 75 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-violet)" stroke-width="3.5"/>
            <circle cx="120" cy="60" r="10" fill="var(--bg-surface-elevated)" stroke="var(--neon-violet)" stroke-width="3"/>
            <line x1="15" y1="40" x2="-20" y2="40" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="15" y1="80" x2="-20" y2="80" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="130" y1="60" x2="160" y2="60" stroke="var(--border-color)" stroke-width="3"/>
            <text x="45" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="20" font-weight="bold" text-anchor="middle">≥</text>
        `,
        XOR: `
            <path d="M -12 0 Q 18 60 -12 120" fill="none" stroke="var(--neon-cyan)" stroke-width="3.5"/>
            <path d="M 0 0 Q 30 60 0 120 Q 75 120 110 60 Q 75 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-cyan)" stroke-width="3.5"/>
            <line x1="5" y1="40" x2="-20" y2="40" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="5" y1="80" x2="-20" y2="80" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="110" y1="60" x2="160" y2="60" stroke="var(--border-color)" stroke-width="3"/>
            <text x="45" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="20" font-weight="bold" text-anchor="middle">=1</text>
        `,
        XNOR: `
            <path d="M -12 0 Q 18 60 -12 120" fill="none" stroke="var(--neon-violet)" stroke-width="3.5"/>
            <path d="M 0 0 Q 30 60 0 120 Q 75 120 110 60 Q 75 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-violet)" stroke-width="3.5"/>
            <circle cx="120" cy="60" r="10" fill="var(--bg-surface-elevated)" stroke="var(--neon-violet)" stroke-width="3"/>
            <line x1="5" y1="40" x2="-20" y2="40" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="5" y1="80" x2="-20" y2="80" stroke="var(--border-color)" stroke-width="3"/>
            <line x1="130" y1="60" x2="160" y2="60" stroke="var(--border-color)" stroke-width="3"/>
            <text x="45" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="20" font-weight="bold" text-anchor="middle">=1</text>
        `
    };

    // --- Main Simulation Update Function ---
    async function updateGateSimulation() {
        // Handle NOT gate single input requirement
        const isNot = (currentGate === "NOT");
        if (isNot) {
            if (switchBContainer) switchBContainer.style.display = "none";
            if (wireB) wireB.style.display = "none";
            if (badgeBGroup) badgeBGroup.style.display = "none";
            if (svgLabelB) svgLabelB.style.display = "none";
            if (thB) thB.style.display = "none";
        } else {
            if (switchBContainer) switchBContainer.style.display = "flex";
            if (wireB) wireB.style.display = "block";
            if (badgeBGroup) badgeBGroup.style.display = "block";
            if (svgLabelB) svgLabelB.style.display = "block";
            if (thB) thB.style.display = "table-cell";
        }

        // Call backend API
        try {
            const resp = await fetch("/api/gate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gate: currentGate,
                    a: stateA,
                    b: isNot ? 0 : stateB
                })
            });

            const data = await resp.json();
            if (!resp.ok || !data.success) {
                console.error("Gate API error:", data.error);
                return;
            }

            // Update UI with calculated output
            currentGateTitle.textContent = `${data.name} Gate`;
            currentGateCategory.textContent = `${data.category} Gate`;
            gateBooleanExpr.textContent = data.expression;
            gatePlainExplanation.textContent = data.explanation;
            gateDescText.textContent = data.description;
            btnExportCsv.href = `/api/truth-table/csv?type=gate&name=${data.gate}`;

            const outY = data.output;
            currentChallengeExpected = outY;

            // Update Switch A UI
            switchA.textContent = stateA;
            switchA.setAttribute("data-state", stateA);
            switchA.className = "binary-switch " + (stateA === 1 ? "on" : "off");
            switchAStatus.textContent = stateA === 1 ? "HIGH (+5V)" : "LOW (0V)";

            // Update Switch B UI
            if (!isNot) {
                switchB.textContent = stateB;
                switchB.setAttribute("data-state", stateB);
                switchB.className = "binary-switch " + (stateB === 1 ? "on" : "off");
                switchBStatus.textContent = stateB === 1 ? "HIGH (+5V)" : "LOW (0V)";
            }

            // Update Output LED
            if (outY === 1) {
                mainLed.className = "led-indicator led-on";
                svgLedCore.className = "led-svg-core led-on";
                gateOutputText.textContent = "1 (HIGH)";
                gateOutputText.className = "output-status-bold text-success";
            } else {
                mainLed.className = "led-indicator led-off";
                svgLedCore.className = "led-svg-core led-off";
                gateOutputText.textContent = "0 (LOW)";
                gateOutputText.className = "output-status-bold text-muted";
            }

            // Update Animated SVG Wire States
            if (wireA) wireA.className.baseVal = "circuit-wire " + (stateA === 1 ? "wire-high" : "wire-low");
            if (badgeA) badgeA.textContent = stateA;

            if (!isNot && wireB) {
                wireB.className.baseVal = "circuit-wire " + (stateB === 1 ? "wire-high" : "wire-low");
                if (badgeB) badgeB.textContent = stateB;
            }

            if (wireY) wireY.className.baseVal = "circuit-wire " + (outY === 1 ? "wire-high" : "wire-low");
            if (badgeY) badgeY.textContent = outY;

            // Render SVG Gate Symbol
            if (gateSymbolGroup && GATE_SVG_PATHS[currentGate]) {
                gateSymbolGroup.innerHTML = GATE_SVG_PATHS[currentGate];
            }

            // Render Truth Table and highlight active row
            renderTruthTable(data.truth_table, isNot);

        } catch (err) {
            console.error("Simulation error:", err);
        }
    }

    // --- Render Truth Table ---
    function renderTruthTable(rows, isNot) {
        if (!truthTableBody) return;
        truthTableBody.innerHTML = rows.map(r => `
            <tr class="${r.is_active ? 'active-row' : ''}">
                <td class="mono-font">${r.row_index + 1}</td>
                <td class="mono-font">${r.a}</td>
                ${isNot ? '' : `<td class="mono-font">${r.b}</td>`}
                <td class="mono-font font-weight-bold ${r.y === 1 ? 'text-success' : 'text-muted'}">${r.y}</td>
            </tr>
        `).join("");
    }

    // --- Switch A & B Click Listeners ---
    switchA.addEventListener("click", function() {
        stateA = (stateA === 1) ? 0 : 1;
        updateGateSimulation();
    });

    switchB.addEventListener("click", function() {
        stateB = (stateB === 1) ? 0 : 1;
        updateGateSimulation();
    });

    // --- Gate Tabs Selection ---
    gateTabBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            gateTabBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            currentGate = this.getAttribute("data-gate");
            updateGateSimulation();
            if (window.showToast) showToast(`Switched to ${currentGate} Gate`);
        });
    });

    // --- Reset & Random Controls ---
    btnResetGate.addEventListener("click", function() {
        stateA = 0;
        stateB = 0;
        updateGateSimulation();
        if (window.showToast) showToast("Inputs reset to 0.");
    });

    btnRandomInputs.addEventListener("click", function() {
        stateA = Math.random() >= 0.5 ? 1 : 0;
        stateB = Math.random() >= 0.5 ? 1 : 0;
        updateGateSimulation();
        if (window.showToast) showToast(`Randomized inputs: A=${stateA}, B=${stateB}`);
    });

    // --- Preset Combinations Strip ---
    document.querySelectorAll(".preset-pill").forEach(pill => {
        pill.addEventListener("click", function() {
            stateA = parseInt(this.getAttribute("data-a"), 10);
            stateB = parseInt(this.getAttribute("data-b"), 10);
            updateGateSimulation();
            if (window.showToast) showToast(`Loaded inputs: A=${stateA}, B=${stateB}`);
        });
    });

    // --- Parallel Compare All 7 Gates Mode ---
    async function updateCompareMode() {
        const ca = parseInt(compareSwitchA.getAttribute("data-state"), 10);
        const cb = parseInt(compareSwitchB.getAttribute("data-state"), 10);

        try {
            const resp = await fetch("/api/gates/compare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ a: ca, b: cb })
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) return;

            const gates = data.data.gates;
            compareCardsGrid.innerHTML = Object.keys(gates).map(gname => {
                const g = gates[gname];
                const isHigh = (g.output === 1);
                return `
                    <div class="gate-compare-card">
                        <span class="badge ${isHigh ? 'badge-cyan' : 'badge-emerald'}">${g.category}</span>
                        <h4 class="gate-compare-name">${g.name}</h4>
                        <div class="gate-compare-expr">${g.expression}</div>
                        <div class="led-indicator ${isHigh ? 'led-on' : 'led-off'}">
                            <span class="led-core"></span>
                        </div>
                        <span class="output-status-bold ${isHigh ? 'text-success' : 'text-muted'}">
                            Output Y = ${g.output}
                        </span>
                        <p class="small text-muted">${g.explanation}</p>
                    </div>
                `;
            }).join("");

        } catch (e) {
            console.error(e);
        }
    }

    if (btnToggleCompare) {
        btnToggleCompare.addEventListener("click", function() {
            singleGateWorkbench.style.display = "none";
            compareModeContainer.style.display = "block";
            updateCompareMode();
            if (window.showToast) showToast("Entered Compare-Gates Mode.");
        });
    }

    if (btnCloseCompare) {
        btnCloseCompare.addEventListener("click", function() {
            compareModeContainer.style.display = "none";
            singleGateWorkbench.style.display = "grid";
        });
    }

    if (compareSwitchA) {
        compareSwitchA.addEventListener("click", function() {
            const cur = parseInt(this.getAttribute("data-state"), 10);
            const nxt = cur === 1 ? 0 : 1;
            this.setAttribute("data-state", nxt);
            this.textContent = nxt;
            this.className = "binary-switch " + (nxt === 1 ? "on" : "off");
            updateCompareMode();
        });
    }

    if (compareSwitchB) {
        compareSwitchB.addEventListener("click", function() {
            const cur = parseInt(this.getAttribute("data-state"), 10);
            const nxt = cur === 1 ? 0 : 1;
            this.setAttribute("data-state", nxt);
            this.textContent = nxt;
            this.className = "binary-switch " + (nxt === 1 ? "on" : "off");
            updateCompareMode();
        });
    }

    // --- Interactive Prediction Challenge Mode ---
    function setupNewChallenge() {
        const gateList = ["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"];
        currentGate = gateList[Math.floor(Math.random() * gateList.length)];

        // Select tab button visually
        gateTabBtns.forEach(b => {
            if (b.getAttribute("data-gate") === currentGate) b.classList.add("active");
            else b.classList.remove("active");
        });

        stateA = Math.random() >= 0.5 ? 1 : 0;
        stateB = Math.random() >= 0.5 ? 1 : 0;

        challengeFeedback.style.display = "none";
        btnGuess0.disabled = false;
        btnGuess1.disabled = false;

        updateGateSimulation();
    }

    if (btnToggleChallenge) {
        btnToggleChallenge.addEventListener("click", function() {
            isChallengeMode = !isChallengeMode;
            if (isChallengeMode) {
                challengeBanner.style.display = "block";
                setupNewChallenge();
                if (window.showToast) showToast("Challenge Mode Active! Predict the outputs.");
            } else {
                challengeBanner.style.display = "none";
            }
        });
    }

    function handleChallengeGuess(guess) {
        challengeTotal++;
        const isCorrect = (guess === currentChallengeExpected);
        if (isCorrect) challengeScore++;

        challengeScoreVal.textContent = challengeScore;
        challengeTotalVal.textContent = challengeTotal;

        challengeFeedback.style.display = "block";
        if (isCorrect) {
            challengeFeedback.className = "challenge-feedback-box correct";
            challengeFeedback.innerHTML = `<strong>Correct!</strong> For ${currentGate} with input A=${stateA}${currentGate !== "NOT" ? ` and B=${stateB}` : ""}, output Y is indeed <strong>${currentChallengeExpected}</strong>.`;
        } else {
            challengeFeedback.className = "challenge-feedback-box incorrect";
            challengeFeedback.innerHTML = `<strong>Not quite!</strong> Expected <strong>${currentChallengeExpected}</strong> for ${currentGate} with current inputs. Check the truth table below.`;
        }

        btnGuess0.disabled = true;
        btnGuess1.disabled = true;
    }

    if (btnGuess0) btnGuess0.addEventListener("click", () => handleChallengeGuess(0));
    if (btnGuess1) btnGuess1.addEventListener("click", () => handleChallengeGuess(1));
    if (btnNextChallenge) btnNextChallenge.addEventListener("click", setupNewChallenge);

    // Initial setup
    updateGateSimulation();
});

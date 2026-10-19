/**
 * LogicLab X — Arithmetic Circuit Laboratory Controller (arithmetic.js)
 * Manages Half Adder, Full Adder, Half Subtractor, Full Subtractor simulators,
 * signal propagation inspector, truth tables, and side-by-side comparative mode.
 */

document.addEventListener("DOMContentLoaded", function() {
    let currentCircuit = "HALF_ADDER";
    let stateA = 0;
    let stateB = 0;
    let stateCinBin = 0;
    let isStepInspectOpen = false;

    // DOM Controls
    const circuitTabs = document.querySelectorAll("[data-circuit]");
    const switchA = document.getElementById("arith-switch-a");
    const switchB = document.getElementById("arith-switch-b");
    const switchCin = document.getElementById("arith-switch-cin");
    const switchCinContainer = document.getElementById("switch-cin-container");
    const switchCinLabel = document.getElementById("switch-cin-label");
    const switchALbl = document.getElementById("arith-switch-a-lbl");
    const switchBLbl = document.getElementById("arith-switch-b-lbl");
    const switchCinLbl = document.getElementById("arith-switch-cin-lbl");

    const arithCircuitBadge = document.getElementById("arith-circuit-badge");
    const arithCircuitTitle = document.getElementById("arith-circuit-title");
    const formulaOut1 = document.getElementById("formula-out-1");
    const formulaOut2 = document.getElementById("formula-out-2");
    const arithPlainExplanation = document.getElementById("arith-plain-explanation");
    const arithAppDesc = document.getElementById("arith-app-desc");
    const btnExportCsv = document.getElementById("btn-export-arith-csv");

    // Output LEDs
    const led1Label = document.getElementById("led-1-label");
    const led2Label = document.getElementById("led-2-label");
    const arithLed1 = document.getElementById("arith-led-1");
    const arithLed2 = document.getElementById("arith-led-2");
    const arithOut1Val = document.getElementById("arith-out-1-val");
    const arithOut2Val = document.getElementById("arith-out-2-val");

    // SVG Stage Container
    const arithSvgElements = document.getElementById("arith-svg-dynamic-elements");

    // Truth Table
    const tableHead = document.getElementById("arith-table-head");
    const tableBody = document.getElementById("arith-table-body");
    const presetsContainer = document.getElementById("arith-presets-container");

    // Step Inspection
    const btnToggleStepInspect = document.getElementById("btn-toggle-step-inspect");
    const stepInspectBanner = document.getElementById("step-inspect-banner");
    const nodeSignalsDock = document.getElementById("node-signals-dock");

    // Compare Mode
    const btnToggleArithCompare = document.getElementById("btn-toggle-arith-compare");
    const btnCloseArithCompare = document.getElementById("btn-close-arith-compare");
    const singleWorkbench = document.getElementById("arithmetic-single-workbench");
    const compareContainer = document.getElementById("arith-compare-container");
    const compSwitchA = document.getElementById("comp-arith-a");
    const compSwitchB = document.getElementById("comp-arith-b");
    const compSwitchCin = document.getElementById("comp-arith-cin");

    const btnReset = document.getElementById("btn-reset-arith");
    const btnRandom = document.getElementById("btn-random-arith-inputs");

    // Check if current circuit has 3 inputs (Cin / Bin)
    function is3InputCircuit() {
        return currentCircuit === "FULL_ADDER" || currentCircuit === "FULL_SUBTRACTOR";
    }

    function isSubtractor() {
        return currentCircuit === "HALF_SUBTRACTOR" || currentCircuit === "FULL_SUBTRACTOR";
    }

    // --- Main Simulation Update ---
    async function updateArithmeticSimulation() {
        const has3 = is3InputCircuit();
        const isSub = isSubtractor();

        // Toggle Cin/Bin switch visibility
        if (has3) {
            switchCinContainer.style.display = "flex";
            switchCinLabel.textContent = isSub ? "Borrow In (Bin)" : "Carry In (Cin)";
        } else {
            switchCinContainer.style.display = "none";
        }

        // Adjust labels for Adder vs Subtractor
        if (isSub) {
            led1Label.textContent = "DIFFERENCE";
            led2Label.textContent = "BORROW";
            arithLed1.className = "led-indicator led-diff " + (stateA ^ stateB ^ (has3 ? stateCinBin : 0) ? "led-on" : "led-off");
        } else {
            led1Label.textContent = "SUM";
            led2Label.textContent = "CARRY";
            arithLed1.className = "led-indicator led-sum " + (stateA ^ stateB ^ (has3 ? stateCinBin : 0) ? "led-on" : "led-off");
        }

        // Call backend API
        try {
            const resp = await fetch("/api/arithmetic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    circuit: currentCircuit,
                    a: stateA,
                    b: stateB,
                    cin_bin: has3 ? stateCinBin : 0
                })
            });

            const res = await resp.json();
            if (!resp.ok || !res.success) {
                console.error("API error:", res.error);
                return;
            }

            const data = res.data;
            const meta = data.meta;

            // Update Titles & Metadata
            arithCircuitTitle.textContent = meta.name;
            arithCircuitBadge.textContent = isSub ? "Binary Subtraction Unit" : "Binary Addition Unit";
            arithPlainExplanation.textContent = data.explanation;
            arithAppDesc.textContent = meta.applications;
            btnExportCsv.href = `/api/truth-table/csv?type=arithmetic&name=${currentCircuit}`;

            // Formulas banner
            const formulaKeys = Object.keys(meta.formulas);
            formulaOut1.textContent = `${formulaKeys[0]}: ${meta.formulas[formulaKeys[0]]}`;
            formulaOut2.textContent = `${formulaKeys[1]}: ${meta.formulas[formulaKeys[1]]}`;

            // Update Switch buttons UI
            switchA.textContent = stateA;
            switchA.className = "binary-switch " + (stateA === 1 ? "on" : "off");
            switchALbl.textContent = stateA === 1 ? "HIGH (1)" : "LOW (0)";

            switchB.textContent = stateB;
            switchB.className = "binary-switch " + (stateB === 1 ? "on" : "off");
            switchBLbl.textContent = stateB === 1 ? "HIGH (1)" : "LOW (0)";

            if (has3) {
                switchCin.textContent = stateCinBin;
                switchCin.className = "binary-switch " + (stateCinBin === 1 ? "on" : "off");
                switchCinLbl.textContent = stateCinBin === 1 ? "HIGH (1)" : "LOW (0)";
            }

            // Update Output LEDs & values
            const outKeys = Object.keys(data.outputs);
            const val1 = data.outputs[outKeys[0]];
            const val2 = data.outputs[outKeys[1]];

            arithOut1Val.textContent = val1;
            arithOut2Val.textContent = val2;

            if (isSub) {
                arithLed1.className = "led-indicator led-diff " + (val1 === 1 ? "led-on" : "led-off");
                arithLed2.className = "led-indicator led-borrow " + (val2 === 1 ? "led-on" : "led-off");
            } else {
                arithLed1.className = "led-indicator led-sum " + (val1 === 1 ? "led-on" : "led-off");
                arithLed2.className = "led-indicator led-carry " + (val2 === 1 ? "led-on" : "led-off");
            }

            // Draw Animated SVG Circuit Schematics with live signals
            if (window.CircuitRenderer) {
                window.CircuitRenderer.renderCircuit(currentCircuit, data.signals, arithSvgElements);
            }

            // Render Truth Table
            renderArithmeticTruthTable(data.truth_table);

            // Populate Step-by-Step Signals Dock
            renderSignalNodes(data.signals);

            // Update Presets Strip
            renderPresetsStrip(has3);

        } catch (err) {
            console.error("Arithmetic simulation error:", err);
        }
    }

    // --- Render Truth Table ---
    function renderArithmeticTruthTable(table) {
        if (!table || table.length === 0) return;
        const first = table[0];
        const inKeys = Object.keys(first.inputs);
        const outKeys = Object.keys(first.outputs);

        let headHTML = `<tr><th>Row</th>`;
        inKeys.forEach(k => { headHTML += `<th>${k}</th>`; });
        if (first.intermediates) {
            Object.keys(first.intermediates).forEach(k => { headHTML += `<th class="text-muted small">${k}</th>`; });
        }
        outKeys.forEach(k => { headHTML += `<th>${k}</th>`; });
        headHTML += `</tr>`;
        tableHead.innerHTML = headHTML;

        let bodyHTML = "";
        table.forEach((row, i) => {
            const isActive = row.is_active;
            bodyHTML += `<tr class="${isActive ? 'active-row' : ''}">`;
            bodyHTML += `<td class="mono-font">${i + 1}</td>`;
            inKeys.forEach(k => {
                bodyHTML += `<td class="mono-font">${row.inputs[k]}</td>`;
            });
            if (row.intermediates) {
                Object.keys(row.intermediates).forEach(k => {
                    bodyHTML += `<td class="mono-font text-muted small">${row.intermediates[k]}</td>`;
                });
            }
            outKeys.forEach(k => {
                const val = row.outputs[k];
                bodyHTML += `<td class="mono-font font-weight-bold ${val === 1 ? 'text-success' : 'text-muted'}">${val}</td>`;
            });
            bodyHTML += `</tr>`;
        });
        tableBody.innerHTML = bodyHTML;
    }

    // --- Step-by-Step Signal Nodes ---
    function renderSignalNodes(signals) {
        if (!nodeSignalsDock) return;
        nodeSignalsDock.innerHTML = Object.keys(signals).map(key => {
            const val = signals[key];
            return `
                <div class="node-badge ${val === 1 ? 'node-active' : ''}">
                    <strong>${key}:</strong> ${val} (${val === 1 ? 'HIGH' : 'LOW'})
                </div>
            `;
        }).join("");
    }

    // --- Presets Strip ---
    function renderPresetsStrip(has3) {
        if (!presetsContainer) return;
        const combos = has3 ?
            [[0,0,0], [0,1,0], [1,0,0], [1,1,0], [0,0,1], [0,1,1], [1,0,1], [1,1,1]] :
            [[0,0], [0,1], [1,0], [1,1]];

        presetsContainer.innerHTML = combos.map(c => {
            if (has3) {
                return `<button class="preset-pill" data-a="${c[0]}" data-b="${c[1]}" data-cin="${c[2]}">A=${c[0]}, B=${c[1]}, In=${c[2]}</button>`;
            } else {
                return `<button class="preset-pill" data-a="${c[0]}" data-b="${c[1]}">A=${c[0]}, B=${c[1]}</button>`;
            }
        }).join("");

        presetsContainer.querySelectorAll(".preset-pill").forEach(p => {
            p.addEventListener("click", function() {
                stateA = parseInt(this.getAttribute("data-a"), 10);
                stateB = parseInt(this.getAttribute("data-b"), 10);
                if (has3) stateCinBin = parseInt(this.getAttribute("data-cin"), 10);
                updateArithmeticSimulation();
                if (window.showToast) showToast(`Loaded input state.`);
            });
        });
    }

    // Switch Click Listeners
    switchA.addEventListener("click", function() {
        stateA = stateA === 1 ? 0 : 1;
        updateArithmeticSimulation();
    });

    switchB.addEventListener("click", function() {
        stateB = stateB === 1 ? 0 : 1;
        updateArithmeticSimulation();
    });

    switchCin.addEventListener("click", function() {
        stateCinBin = stateCinBin === 1 ? 0 : 1;
        updateArithmeticSimulation();
    });

    // Circuit Tab Switching
    circuitTabs.forEach(tab => {
        tab.addEventListener("click", function() {
            circuitTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            currentCircuit = this.getAttribute("data-circuit");
            updateArithmeticSimulation();
            if (window.showToast) showToast(`Selected ${this.querySelector(".gate-tab-name").textContent}`);
        });
    });

    // Reset & Random
    btnReset.addEventListener("click", function() {
        stateA = 0;
        stateB = 0;
        stateCinBin = 0;
        updateArithmeticSimulation();
        if (window.showToast) showToast("Arithmetic inputs reset to 0.");
    });

    btnRandom.addEventListener("click", function() {
        stateA = Math.random() >= 0.5 ? 1 : 0;
        stateB = Math.random() >= 0.5 ? 1 : 0;
        stateCinBin = Math.random() >= 0.5 ? 1 : 0;
        updateArithmeticSimulation();
        if (window.showToast) showToast("Randomized arithmetic inputs.");
    });

    // Step-by-Step Toggle
    if (btnToggleStepInspect) {
        btnToggleStepInspect.addEventListener("click", function() {
            isStepInspectOpen = !isStepInspectOpen;
            stepInspectBanner.style.display = isStepInspectOpen ? "block" : "none";
            if (isStepInspectOpen && window.showToast) {
                showToast("Intermediate signal propagation mode active.");
            }
        });
    }

    // Compare 4 Circuits Mode
    async function updateArithCompare() {
        const ca = parseInt(compSwitchA.getAttribute("data-state"), 10);
        const cb = parseInt(compSwitchB.getAttribute("data-state"), 10);
        const ccin = parseInt(compSwitchCin.getAttribute("data-state"), 10);

        try {
            const resp = await fetch("/api/arithmetic/compare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ a: ca, b: cb, cin_bin: ccin })
            });
            const res = await resp.json();
            if (!resp.ok || !res.success) return;

            const d = res.data;

            // Half Adder outputs
            const haSum = d.half_adder.outputs.Sum;
            const haCarry = d.half_adder.outputs.Carry;
            document.getElementById("comp-ha-sum-val").textContent = haSum;
            document.getElementById("comp-ha-carry-val").textContent = haCarry;
            document.getElementById("comp-ha-sum-led").className = "led-indicator led-sum " + (haSum ? "led-on" : "led-off");
            document.getElementById("comp-ha-carry-led").className = "led-indicator led-carry " + (haCarry ? "led-on" : "led-off");

            // Full Adder outputs
            const faSum = d.full_adder.outputs.Sum;
            const faCout = d.full_adder.outputs.Cout;
            document.getElementById("comp-fa-sum-val").textContent = faSum;
            document.getElementById("comp-fa-cout-val").textContent = faCout;
            document.getElementById("comp-fa-sum-led").className = "led-indicator led-sum " + (faSum ? "led-on" : "led-off");
            document.getElementById("comp-fa-cout-led").className = "led-indicator led-carry " + (faCout ? "led-on" : "led-off");

            // Half Subtractor outputs
            const hsDiff = d.half_subtractor.outputs.Diff;
            const hsBorrow = d.half_subtractor.outputs.Borrow;
            document.getElementById("comp-hs-diff-val").textContent = hsDiff;
            document.getElementById("comp-hs-borrow-val").textContent = hsBorrow;
            document.getElementById("comp-hs-diff-led").className = "led-indicator led-diff " + (hsDiff ? "led-on" : "led-off");
            document.getElementById("comp-hs-borrow-led").className = "led-indicator led-borrow " + (hsBorrow ? "led-on" : "led-off");

            // Full Subtractor outputs
            const fsDiff = d.full_subtractor.outputs.Diff;
            const fsBout = d.full_subtractor.outputs.Bout;
            document.getElementById("comp-fs-diff-val").textContent = fsDiff;
            document.getElementById("comp-fs-bout-val").textContent = fsBout;
            document.getElementById("comp-fs-diff-led").className = "led-indicator led-diff " + (fsDiff ? "led-on" : "led-off");
            document.getElementById("comp-fs-bout-led").className = "led-indicator led-borrow " + (fsBout ? "led-on" : "led-off");

        } catch (e) {
            console.error(e);
        }
    }

    if (btnToggleArithCompare) {
        btnToggleArithCompare.addEventListener("click", function() {
            singleWorkbench.style.display = "none";
            compareContainer.style.display = "block";
            updateArithCompare();
            if (window.showToast) showToast("Entered 4-Circuit Comparative View.");
        });
    }

    if (btnCloseArithCompare) {
        btnCloseArithCompare.addEventListener("click", function() {
            compareContainer.style.display = "none";
            singleWorkbench.style.display = "grid";
        });
    }

    [compSwitchA, compSwitchB, compSwitchCin].forEach(sw => {
        if (sw) {
            sw.addEventListener("click", function() {
                const cur = parseInt(this.getAttribute("data-state"), 10);
                const nxt = cur === 1 ? 0 : 1;
                this.setAttribute("data-state", nxt);
                this.textContent = nxt;
                this.className = "binary-switch " + (nxt === 1 ? "on" : "off");
                updateArithCompare();
            });
        }
    });

    // Initial simulation run
    updateArithmeticSimulation();
});

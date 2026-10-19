/**
 * LogicLab X — Number System Converter Controller (converter.js)
 * Manages real-time cross-base conversions, step rendering,
 * 4-base comparison panel, precision adjustment, and history.
 */

document.addEventListener("DOMContentLoaded", function() {
    const srcSelect = document.getElementById("source-base-select");
    const tgtSelect = document.getElementById("target-base-select");
    const swapBtn = document.getElementById("btn-swap-bases");
    const inputField = document.getElementById("number-input-field");
    const clearInputBtn = document.getElementById("btn-clear-input");
    const convertBtn = document.getElementById("btn-convert-action");
    const resetBtn = document.getElementById("btn-reset-converter");
    const precisionSlider = document.getElementById("fractional-precision");
    const precisionDisplay = document.getElementById("precision-display-val");
    const charHint = document.getElementById("allowed-chars-hint");
    const errorMsg = document.getElementById("input-error-msg");
    const realtimeBadge = document.getElementById("realtime-status-badge");

    // Output Elements
    const primaryResultVal = document.getElementById("primary-result-val");
    const primaryResultMeta = document.getElementById("primary-result-meta");
    const resultBoxLabel = document.getElementById("result-box-label");
    const copyResultBtn = document.getElementById("btn-copy-result");
    const stepsFlowContainer = document.getElementById("steps-flow-container");
    const explanationSummaryText = document.getElementById("explanation-summary-text");

    // 4-Base Comparison Elements
    const compVal2 = document.getElementById("comp-val-2");
    const compVal8 = document.getElementById("comp-val-8");
    const compVal10 = document.getElementById("comp-val-10");
    const compVal16 = document.getElementById("comp-val-16");

    // History & Presets
    const historyToggleBtn = document.getElementById("btn-history-toggle");
    const historyModal = document.getElementById("history-modal");
    const historyModalClose = document.getElementById("history-modal-close");
    const closeHistoryModalBtn = document.getElementById("btn-close-history-modal");
    const historyItemsList = document.getElementById("history-items-list");
    const clearHistoryBtn = document.getElementById("btn-clear-history");
    const historyCountBadge = document.getElementById("history-count");
    const examplesToggleBtn = document.getElementById("btn-examples-toggle");
    const presetsPanel = document.getElementById("presets-panel");

    let debounceTimer = null;
    const BASE_CHARS = {
        2: "0, 1",
        8: "0–7",
        10: "0–9",
        16: "0–9, A–F (case-insensitive)"
    };

    const BASE_LABELS = {
        2: "Binary",
        8: "Octal",
        10: "Decimal",
        16: "Hexadecimal"
    };

    // --- Update Allowed Chars Hint ---
    function updateCharHint() {
        const base = parseInt(srcSelect.value, 10);
        charHint.textContent = `Allowed for Base ${base}: ${BASE_CHARS[base]}, optional '-' and '.'`;
        resultBoxLabel.textContent = `Target Result (${BASE_LABELS[tgtSelect.value]}):`;
    }

    // --- Client-side Fast Validation ---
    function validateClientInput(val, base) {
        if (!val || !val.trim()) {
            return { valid: false, error: "Please enter a value to convert." };
        }
        let s = val.trim();
        if (s.startsWith("-") || s.startsWith("+")) s = s.substring(1).trim();
        if (!s) return { valid: false, error: "Sign must be followed by digits." };

        if ((s.match(/\./g) || []).length > 1) {
            return { valid: false, error: "Only one radix point (.) is allowed." };
        }

        const validSets = {
            2: /^[01.]+$/,
            8: /^[0-7.]+$/,
            10: /^[0-9.]+$/,
            16: /^[0-9a-fA-F.]+$/
        };

        if (!validSets[base].test(s)) {
            return {
                valid: false,
                error: `Contains invalid digits for Base ${base} (${BASE_LABELS[base]}). Allowed: ${BASE_CHARS[base]}.`
            };
        }
        return { valid: true };
    }

    // --- Perform Conversion via Backend API ---
    async function executeConversion() {
        const val = inputField.value.trim();
        const src = parseInt(srcSelect.value, 10);
        const tgt = parseInt(tgtSelect.value, 10);
        const prec = parseInt(precisionSlider.value, 10);

        const check = validateClientInput(val, src);
        if (!check.valid) {
            errorMsg.textContent = check.error;
            errorMsg.style.display = "block";
            realtimeBadge.textContent = "Invalid Input";
            realtimeBadge.className = "badge badge-coral";
            return;
        }

        errorMsg.style.display = "none";
        realtimeBadge.textContent = "Computing...";
        realtimeBadge.className = "badge badge-cyan";

        try {
            const resp = await fetch("/api/convert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    value: val,
                    source_base: src,
                    target_base: tgt,
                    precision: prec
                })
            });

            const data = await resp.json();

            if (!resp.ok || !data.success) {
                errorMsg.textContent = data.error || "Conversion failed.";
                errorMsg.style.display = "block";
                realtimeBadge.textContent = "Error";
                realtimeBadge.className = "badge badge-coral";
                return;
            }

            // Render Success Output
            realtimeBadge.textContent = "Calculated";
            realtimeBadge.className = "badge badge-emerald";

            primaryResultVal.textContent = data.result;
            primaryResultMeta.textContent = `Method: ${data.method} (Precision: ${data.precision} digits)`;

            // Update Comparison Panel
            if (data.all_bases) {
                compVal2.textContent = data.all_bases["2"] || "-";
                compVal8.textContent = data.all_bases["8"] || "-";
                compVal10.textContent = data.all_bases["10"] || "-";
                compVal16.textContent = data.all_bases["16"] || "-";
            }

            // Update Plain English Explanation
            explanationSummaryText.textContent = data.explanation;

            // Render Detailed Math Steps
            renderConversionSteps(data.steps, data);

            // Record into History
            saveToHistory({
                input: data.input_value,
                srcBase: src,
                tgtBase: tgt,
                result: data.result,
                timestamp: new Date().toLocaleTimeString()
            });

        } catch (err) {
            console.error(err);
            errorMsg.textContent = "Network error connecting to simulation server.";
            errorMsg.style.display = "block";
        }
    }

    // --- Render Mathematical Process Steps ---
    function renderConversionSteps(steps, fullData) {
        stepsFlowContainer.innerHTML = "";
        if (!steps || steps.length === 0) {
            stepsFlowContainer.innerHTML = `<div class="step-card"><p class="text-muted">No additional expansion steps needed for this conversion.</p></div>`;
            return;
        }

        steps.forEach((step, idx) => {
            const card = document.createElement("div");
            card.className = "step-card";

            let innerHTML = `
                <div class="step-card-title">${step.title || `Step ${idx + 1}`}</div>
                <div class="step-card-desc">${step.description || ""}</div>
            `;

            // Case A: Repeated Division Table
            if (step.type === "division" && step.table) {
                innerHTML += `
                    <div class="table-responsive">
                        <table class="lab-table">
                            <thead>
                                <tr>
                                    <th>Step</th>
                                    <th>Operation</th>
                                    <th>Quotient Out</th>
                                    <th>Remainder</th>
                                    <th>Symbol</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${step.table.map(row => `
                                    <tr>
                                        <td>${row.step || 1}</td>
                                        <td class="mono-font">${row.quotient_in} ÷ ${row.base}</td>
                                        <td class="mono-font"><strong>${row.quotient_out}</strong></td>
                                        <td class="mono-font text-info">${row.remainder}</td>
                                        <td class="mono-font font-weight-bold text-success">${row.symbol}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="reading-order-badge">${step.reading_order || "Read bottom to top (LSB to MSB)"}</div>
                `;
            }
            // Case B: Repeated Multiplication Table
            else if (step.type === "multiplication" && step.table) {
                innerHTML += `
                    <div class="table-responsive">
                        <table class="lab-table">
                            <thead>
                                <tr>
                                    <th>Step</th>
                                    <th>Multiplication</th>
                                    <th>Product</th>
                                    <th>Extracted Digit</th>
                                    <th>Remaining Fraction</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${step.table.map(row => `
                                    <tr>
                                        <td>${row.step}</td>
                                        <td class="mono-font">${row.fraction_in} × ${row.base}</td>
                                        <td class="mono-font">${row.product}</td>
                                        <td class="mono-font text-success font-weight-bold">${row.extracted}</td>
                                        <td class="mono-font">${row.remaining}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="reading-order-badge">${step.reading_order || "Read top to bottom"}</div>
                `;
            }
            // Case C: Positional Expansion Table
            else if ((step.type === "positional_integer" || step.type === "positional_fraction") && step.table) {
                innerHTML += `
                    <div class="table-responsive">
                        <table class="lab-table">
                            <thead>
                                <tr>
                                    <th>Digit</th>
                                    <th>Position Power</th>
                                    <th>Positional Weight</th>
                                    <th>Term Calculation</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${step.table.map(row => `
                                    <tr>
                                        <td class="mono-font font-weight-bold">${row.digit}</td>
                                        <td class="mono-font">${row.power}</td>
                                        <td class="mono-font">${row.weight}</td>
                                        <td class="mono-font text-info">${row.calculation}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="reading-order-badge">Accumulated Sum: ${step.sum_formula} = ${step.sum_result}</div>
                `;
            }
            // Case D: Bit Grouping (3-bit or 4-bit)
            else if (step.type && step.type.startsWith("bit_grouping") && step.groups) {
                innerHTML += `
                    <div class="table-responsive">
                        <table class="lab-table">
                            <thead>
                                <tr>
                                    <th>Group Bits</th>
                                    <th>Binary Weight Evaluation</th>
                                    <th>Mapped Symbol</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${step.groups.map(grp => `
                                    <tr>
                                        <td class="mono-font text-info font-weight-bold">${grp.group}</td>
                                        <td class="mono-font">${grp.binary_eval}</td>
                                        <td class="mono-font text-success font-weight-bold">${grp.hex_digit || grp.octal_digit}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="reading-order-badge">Padded Stream: ${step.padded_binary} → Result: ${step.mapped_result}</div>
                `;
            }
            // Case E: Digit Expansion
            else if (step.type && step.type.startsWith("digit_expansion") && step.table) {
                innerHTML += `
                    <div class="table-responsive">
                        <table class="lab-table">
                            <thead>
                                <tr>
                                    <th>Digit</th>
                                    <th>Decimal Value</th>
                                    <th>Binary Equivalent Bits</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${step.table.map(row => `
                                    <tr>
                                        <td class="mono-font font-weight-bold">${row.digit}</td>
                                        <td class="mono-font">${row.value}</td>
                                        <td class="mono-font text-success font-weight-bold">${row.bits}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="reading-order-badge">Combined Stream: ${step.expanded_binary}</div>
                `;
            }
            // Case F: Sub-steps recursion (like Octal <-> Hex via Binary bridge)
            else if (step.substeps) {
                innerHTML += `<div class="substeps-wrap">`;
                step.substeps.forEach(sub => {
                    innerHTML += `<div class="p-2 mb-2 bg-surface rounded"><strong>${sub.title}:</strong> ${sub.description || ""}</div>`;
                });
                innerHTML += `</div>`;
            }

            card.innerHTML = innerHTML;
            stepsFlowContainer.appendChild(card);
        });
    }

    // --- Debounced Input Handler for Real-time Conversion ---
    inputField.addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(executeConversion, 180);
    });

    srcSelect.addEventListener("change", function() {
        updateCharHint();
        executeConversion();
    });

    tgtSelect.addEventListener("change", function() {
        updateCharHint();
        executeConversion();
    });

    // --- Swap Bases Button ---
    swapBtn.addEventListener("click", function() {
        const oldSrc = srcSelect.value;
        const oldTgt = tgtSelect.value;
        srcSelect.value = oldTgt;
        tgtSelect.value = oldSrc;

        // If current primary result is valid, put it in the input field
        const currentResult = primaryResultVal.textContent.trim();
        if (currentResult && currentResult !== "—") {
            inputField.value = currentResult;
        }

        updateCharHint();
        executeConversion();
        if (window.showToast) showToast(`Swapped Bases: ${BASE_LABELS[tgtSelect.value]} ⇄ ${BASE_LABELS[srcSelect.value]}`);
    });

    // --- Precision Slider ---
    precisionSlider.addEventListener("input", function() {
        precisionDisplay.textContent = this.value;
        executeConversion();
    });

    // --- Clear & Reset Buttons ---
    clearInputBtn.addEventListener("click", function() {
        inputField.value = "";
        inputField.focus();
        errorMsg.style.display = "none";
        realtimeBadge.textContent = "Ready";
        realtimeBadge.className = "badge badge-cyan";
    });

    resetBtn.addEventListener("click", function() {
        srcSelect.value = "10";
        tgtSelect.value = "2";
        precisionSlider.value = "4";
        precisionDisplay.textContent = "4";
        inputField.value = "125.625";
        updateCharHint();
        executeConversion();
        if (window.showToast) showToast("Converter reset to default settings.");
    });

    convertBtn.addEventListener("click", executeConversion);

    // --- Copy Result to Clipboard ---
    copyResultBtn.addEventListener("click", function() {
        const text = primaryResultVal.textContent;
        navigator.clipboard.writeText(text).then(() => {
            if (window.showToast) showToast(`Copied "${text}" to clipboard!`);
        });
    });

    // Multi-base panel individual copy buttons
    document.querySelectorAll(".btn-copy-icon").forEach(btn => {
        btn.addEventListener("click", function() {
            const targetId = this.getAttribute("data-copy-target");
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const text = targetEl.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    if (window.showToast) showToast(`Copied: ${text}`);
                });
            }
        });
    });

    // --- Preset Examples ---
    if (examplesToggleBtn && presetsPanel) {
        examplesToggleBtn.addEventListener("click", function() {
            presetsPanel.style.display = (presetsPanel.style.display === "none") ? "block" : "none";
        });

        document.querySelectorAll(".preset-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                srcSelect.value = this.getAttribute("data-src");
                tgtSelect.value = this.getAttribute("data-tgt");
                inputField.value = this.getAttribute("data-val");
                updateCharHint();
                executeConversion();
                if (window.showToast) showToast(`Loaded Preset: ${this.textContent}`);
            });
        });
    }

    // --- History Management (Local Storage) ---
    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem("logiclab_conv_history") || "[]");
        } catch (e) {
            return [];
        }
    }

    function saveToHistory(item) {
        let hist = getHistory();
        // Avoid duplicate consecutive entries
        if (hist.length > 0 && hist[0].input === item.input && hist[0].srcBase === item.srcBase && hist[0].tgtBase === item.tgtBase) {
            return;
        }
        hist.unshift(item);
        if (hist.length > 15) hist.pop(); // Keep top 15
        localStorage.setItem("logiclab_conv_history", JSON.stringify(hist));
        updateHistoryCount();
    }

    function updateHistoryCount() {
        const hist = getHistory();
        if (historyCountBadge) historyCountBadge.textContent = hist.length;
    }

    function renderHistory() {
        const hist = getHistory();
        if (!historyItemsList) return;
        if (hist.length === 0) {
            historyItemsList.innerHTML = `<div class="text-muted text-center py-4">No recent conversions recorded yet.</div>`;
            return;
        }

        historyItemsList.innerHTML = hist.map((h, i) => `
            <div class="base-comparison-card mb-2" style="cursor:pointer;" data-hist-idx="${i}">
                <div class="base-card-top">
                    <span class="base-name-tag">${BASE_LABELS[h.srcBase]} → ${BASE_LABELS[h.tgtBase]}</span>
                    <span class="text-muted small">${h.timestamp}</span>
                </div>
                <div class="mono-font">${h.input} = <strong class="text-info">${h.result}</strong></div>
            </div>
        `).join("");

        // Attach click listeners to restore from history
        document.querySelectorAll("[data-hist-idx]").forEach(card => {
            card.addEventListener("click", function() {
                const idx = parseInt(this.getAttribute("data-hist-idx"), 10);
                const item = getHistory()[idx];
                if (item) {
                    srcSelect.value = item.srcBase;
                    tgtSelect.value = item.tgtBase;
                    inputField.value = item.input;
                    updateCharHint();
                    executeConversion();
                    historyModal.classList.remove("active");
                    if (window.showToast) showToast("Restored from history.");
                }
            });
        });
    }

    if (historyToggleBtn) {
        historyToggleBtn.addEventListener("click", () => {
            renderHistory();
            if (historyModal) historyModal.classList.add("active");
        });
    }

    if (historyModalClose) historyModalClose.addEventListener("click", () => historyModal.classList.remove("active"));
    if (closeHistoryModalBtn) closeHistoryModalBtn.addEventListener("click", () => historyModal.classList.remove("active"));

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", () => {
            localStorage.removeItem("logiclab_conv_history");
            updateHistoryCount();
            renderHistory();
            if (window.showToast) showToast("Conversion history cleared.");
        });
    }

    // Initialize
    updateCharHint();
    updateHistoryCount();
    executeConversion();
});

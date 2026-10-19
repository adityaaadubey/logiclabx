/**
 * LogicLab X — Global JavaScript (main.js)
 * Manages Theme toggle, Mobile navigation, Toast notifications,
 * Global Ctrl+K Search, Modals, and Accessibility preferences.
 */

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Feather Icons if loaded
    if (window.feather) {
        feather.replace();
    }

    // --- Theme Management (Dark / Light) with Persistence ---
    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById("theme-toggle-btn");
    const moonIcon = document.getElementById("theme-icon-moon");
    const sunIcon = document.getElementById("theme-icon-sun");

    function applyTheme(theme) {
        htmlEl.setAttribute("data-theme", theme);
        localStorage.setItem("logiclab_theme", theme);
        if (theme === "light") {
            if (moonIcon) moonIcon.style.display = "none";
            if (sunIcon) sunIcon.style.display = "inline-block";
        } else {
            if (moonIcon) moonIcon.style.display = "inline-block";
            if (sunIcon) sunIcon.style.display = "none";
        }
        if (window.feather) feather.replace();
    }

    const savedTheme = localStorage.getItem("logiclab_theme") || "dark";
    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const current = htmlEl.getAttribute("data-theme");
            applyTheme(current === "dark" ? "light" : "dark");
            showToast(`Switched to ${current === "dark" ? "Light" : "Dark"} Mode`);
        });
    }

    // --- Reduced Motion Accessibility Toggle ---
    const motionCheckbox = document.getElementById("reduced-motion-checkbox");
    if (motionCheckbox) {
        const isReduced = localStorage.getItem("logiclab_reduced_motion") === "true";
        motionCheckbox.checked = isReduced;
        if (isReduced) document.body.classList.add("reduced-motion");

        motionCheckbox.addEventListener("change", function() {
            if (this.checked) {
                document.body.classList.add("reduced-motion");
                localStorage.setItem("logiclab_reduced_motion", "true");
                showToast("Reduced motion mode enabled");
            } else {
                document.body.classList.remove("reduced-motion");
                localStorage.setItem("logiclab_reduced_motion", "false");
                showToast("Full animation mode restored");
            }
        });
    }

    // --- Mobile Drawer Navigation ---
    const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const drawerBackdrop = document.getElementById("drawer-backdrop");
    const drawerCloseBtn = document.getElementById("drawer-close-btn");

    function openMobileDrawer() {
        if (mobileDrawer) mobileDrawer.classList.add("open");
        if (drawerBackdrop) drawerBackdrop.classList.add("active");
    }

    function closeMobileDrawer() {
        if (mobileDrawer) mobileDrawer.classList.remove("open");
        if (drawerBackdrop) drawerBackdrop.classList.remove("active");
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeMobileDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeMobileDrawer);

    // --- Toast Notifications System ---
    window.showToast = function(message, duration = 2800) {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<i data-feather="info" style="width:16px;height:16px;color:var(--neon-cyan);"></i><span>${message}</span>`;
        container.appendChild(toast);
        if (window.feather) feather.replace();

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(100%)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };

    // --- Global Quick Search (Ctrl+K / Cmd+K) ---
    const searchModal = document.getElementById("search-modal");
    const searchTriggerBtn = document.getElementById("search-modal-btn");
    const searchModalClose = document.getElementById("search-modal-close");
    const searchInput = document.getElementById("global-search-input");
    const searchResultsBox = document.getElementById("search-results-box");

    const searchableItems = [
        { title: "Number System Converter", url: "/converter", tag: "Lab 1", desc: "Binary, Octal, Decimal, Hex conversions" },
        { title: "AND Gate Simulator", url: "/gates?gate=AND", tag: "Lab 2", desc: "Y = A · B logic gate simulation" },
        { title: "OR Gate Simulator", url: "/gates?gate=OR", tag: "Lab 2", desc: "Y = A + B logic gate simulation" },
        { title: "NOT Gate Simulator", url: "/gates?gate=NOT", tag: "Lab 2", desc: "Y = ¬A inverter gate simulation" },
        { title: "NAND Gate Simulator", url: "/gates?gate=NAND", tag: "Lab 2", desc: "Universal NAND gate simulation" },
        { title: "NOR Gate Simulator", url: "/gates?gate=NOR", tag: "Lab 2", desc: "Universal NOR gate simulation" },
        { title: "XOR Gate Simulator", url: "/gates?gate=XOR", tag: "Lab 2", desc: "Y = A ⊕ B Exclusive OR gate" },
        { title: "XNOR Gate Simulator", url: "/gates?gate=XNOR", tag: "Lab 2", desc: "Equivalence XNOR gate simulation" },
        { title: "Half Adder Circuit", url: "/arithmetic?circuit=HALF_ADDER", tag: "Lab 3", desc: "Sum = A ⊕ B, Carry = A · B" },
        { title: "Full Adder Circuit", url: "/arithmetic?circuit=FULL_ADDER", tag: "Lab 3", desc: "Sum = A ⊕ B ⊕ Cin, Cout cascading" },
        { title: "Half Subtractor Circuit", url: "/arithmetic?circuit=HALF_SUBTRACTOR", tag: "Lab 3", desc: "Diff = A ⊕ B, Borrow = Ā · B" },
        { title: "Full Subtractor Circuit", url: "/arithmetic?circuit=FULL_SUBTRACTOR", tag: "Lab 3", desc: "Diff = A ⊕ B ⊕ Bin, Bout logic" },
        { title: "De Morgan's Laws", url: "/learn#module-boolean-algebra", tag: "Theory", desc: "¬(A·B) = Ā+B̄ and ¬(A+B) = Ā·B̄" },
        { title: "Multiplexers (MUX) & Decoders", url: "/learn#module-combinational-sequential", tag: "Theory", desc: "Combinational data routing and priority encoders" },
        { title: "Flip-Flops (SR, D, JK, T)", url: "/learn#module-combinational-sequential", tag: "Theory", desc: "Sequential memory elements and clocking" },
        { title: "Final Certification Quiz", url: "/learn#final-exam", tag: "Quiz", desc: "10-question DELD comprehensive assessment" },
        { title: "Positional Notation & Radix", url: "/learn#module-number-systems", tag: "Theory", desc: "Base powers and weight expansion formulas" }
    ];

    function openSearchModal() {
        if (!searchModal) return;
        searchModal.classList.add("active");
        if (searchInput) {
            searchInput.value = "";
            searchInput.focus();
            renderSearchResults("");
        }
    }

    function closeSearchModal() {
        if (!searchModal) return;
        searchModal.classList.remove("active");
    }

    function renderSearchResults(query) {
        if (!searchResultsBox) return;
        const q = query.trim().toLowerCase();
        if (!q) {
            searchResultsBox.innerHTML = `
                <div class="search-tip-empty">
                    Type keywords like <strong>"NAND"</strong>, <strong>"Full Adder"</strong>, <strong>"De Morgan"</strong>, or <strong>"Hex"</strong>...
                </div>
            `;
            return;
        }

        const filtered = searchableItems.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.tag.toLowerCase().includes(q)
        );

        if (filtered.length === 0) {
            searchResultsBox.innerHTML = `<div class="search-tip-empty">No results found matching "${query}".</div>`;
            return;
        }

        searchResultsBox.innerHTML = filtered.map(item => `
            <a href="${item.url}" class="search-result-item">
                <div>
                    <div class="search-result-title">${item.title}</div>
                    <div class="text-muted small">${item.desc}</div>
                </div>
                <span class="search-result-badge">${item.tag}</span>
            </a>
        `).join("");
    }

    if (searchTriggerBtn) searchTriggerBtn.addEventListener("click", openSearchModal);
    if (searchModalClose) searchModalClose.addEventListener("click", closeSearchModal);
    if (searchInput) searchInput.addEventListener("input", (e) => renderSearchResults(e.target.value));

    // Global keyboard listener (Ctrl+K and Esc)
    document.addEventListener("keydown", function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (searchModal && searchModal.classList.contains("active")) {
                closeSearchModal();
            } else {
                openSearchModal();
            }
        } else if (e.key === "Escape") {
            closeSearchModal();
            const infoModal = document.getElementById("info-modal");
            if (infoModal) infoModal.classList.remove("active");
            const historyModal = document.getElementById("history-modal");
            if (historyModal) historyModal.classList.remove("active");
            const glossaryModal = document.getElementById("glossary-modal");
            if (glossaryModal) glossaryModal.classList.remove("active");
        }
    });

    // Close modal on overlay click
    if (searchModal) {
        searchModal.addEventListener("click", function(e) {
            if (e.target === searchModal) closeSearchModal();
        });
    }

    // --- Project Info Modal ---
    const infoModal = document.getElementById("info-modal");
    const infoModalClose = document.getElementById("info-modal-close");
    const infoModalAck = document.getElementById("info-modal-ack-btn");
    const footerInfoLink = document.getElementById("footer-info-link");
    const mobileInfoBtn = document.getElementById("mobile-info-btn");

    function openInfoModal() {
        if (infoModal) infoModal.classList.add("active");
        closeMobileDrawer();
    }

    if (footerInfoLink) footerInfoLink.addEventListener("click", openInfoModal);
    if (mobileInfoBtn) mobileInfoBtn.addEventListener("click", openInfoModal);
    if (infoModalClose) infoModalClose.addEventListener("click", () => infoModal.classList.remove("active"));
    if (infoModalAck) infoModalAck.addEventListener("click", () => infoModal.classList.remove("active"));

    // --- Glossary Modal ---
    const glossaryModal = document.getElementById("glossary-modal");
    const btnOpenGlossary = document.getElementById("btn-open-glossary");
    const footerGlossaryLink = document.getElementById("footer-glossary-link");
    const mobileGlossaryBtn = document.getElementById("mobile-glossary-btn");
    const glossaryModalClose = document.getElementById("glossary-modal-close");
    const btnCloseGlossaryModal = document.getElementById("btn-close-glossary-modal");
    const glossarySearchInput = document.getElementById("glossary-search-input");

    function openGlossaryModal() {
        if (glossaryModal) glossaryModal.classList.add("active");
        closeMobileDrawer();
    }

    if (btnOpenGlossary) btnOpenGlossary.addEventListener("click", openGlossaryModal);
    if (footerGlossaryLink) footerGlossaryLink.addEventListener("click", openGlossaryModal);
    if (mobileGlossaryBtn) mobileGlossaryBtn.addEventListener("click", openGlossaryModal);
    if (glossaryModalClose) glossaryModalClose.addEventListener("click", () => glossaryModal.classList.remove("active"));
    if (btnCloseGlossaryModal) btnCloseGlossaryModal.addEventListener("click", () => glossaryModal.classList.remove("active"));

    if (glossarySearchInput) {
        glossarySearchInput.addEventListener("input", function() {
            const q = this.value.toLowerCase().trim();
            const items = document.querySelectorAll(".glossary-item");
            items.forEach(item => {
                const term = item.getAttribute("data-term") || "";
                const def = item.getAttribute("data-def") || "";
                if (term.includes(q) || def.includes(q)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
});

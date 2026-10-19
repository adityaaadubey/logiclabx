/**
 * LogicLab X — Learning Hub & Certification Exam Controller (learning.js)
 * Manages course module expansion, category filters, solved numericals,
 * concept checks, curriculum completion progress, and 10-question final exam.
 */

document.addEventListener("DOMContentLoaded", function() {
    // Progress Tracker Elements
    const progressBar = document.getElementById("curriculum-progress-bar");
    const completedCountEl = document.getElementById("completed-topics-count");
    const resetProgressBtn = document.getElementById("btn-reset-progress");
    const topicCheckboxes = document.querySelectorAll(".topic-checkbox");

    // Search & Filter Elements
    const searchInput = document.getElementById("learn-topic-search");
    const filterPills = document.querySelectorAll(".filter-pill");
    const theoryCards = document.querySelectorAll(".theory-card");

    // Exam Elements
    const examContainer = document.getElementById("exam-questions-container");
    const btnSubmitExam = document.getElementById("btn-submit-exam");
    const btnRetakeExam = document.getElementById("btn-retake-exam");
    const certificateCard = document.getElementById("certificate-card");
    const certScoreVal = document.getElementById("cert-score-val");
    const certPercentageVal = document.getElementById("cert-percentage-val");
    const certVerdictMsg = document.getElementById("cert-verdict-msg");

    let finalQuestions = [];
    let userAnswers = {};

    // --- Local Storage Progress Tracking ---
    function getCompletedModules() {
        try {
            return JSON.parse(localStorage.getItem("logiclab_completed_modules") || "[]");
        } catch (e) {
            return [];
        }
    }

    function saveCompletedModules(list) {
        localStorage.setItem("logiclab_completed_modules", JSON.stringify(list));
        updateProgressUI();
    }

    function updateProgressUI() {
        const completed = getCompletedModules();
        const total = theoryCards.length || 7;
        const count = completed.length;

        if (completedCountEl) completedCountEl.textContent = count;
        if (progressBar) {
            const pct = Math.round((count / total) * 100);
            progressBar.style.width = `${pct}%`;
        }

        topicCheckboxes.forEach(cb => {
            const modId = cb.getAttribute("data-module-id");
            const isDone = completed.includes(modId);
            cb.checked = isDone;
            const card = document.getElementById(`module-${modId}`);
            if (card) {
                if (isDone) card.classList.add("completed");
                else card.classList.remove("completed");
            }
        });
    }

    topicCheckboxes.forEach(cb => {
        cb.addEventListener("change", function(e) {
            e.stopPropagation();
            const modId = this.getAttribute("data-module-id");
            let completed = getCompletedModules();
            if (this.checked) {
                if (!completed.includes(modId)) completed.push(modId);
                if (window.showToast) showToast("Module marked as completed!");
            } else {
                completed = completed.filter(id => id !== modId);
            }
            saveCompletedModules(completed);
        });
    });

    if (resetProgressBtn) {
        resetProgressBtn.addEventListener("click", function() {
            saveCompletedModules([]);
            if (window.showToast) showToast("Curriculum progress reset.");
        });
    }

    // --- Theory Accordion Expansion ---
    document.querySelectorAll(".theory-card-header").forEach(header => {
        header.addEventListener("click", function(e) {
            // Do not toggle if user clicked the checkbox directly
            if (e.target.classList.contains("topic-checkbox")) return;
            const card = this.closest(".theory-card");
            card.classList.toggle("open");
        });
    });

    // --- Solved Examples Solution Toggle ---
    document.querySelectorAll(".btn-toggle-solution").forEach(btn => {
        btn.addEventListener("click", function() {
            const solId = this.getAttribute("data-sol-id");
            const solEl = document.getElementById(solId);
            if (solEl) {
                const isHidden = (solEl.style.display === "none");
                solEl.style.display = isHidden ? "block" : "none";
                this.textContent = isHidden ? "Hide Solution" : "Show Solution";
            }
        });
    });

    // --- Quick Concept Check Quizzes inside cards ---
    document.querySelectorAll(".topic-quiz-card").forEach(quizCard => {
        const correctIdx = parseInt(quizCard.getAttribute("data-correct-idx"), 10);
        const optButtons = quizCard.querySelectorAll(".quiz-opt-btn");
        const feedbackBox = quizCard.querySelector(".quiz-feedback-box");
        const feedbackStatus = quizCard.querySelector(".feedback-status");

        optButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                const picked = parseInt(this.getAttribute("data-opt-idx"), 10);
                optButtons.forEach(b => b.disabled = true);

                if (picked === correctIdx) {
                    this.classList.add("correct");
                    feedbackBox.className = "quiz-feedback-box bg-surface border border-success text-success mt-2";
                    feedbackStatus.innerHTML = `<strong>Correct!</strong> `;
                } else {
                    this.classList.add("wrong");
                    optButtons[correctIdx].classList.add("correct");
                    feedbackBox.className = "quiz-feedback-box bg-surface border border-danger text-danger mt-2";
                    feedbackStatus.innerHTML = `<strong>Incorrect.</strong> `;
                }
                feedbackBox.style.display = "block";
            });
        });
    });

    // --- Search & Category Filter ---
    function filterModules() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const activePill = document.querySelector(".filter-pill.active");
        const category = activePill ? activePill.getAttribute("data-category") : "ALL";

        theoryCards.forEach(card => {
            const title = card.getAttribute("data-title") || "";
            const summary = card.getAttribute("data-summary") || "";
            const cardCat = card.getAttribute("data-category") || "";

            const matchesQuery = !query || title.includes(query) || summary.includes(query);
            const matchesCat = (category === "ALL" || cardCat.toLowerCase() === category.toLowerCase());

            if (matchesQuery && matchesCat) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    if (searchInput) searchInput.addEventListener("input", filterModules);

    filterPills.forEach(pill => {
        pill.addEventListener("click", function() {
            filterPills.forEach(p => p.classList.remove("active"));
            this.classList.add("active");
            filterModules();
        });
    });

    // --- 10-Question Certification Final Exam ---
    async function loadExam() {
        try {
            const resp = await fetch("/api/quiz/final");
            const data = await resp.json();
            if (data.success && data.questions) {
                finalQuestions = data.questions;
                renderExamQuestions();
            }
        } catch (e) {
            console.error("Exam load error:", e);
        }
    }

    function renderExamQuestions() {
        if (!examContainer) return;
        examContainer.innerHTML = finalQuestions.map((q, idx) => `
            <div class="exam-question-item" id="exam-q-${idx}">
                <div class="exam-q-num">Question ${idx + 1} of ${finalQuestions.length}</div>
                <div class="exam-q-text">${q.question}</div>
                <div class="quiz-options-group">
                    ${q.options.map((opt, optIdx) => `
                        <button type="button" class="quiz-opt-btn exam-opt-btn" data-q-idx="${idx}" data-opt-idx="${optIdx}">
                            ${opt}
                        </button>
                    `).join("")}
                </div>
                <div class="quiz-feedback-box mt-2" id="exam-feedback-${idx}" style="display: none;"></div>
            </div>
        `).join("");

        // Attach listeners to exam buttons
        document.querySelectorAll(".exam-opt-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const qIdx = parseInt(this.getAttribute("data-q-idx"), 10);
                const optIdx = parseInt(this.getAttribute("data-opt-idx"), 10);

                // Highlight chosen option
                const parent = this.closest(".quiz-options-group");
                parent.querySelectorAll(".exam-opt-btn").forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                this.style.borderColor = "var(--neon-cyan)";
                userAnswers[qIdx] = optIdx;
            });
        });
    }

    if (btnSubmitExam) {
        btnSubmitExam.addEventListener("click", function() {
            const answeredCount = Object.keys(userAnswers).length;
            if (answeredCount < finalQuestions.length) {
                const confirmSubmit = confirm(`You have answered ${answeredCount} of ${finalQuestions.length} questions. Submit anyway?`);
                if (!confirmSubmit) return;
            }

            let score = 0;
            finalQuestions.forEach((q, idx) => {
                const picked = userAnswers[idx];
                const qBox = document.getElementById(`exam-q-${idx}`);
                const feedback = document.getElementById(`exam-feedback-${idx}`);
                const buttons = qBox.querySelectorAll(".exam-opt-btn");

                buttons.forEach(b => b.disabled = true);

                if (picked === q.correct) {
                    score++;
                    if (picked !== undefined) buttons[picked].classList.add("correct");
                    feedback.className = "quiz-feedback-box bg-surface border border-success text-success";
                    feedback.innerHTML = `<strong>Correct:</strong> ${q.explanation}`;
                } else {
                    if (picked !== undefined) buttons[picked].classList.add("wrong");
                    buttons[q.correct].classList.add("correct");
                    feedback.className = "quiz-feedback-box bg-surface border border-danger text-danger";
                    feedback.innerHTML = `<strong>Incorrect:</strong> Correct answer is <em>"${q.options[q.correct]}"</em>. ${q.explanation}`;
                }
                feedback.style.display = "block";
            });

            // Display Certificate & Score
            const pct = Math.round((score / finalQuestions.length) * 100);
            certScoreVal.textContent = score;
            certPercentageVal.textContent = `${pct}%`;

            if (pct >= 70) {
                certificateCard.style.borderColor = "var(--neon-emerald)";
                certVerdictMsg.textContent = "Congratulations! You have demonstrated exceptional mastery of Digital Logic & DELD Concepts!";
                certVerdictMsg.className = "cert-verdict text-success font-weight-bold";
            } else {
                certificateCard.style.borderColor = "var(--neon-amber)";
                certVerdictMsg.textContent = "Good attempt! Review the highlighted answers and retake to earn your certification badge.";
                certVerdictMsg.className = "cert-verdict text-warning";
            }

            certificateCard.style.display = "block";
            certificateCard.scrollIntoView({ behavior: "smooth" });

            btnSubmitExam.style.display = "none";
            btnRetakeExam.style.display = "inline-flex";
            if (window.showToast) showToast(`Examination completed: Score ${score}/${finalQuestions.length} (${pct}%)`);
        });
    }

    if (btnRetakeExam) {
        btnRetakeExam.addEventListener("click", function() {
            userAnswers = {};
            certificateCard.style.display = "none";
            btnSubmitExam.style.display = "inline-flex";
            btnRetakeExam.style.display = "none";
            renderExamQuestions();
            examContainer.scrollIntoView({ behavior: "smooth" });
            if (window.showToast) showToast("Exam reset. Good luck!");
        });
    }

    // Initialize
    updateProgressUI();
    loadExam();
});

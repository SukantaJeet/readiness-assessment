// Application Logic for EdMissions Quiz

// App State
const state = {
  student: {
    name: "",
    grade: "",
    contact: "",
    email: ""
  },
  currentQuestionIndex: 0,
  userAnswers: {}, // questionId -> selectedOptionIndex
  flaggedQuestions: new Set(),
  startTime: null,
  endTime: null,
  timerInterval: null,
  timeElapsedSeconds: 0,
  quizCompleted: false,
  results: null
};

// DOM Elements
const views = {
  welcome: document.getElementById("welcome-view"),
  quiz: document.getElementById("quiz-view"),
  results: document.getElementById("results-view")
};

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  setupEventListeners();
  updateSubmissionsCountBadge();
}

function setupEventListeners() {
  // Start Quiz Form
  const startForm = document.getElementById("student-info-form");
  if (startForm) {
    startForm.addEventListener("submit", (e) => {
      e.preventDefault();
      startQuiz();
    });
  }

  // Navigation Buttons
  document.getElementById("btn-prev").addEventListener("click", () => navigateQuestion(-1));
  document.getElementById("btn-next").addEventListener("click", () => navigateQuestion(1));
  document.getElementById("btn-submit-quiz").addEventListener("click", confirmSubmitQuiz);
  document.getElementById("btn-mark-review").addEventListener("click", toggleFlagCurrentQuestion);

  // Results Actions
  document.getElementById("btn-download-excel").addEventListener("click", downloadStudentExcel);
  document.getElementById("btn-retake-quiz").addEventListener("click", retakeQuiz);
  document.getElementById("btn-view-admin").addEventListener("click", openAdminModal);
  document.getElementById("btn-close-modal").addEventListener("click", closeAdminModal);
  document.getElementById("btn-export-all-excel").addEventListener("click", exportAllSubmissionsExcel);
  document.getElementById("btn-clear-submissions").addEventListener("click", clearAllSubmissions);

  // Review Filters
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      renderReviewList(e.target.dataset.filter);
    });
  });
}

function switchView(viewName) {
  Object.values(views).forEach((v) => v.classList.remove("active"));
  views[viewName].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Start Quiz
function startQuiz() {
  const name = document.getElementById("student-name").value.trim();
  const grade = document.getElementById("student-grade").value.trim();
  const contact = document.getElementById("student-contact").value.trim();
  const email = document.getElementById("student-email").value.trim();

  if (!name || !grade || !contact) {
    showToast("Please fill in all required fields (Name, Grade, Contact).", "warning");
    return;
  }

  state.student = { name, grade, contact, email };
  state.currentQuestionIndex = 0;
  state.userAnswers = {};
  state.flaggedQuestions.clear();
  state.startTime = new Date();
  state.timeElapsedSeconds = 0;
  state.quizCompleted = false;

  startTimer();
  renderPalette();
  renderCurrentQuestion();
  switchView("quiz");
  showToast(`Welcome ${name}! Good luck on your assessment.`);
}

// Timer
function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  const timerEl = document.getElementById("quiz-timer-display");

  state.timerInterval = setInterval(() => {
    state.timeElapsedSeconds++;
    const minutes = Math.floor(state.timeElapsedSeconds / 60);
    const seconds = state.timeElapsedSeconds % 60;
    timerEl.textContent = `⏱ ${padZero(minutes)}:${padZero(seconds)}`;

    // Optional limit warning (if approaching 45 min)
    if (QUIZ_CONFIG.timeLimitMinutes && minutes >= QUIZ_CONFIG.timeLimitMinutes - 5) {
      timerEl.parentElement.classList.add("warning");
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function padZero(num) {
  return num < 10 ? "0" + num : num;
}

// Render Question
function renderCurrentQuestion() {
  const q = QUESTIONS[state.currentQuestionIndex];
  const total = QUESTIONS.length;

  // Header pills & badges
  document.getElementById("current-section-badge").innerHTML = `${getSectionIcon(q.section)} ${q.sectionName}`;
  document.getElementById("question-index-tag").textContent = `QUESTION ${state.currentQuestionIndex + 1} OF ${total}`;

  // Progress Bar
  const percent = Math.round(((state.currentQuestionIndex + 1) / total) * 100);
  document.getElementById("progress-bar-fill").style.width = `${percent}%`;
  document.getElementById("progress-count").textContent = `Question ${state.currentQuestionIndex + 1} of ${total}`;
  document.getElementById("progress-percent").textContent = `${percent}% Completed`;

  // Question Text
  document.getElementById("question-text").textContent = q.text;

  // SVG Diagram (if exists)
  const diagramBox = document.getElementById("question-diagram-container");
  if (q.svgDiagram) {
    diagramBox.innerHTML = q.svgDiagram;
    diagramBox.style.display = "block";
  } else {
    diagramBox.innerHTML = "";
    diagramBox.style.display = "none";
  }

  // Render Options
  const optionsList = document.getElementById("options-list");
  optionsList.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  q.options.forEach((optText, idx) => {
    const isSelected = state.userAnswers[q.id] === idx;
    const optDiv = document.createElement("div");
    optDiv.className = `option-item ${isSelected ? "selected" : ""}`;
    optDiv.setAttribute("role", "button");
    optDiv.setAttribute("tabindex", "0");
    optDiv.innerHTML = `
      <span class="option-letter">${letters[idx]}</span>
      <span class="option-text">${escapeHtml(optText)}</span>
    `;

    optDiv.addEventListener("click", () => selectOption(q.id, idx));
    optionsList.appendChild(optDiv);
  });

  // Flag Button
  const flagBtn = document.getElementById("btn-mark-review");
  if (state.flaggedQuestions.has(q.id)) {
    flagBtn.classList.add("marked");
    flagBtn.innerHTML = `★ Flagged for Review`;
  } else {
    flagBtn.classList.remove("marked");
    flagBtn.innerHTML = `☆ Mark for Review`;
  }

  // Navigation Button States
  document.getElementById("btn-prev").disabled = state.currentQuestionIndex === 0;

  const nextBtn = document.getElementById("btn-next");
  const submitBtn = document.getElementById("btn-submit-quiz");

  if (state.currentQuestionIndex === total - 1) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline-flex";
  } else {
    nextBtn.style.display = "inline-flex";
    submitBtn.style.display = "none";
  }

  updatePaletteHighlight();
}

function getSectionIcon(secId) {
  const sec = QUIZ_SECTIONS.find((s) => s.id === secId);
  return sec ? sec.icon : "📝";
}

function selectOption(qId, optionIndex) {
  state.userAnswers[qId] = optionIndex;
  renderCurrentQuestion();
  updatePaletteHighlight();
}

function toggleFlagCurrentQuestion() {
  const qId = QUESTIONS[state.currentQuestionIndex].id;
  if (state.flaggedQuestions.has(qId)) {
    state.flaggedQuestions.delete(qId);
  } else {
    state.flaggedQuestions.add(qId);
  }
  renderCurrentQuestion();
}

function navigateQuestion(delta) {
  const target = state.currentQuestionIndex + delta;
  if (target >= 0 && target < QUESTIONS.length) {
    state.currentQuestionIndex = target;
    renderCurrentQuestion();
    window.scrollTo({ top: 120, behavior: "smooth" });
  }
}

function jumpToQuestion(index) {
  if (index >= 0 && index < QUESTIONS.length) {
    state.currentQuestionIndex = index;
    renderCurrentQuestion();
    window.scrollTo({ top: 120, behavior: "smooth" });
  }
}

// Question Palette
function renderPalette() {
  const grid = document.getElementById("palette-grid");
  grid.innerHTML = "";

  QUESTIONS.forEach((q, idx) => {
    const btn = document.createElement("button");
    btn.className = "palette-btn";
    btn.textContent = idx + 1;
    btn.dataset.idx = idx;
    btn.addEventListener("click", () => jumpToQuestion(idx));
    grid.appendChild(btn);
  });
}

function updatePaletteHighlight() {
  const buttons = document.querySelectorAll(".palette-btn");
  buttons.forEach((btn, idx) => {
    const q = QUESTIONS[idx];
    btn.className = "palette-btn";

    if (idx === state.currentQuestionIndex) {
      btn.classList.add("current");
    }
    if (state.userAnswers[q.id] !== undefined) {
      btn.classList.add("answered");
    }
    if (state.flaggedQuestions.has(q.id)) {
      btn.classList.add("flagged");
    }
  });
}

// Submit & Scoring
function confirmSubmitQuiz() {
  const answeredCount = Object.keys(state.userAnswers).length;
  const total = QUESTIONS.length;
  const unanswered = total - answeredCount;

  let msg = `You have completed ${answeredCount} of ${total} questions.`;
  if (unanswered > 0) {
    msg += ` Warning: You still have ${unanswered} unanswered question(s). Are you sure you want to finish and submit?`;
  } else {
    msg += ` Are you ready to submit your test?`;
  }

  if (confirm(msg)) {
    submitQuiz();
  }
}

function submitQuiz() {
  stopTimer();
  state.endTime = new Date();
  state.quizCompleted = true;

  // Calculate Scores
  let overallScore = 0;
  const sectionScores = {
    aptitude: { score: 0, total: 10, name: "General Aptitude" },
    english: { score: 0, total: 10, name: "English Readiness" },
    math: { score: 0, total: 10, name: "Math Readiness" }
  };

  QUESTIONS.forEach((q) => {
    const userChoice = state.userAnswers[q.id];
    const isCorrect = userChoice === q.correctIndex;
    if (isCorrect) {
      overallScore++;
      if (sectionScores[q.section]) {
        sectionScores[q.section].score++;
      }
    }
  });

  const percentScore = Math.round((overallScore / QUESTIONS.length) * 100);
  const minutesTaken = Math.floor(state.timeElapsedSeconds / 60);
  const secondsTaken = state.timeElapsedSeconds % 60;
  const durationStr = `${minutesTaken}m ${secondsTaken}s`;

  // Performance Tier
  let performanceTier = "Needs Practice";
  let statusBadgeClass = "warning";
  if (percentScore >= 85) {
    performanceTier = "Advanced Readiness 🌟";
    statusBadgeClass = "success";
  } else if (percentScore >= 70) {
    performanceTier = "Proficient Readiness 👍";
    statusBadgeClass = "success";
  } else if (percentScore >= 50) {
    performanceTier = "Developing Readiness 📈";
    statusBadgeClass = "accent";
  }

  state.results = {
    student: state.student,
    date: state.endTime.toISOString(),
    formattedDate: state.endTime.toLocaleDateString() + " " + state.endTime.toLocaleTimeString(),
    overallScore,
    totalQuestions: QUESTIONS.length,
    percentScore,
    performanceTier,
    durationStr,
    timeElapsedSeconds: state.timeElapsedSeconds,
    sectionScores,
    userAnswers: state.userAnswers
  };

  // Save to Local Submissions Store
  saveSubmissionRecord(state.results);

  // Auto trigger Webhook if configured
  if (QUIZ_CONFIG.webhookUrl) {
    sendWebhookPayload(state.results);
  }

  // Render Results Screen
  renderResultsScreen();
  switchView("results");
  showToast("Assessment submitted successfully! Scores calculated.");

  // Auto download Excel file for convenience
  setTimeout(() => {
    downloadStudentExcel();
  }, 1000);
}

function renderResultsScreen() {
  const r = state.results;

  // Hero Display
  document.getElementById("res-score-number").textContent = r.overallScore;
  document.getElementById("res-score-max").textContent = `/ ${r.totalQuestions}`;
  document.getElementById("res-status-badge").textContent = `${r.performanceTier} (${r.percentScore}%)`;

  // Candidate Summary
  document.getElementById("res-cand-name").textContent = r.student.name;
  document.getElementById("res-cand-grade").textContent = r.student.grade;
  document.getElementById("res-cand-contact").textContent = r.student.contact;
  document.getElementById("res-cand-time").textContent = r.durationStr;

  // Section Breakdown Grid
  const breakdownContainer = document.getElementById("section-cards-grid");
  breakdownContainer.innerHTML = "";

  QUIZ_SECTIONS.forEach((sec) => {
    const data = r.sectionScores[sec.id];
    const secPercent = Math.round((data.score / data.total) * 100);
    const card = document.createElement("div");
    card.className = "sec-result-card";
    card.innerHTML = `
      <h4>${sec.icon} ${data.name}</h4>
      <div class="sec-score-val">${data.score} / ${data.total} <span style="font-size: 0.9rem; font-weight: normal; color: var(--text-muted)">(${secPercent}%)</span></div>
      <div class="sec-progress-bar">
        <div class="sec-progress-fill" style="width: ${secPercent}%"></div>
      </div>
    `;
    breakdownContainer.appendChild(card);
  });

  // Render Detailed Review
  renderReviewList("all");
}

function renderReviewList(filter) {
  const list = document.getElementById("review-items-list");
  list.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  QUESTIONS.forEach((q, idx) => {
    const userChoice = state.userAnswers[q.id];
    const isAnswered = userChoice !== undefined;
    const isCorrect = userChoice === q.correctIndex;

    if (filter === "correct" && !isCorrect) return;
    if (filter === "incorrect" && (isCorrect || !isAnswered)) return;

    let statusClass = isCorrect ? "correct" : isAnswered ? "incorrect" : "unanswered";
    let badgeText = isCorrect ? "Correct ✓" : isAnswered ? "Incorrect ✗" : "Unanswered";

    const userAnsText = isAnswered ? `${letters[userChoice]}. ${q.options[userChoice]}` : "None Selected";
    const correctAnsText = `${letters[q.correctIndex]}. ${q.options[q.correctIndex]}`;

    const card = document.createElement("div");
    card.className = `review-item-card ${statusClass}`;
    card.innerHTML = `
      <div class="rev-top">
        <span style="font-weight: 700; color: var(--text-muted); font-size: 0.85rem">Q${idx + 1} • ${q.sectionName}</span>
        <span class="rev-badge ${statusClass}">${badgeText}</span>
      </div>
      <div class="rev-q-text">${escapeHtml(q.text)}</div>
      <div class="rev-answers-box">
        <div><strong>Your Answer:</strong> <span style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}">${escapeHtml(userAnsText)}</span></div>
        <div><strong>Correct Answer:</strong> <span style="color: var(--success); font-weight: 600">${escapeHtml(correctAnsText)}</span></div>
      </div>
      <div class="rev-explanation">
        <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
      </div>
    `;
    list.appendChild(card);
  });
}

// EXCEL (.XLSX) GENERATION ENGINE
function generateExcelData(resultObj) {
  const letters = ["A", "B", "C", "D"];

  // 1. Summary Sheet Rows
  const summaryRows = [
    ["EDMISSIONS - STUDENT READINESS ASSESSMENT"],
    ["Candidate & Assessment Summary Report"],
    [],
    ["Candidate Full Name:", resultObj.student.name],
    ["Current Grade:", resultObj.student.grade],
    ["Contact Phone:", resultObj.student.contact],
    ["Email Address:", resultObj.student.email || "N/A"],
    ["Date & Time Taken:", resultObj.formattedDate],
    ["Duration Elapsed:", resultObj.durationStr],
    [],
    ["Overall Score:", `${resultObj.overallScore} / ${resultObj.totalQuestions}`],
    ["Percentage Score:", `${resultObj.percentScore}%`],
    ["Performance Readiness Tier:", resultObj.performanceTier],
    [],
    ["SECTION BREAKDOWN", "Score", "Total", "Percentage"],
    [
      "General Aptitude",
      resultObj.sectionScores.aptitude.score,
      resultObj.sectionScores.aptitude.total,
      `${Math.round((resultObj.sectionScores.aptitude.score / 10) * 100)}%`
    ],
    [
      "English Readiness",
      resultObj.sectionScores.english.score,
      resultObj.sectionScores.english.total,
      `${Math.round((resultObj.sectionScores.english.score / 10) * 100)}%`
    ],
    [
      "Math Readiness",
      resultObj.sectionScores.math.score,
      resultObj.sectionScores.math.total,
      `${Math.round((resultObj.sectionScores.math.score / 10) * 100)}%`
    ]
  ];

  // 2. Itemized Question Responses Sheet
  const responseHeaders = [
    "Q#",
    "Section",
    "Question Text",
    "Student Answer",
    "Correct Answer",
    "Result",
    "Explanation"
  ];

  const responseRows = [responseHeaders];

  QUESTIONS.forEach((q, idx) => {
    const userChoice = resultObj.userAnswers[q.id];
    const isAnswered = userChoice !== undefined;
    const isCorrect = userChoice === q.correctIndex;

    const userAnsStr = isAnswered ? `${letters[userChoice]}. ${q.options[userChoice]}` : "(Not Answered)";
    const correctAnsStr = `${letters[q.correctIndex]}. ${q.options[q.correctIndex]}`;

    responseRows.push([
      idx + 1,
      q.sectionName,
      q.text.replace(/\n+/g, " "),
      userAnsStr,
      correctAnsStr,
      isCorrect ? "CORRECT" : "INCORRECT",
      q.explanation
    ]);
  });

  return { summaryRows, responseRows };
}

function downloadStudentExcel() {
  if (!state.results) return;

  const r = state.results;
  const safeName = r.student.name.replace(/[^a-zA-Z0-9]/g, "_") || "Candidate";
  const filename = `${safeName}_Assessment_Score_${new Date().toISOString().slice(0, 10)}.xlsx`;

  if (typeof XLSX !== "undefined") {
    // Generate multi-sheet workbook using SheetJS
    const wb = XLSX.utils.book_new();

    const { summaryRows, responseRows } = generateExcelData(r);

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    const wsResponses = XLSX.utils.aoa_to_sheet(responseRows);

    // Auto set column widths for nice appearance
    wsSummary["!cols"] = [{ wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }];
    wsResponses["!cols"] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 50 },
      { wch: 30 },
      { wch: 30 },
      { wch: 12 },
      { wch: 60 }
    ];

    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary Report");
    XLSX.utils.book_append_sheet(wb, wsResponses, "Question Details");

    XLSX.writeFile(wb, filename);
    showToast(`Excel file downloaded: ${filename}`);
  } else {
    // Pure CSV Fallback if CDN is inaccessible
    downloadCsvFallback(r, filename.replace(".xlsx", ".csv"));
  }
}

function downloadCsvFallback(r, filename) {
  const { summaryRows, responseRows } = generateExcelData(r);
  let csv = "SUMMARY REPORT\r\n";
  summaryRows.forEach((row) => {
    csv += row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(",") + "\r\n";
  });
  csv += "\r\n\r\nITEMIZED RESPONSES\r\n";
  responseRows.forEach((row) => {
    csv += row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(",") + "\r\n";
  });

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(`CSV Report downloaded: ${filename}`);
}

// LOCAL STORAGE PERSISTENCE (ADMIN RECORDS)
const STORAGE_KEY = "edmissions_quiz_submissions";

function saveSubmissionRecord(result) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.unshift(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    updateSubmissionsCountBadge();
  } catch (err) {
    console.error("Error saving submission locally:", err);
  }
}

function getSubmissionsRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (err) {
    return [];
  }
}

function updateSubmissionsCountBadge() {
  const records = getSubmissionsRecords();
  const badge = document.getElementById("admin-count-badge");
  if (badge) {
    badge.textContent = records.length;
  }
}

function openAdminModal() {
  const modal = document.getElementById("admin-modal");
  renderAdminTable();
  modal.classList.add("active");
}

function closeAdminModal() {
  document.getElementById("admin-modal").classList.remove("active");
}

function renderAdminTable() {
  const records = getSubmissionsRecords();
  const tbody = document.getElementById("submissions-tbody");
  tbody.innerHTML = "";

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No test submissions saved yet.</td></tr>`;
    return;
  }

  records.forEach((rec, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${escapeHtml(rec.student.name)}</strong></td>
      <td>${escapeHtml(rec.student.grade)}</td>
      <td>${escapeHtml(rec.student.contact)}</td>
      <td><span style="font-weight: 700; color: var(--primary)">${rec.overallScore} / ${rec.totalQuestions}</span> (${rec.percentScore}%)</td>
      <td>${escapeHtml(rec.formattedDate)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="downloadSingleRecordExcel(${idx})">📥 Excel</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.downloadSingleRecordExcel = function (index) {
  const records = getSubmissionsRecords();
  if (records[index]) {
    state.results = records[index];
    downloadStudentExcel();
  }
};

function exportAllSubmissionsExcel() {
  const records = getSubmissionsRecords();
  if (records.length === 0) {
    showToast("No records available to export.", "warning");
    return;
  }

  const filename = `EdMissions_All_Submissions_Master_${new Date().toISOString().slice(0, 10)}.xlsx`;

  if (typeof XLSX !== "undefined") {
    const wb = XLSX.utils.book_new();

    // Master Table Headers
    const masterHeaders = [
      "ID",
      "Timestamp",
      "Student Name",
      "Grade",
      "Contact Number",
      "Email",
      "Duration",
      "Total Score (/30)",
      "Percentage",
      "Readiness Tier",
      "Aptitude (/10)",
      "English (/10)",
      "Math (/10)"
    ];

    const masterRows = [masterHeaders];

    records.forEach((r, idx) => {
      masterRows.push([
        idx + 1,
        r.formattedDate,
        r.student.name,
        r.student.grade,
        r.student.contact,
        r.student.email || "N/A",
        r.durationStr,
        r.overallScore,
        `${r.percentScore}%`,
        r.performanceTier,
        r.sectionScores?.aptitude?.score ?? "",
        r.sectionScores?.english?.score ?? "",
        r.sectionScores?.math?.score ?? ""
      ]);
    });

    const wsMaster = XLSX.utils.aoa_to_sheet(masterRows);
    wsMaster["!cols"] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 25 },
      { wch: 12 },
      { wch: 18 },
      { wch: 25 },
      { wch: 12 },
      { wch: 16 },
      { wch: 12 },
      { wch: 22 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 }
    ];

    XLSX.utils.book_append_sheet(wb, wsMaster, "Master Submissions");
    XLSX.writeFile(wb, filename);
    showToast(`Exported all ${records.length} submissions to Excel!`);
  } else {
    showToast("XLSX library not loaded.", "warning");
  }
}

function clearAllSubmissions() {
  if (confirm("Are you sure you want to delete all locally saved submissions? This cannot be undone.")) {
    localStorage.removeItem(STORAGE_KEY);
    renderAdminTable();
    updateSubmissionsCountBadge();
    showToast("All historical records cleared.");
  }
}

// RETAKE QUIZ
function retakeQuiz() {
  if (confirm("Do you want to retake the test?")) {
    switchView("welcome");
  }
}

// OPTIONAL GOOGLE APPS SCRIPT WEBHOOK SYNC
function sendWebhookPayload(results) {
  if (!QUIZ_CONFIG.webhookUrl) return;

  fetch(QUIZ_CONFIG.webhookUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(results)
  })
    .then(() => {
      console.log("Results synced to remote webhook / Google Sheets!");
    })
    .catch((err) => {
      console.warn("Webhook sync note:", err);
    });
}

// UTILITIES
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

if (false) {
const button = document.getElementById("analyzeBtn");

button.addEventListener("click", async function (event) {

    // 🚨 Prevent page refresh
    event.preventDefault();

    const code = document.getElementById("codeInput").value;

    try {

        const response = await fetch("http://localhost:8000/api/analyze-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code
            })
        });

        const data = await response.json();

        document.getElementById("error").innerText =
            "Error: " + (data.error || "");

        document.getElementById("explanation").innerText =
            "Explanation: " + (data.explanation || "");

        document.getElementById("fix").innerText =
            "Suggested Fix: " + (data.fix || "");

        if (data.complexity) {
            document.getElementById("complexity").innerText =
                "Time Complexity: " + data.complexity;
        } else {
            document.getElementById("complexity").innerText = "";
        }

        if (data.suggestions && data.suggestions.length > 0) {
            document.getElementById("suggestions").innerText =
                "Suggestions:\n" + data.suggestions.join("\n");
        } else {
            document.getElementById("suggestions").innerText = "";
        }

    } catch (error) {

        console.error("API Error:", error);

        document.getElementById("error").innerText =
            "Error connecting to backend.";

    }

});


function analyzeRepo() {

    const url = document.getElementById("repoUrl").value;

    fetch("http://localhost:8000/api/github-analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: url
        })
    })
    .then(response => response.json())
    .then(data => {

        document.getElementById("repoName").innerText =
            "Name: " + (data.name || "");

        document.getElementById("repoOwner").innerText =
            "Owner: " + (data.owner || "");

        document.getElementById("repoLanguage").innerText =
            "Language: " + (data.language || "");

        document.getElementById("repoStars").innerText =
            "Stars: " + (data.stars || "");

    })
    .catch(error => {

        console.error("GitHub API Error:", error);

        document.getElementById("repoName").innerText =
            "Error analyzing repository.";

    });

}
}

const API_BASE_URL = window.CODEBUDDY_API_BASE_URL || "http://127.0.0.1:8000";
const DEMO_SNIPPET = `for i in range(10)
    print(i)`;

const codeForm = document.getElementById("code-form");
const repoForm = document.getElementById("repo-form");
const codeInput = document.getElementById("codeInput");
const repoUrlInput = document.getElementById("repoUrl");
const loadSampleButton = document.getElementById("loadSampleBtn");
const analysisStatus = document.getElementById("analysisStatus");
const repoStatus = document.getElementById("repoStatus");
const suggestionsList = document.getElementById("suggestionsList");
const historyList = document.getElementById("historyList");


function setText(id, value) {
    document.getElementById(id).textContent = value;
}


function setStatus(element, message, tone = "default") {
    element.textContent = message;
    element.dataset.tone = tone;
}


async function requestJson(path, payload, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method || "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const message = data.error || data.detail || "Request failed.";
        throw new Error(message);
    }

    return data;
}


function renderSuggestions(suggestions) {
    suggestionsList.innerHTML = "";

    suggestions.forEach((suggestion) => {
        const item = document.createElement("li");
        item.textContent = suggestion;
        suggestionsList.appendChild(item);
    });
}


function renderHistory(history) {
    historyList.innerHTML = "";

    if (!history.length) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "history-empty";
        emptyItem.textContent = "No analyses yet. Run your first check to populate the tracker.";
        historyList.appendChild(emptyItem);
        return;
    }

    history.forEach((entry) => {
        const item = document.createElement("li");
        item.className = "history-item";

        const summary = document.createElement("div");
        summary.className = "history-summary";
        summary.textContent = entry.code_preview || "Code sample";

        const meta = document.createElement("div");
        meta.className = "history-meta";
        meta.textContent = `${entry.error || "No syntax errors"} | ${entry.complexity} | ${new Date(entry.created_at).toLocaleString()}`;

        item.append(summary, meta);
        historyList.appendChild(item);
    });
}


async function refreshHistory() {
    try {
        const history = await requestJson("/api/history", null, { method: "GET" });
        renderHistory(history);
    } catch (error) {
        historyList.innerHTML = "";
        const item = document.createElement("li");
        item.className = "history-empty";
        item.textContent = `History unavailable: ${error.message}`;
        historyList.appendChild(item);
    }
}


async function handleCodeAnalysis(event) {
    event.preventDefault();

    if (!codeInput.value.trim()) {
        setStatus(analysisStatus, "Paste Python code before running analysis.", "error");
        return;
    }

    setStatus(analysisStatus, "Analyzing Python code...", "working");

    try {
        const data = await requestJson("/api/analyze-code", { code: codeInput.value });
        setText("errorValue", data.error || "No syntax errors detected");
        setText("explanationValue", data.explanation || "No explanation available.");
        setText("fixValue", data.fix || "No fix required.");
        setText("complexityValue", data.complexity || "Unknown");
        renderSuggestions(data.suggestions || ["No suggestions available."]);
        setStatus(analysisStatus, "Analysis complete.", "success");
        await refreshHistory();
    } catch (error) {
        setStatus(analysisStatus, error.message, "error");
        setText("errorValue", "Unable to reach the backend");
    }
}


async function handleRepositoryAnalysis(event) {
    event.preventDefault();

    if (!repoUrlInput.value.trim()) {
        setStatus(repoStatus, "Paste a GitHub repository URL first.", "error");
        return;
    }

    setStatus(repoStatus, "Contacting GitHub...", "working");

    try {
        const data = await requestJson("/api/github-analyze", { url: repoUrlInput.value });
        setText("repoName", data.name || "Unknown");
        setText("repoOwner", data.owner || "Unknown");
        setText("repoLanguage", data.language || "Unknown");
        setText("repoStars", String(data.stars ?? 0));
        setStatus(repoStatus, "Repository insights loaded.", "success");
    } catch (error) {
        setStatus(repoStatus, error.message, "error");
        setText("repoName", "Unable to analyze repository");
        setText("repoOwner", "Unavailable");
        setText("repoLanguage", "Unavailable");
        setText("repoStars", "Unavailable");
    }
}


loadSampleButton.addEventListener("click", () => {
    codeInput.value = DEMO_SNIPPET;
    codeInput.focus();
    setStatus(analysisStatus, "Demo snippet loaded. Run analysis to see the syntax explainer.", "default");
});

codeForm.addEventListener("submit", handleCodeAnalysis);
repoForm.addEventListener("submit", handleRepositoryAnalysis);
refreshHistory();

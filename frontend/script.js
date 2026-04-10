const button = document.getElementById("analyzeBtn");

button.addEventListener("click", async function () {

    const code = document.getElementById("codeInput").value;

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

    document.getElementById("error").innerText = "Error: " + data.error;
    document.getElementById("explanation").innerText = "Explanation: " + data.explanation;
    document.getElementById("fix").innerText = "Suggested Fix: " + data.fix;

});

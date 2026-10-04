async function checkWebsite() {

    let url = document.getElementById("websiteURL").value.trim();

    // EMPTY URL
    if (url === "") {

        document.getElementById("result").innerHTML =
            "⚠️ Please enter a website URL.";

        document.getElementById("scoreNumber").innerText = "0";

        document.getElementById("riskLevel").innerText =
            "Not Analyzed";

        document.getElementById("riskMessage").innerText =
            "Enter a website to start security analysis.";

        document.getElementById("securityStatus").innerText =
            "Waiting";

        document.getElementById("riskFill").style.width = "0%";

        document.getElementById("reasons").innerHTML = "";

        document.getElementById("domainInfo").innerHTML = "";

        return;
    }


    // LOADING
    document.getElementById("result").innerHTML =
        "🔍 Analyzing website...";

    document.getElementById("securityStatus").innerText =
        "Analyzing";

    document.getElementById("riskLevel").innerText =
        "Analyzing...";

    document.getElementById("riskMessage").innerText =
        "Checking website security...";

    document.getElementById("riskFill").style.width = "0%";

    document.getElementById("reasons").innerHTML = "";

    document.getElementById("domainInfo").innerHTML = "";


    try {

        // CONNECT TO FLASK
        let response = await fetch(
            "http://127.0.0.1:5000/check",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: url
                })
            }
        );


        let data = await response.json();


        // BACKEND ERROR
        if (!response.ok) {

            document.getElementById("result").innerHTML =
                "❌ " + (data.error || "Something went wrong.");

            return;
        }


        // GET RESULT
        let riskScore = data.risk_score;

        let riskLevel = data.risk_level;


        // SCORE
        document.getElementById("scoreNumber").innerText =
            riskScore;


        // PROGRESS BAR
        document.getElementById("riskFill").style.width =
            riskScore + "%";


        // =================================
        // HIGH RISK
        // =================================

        if (riskLevel === "HIGH RISK") {

            document.getElementById("result").innerHTML =
                "🔴 HIGH RISK - Potentially Suspicious Website";

            document.getElementById("riskLevel").innerText =
                "HIGH RISK";

            document.getElementById("riskMessage").innerText =
                "This website shows multiple suspicious characteristics.";

            document.getElementById("securityStatus").innerText =
                "DANGER";


            // RED
            document.getElementById("securityStatus").style.background =
                "#fee2e2";

            document.getElementById("securityStatus").style.color =
                "#dc2626";

            document.getElementById("riskFill").style.background =
                "#dc2626";

            document.querySelector(".score-circle").style.borderColor =
                "#dc2626";

            document.getElementById("scoreNumber").style.color =
                "#dc2626";
        }


        // =================================
        // MEDIUM RISK
        // =================================

        else if (riskLevel === "MEDIUM RISK") {

            document.getElementById("result").innerHTML =
                "🟡 MEDIUM RISK - Be Careful";

            document.getElementById("riskLevel").innerText =
                "MEDIUM RISK";

            document.getElementById("riskMessage").innerText =
                "This website has some suspicious characteristics.";

            document.getElementById("securityStatus").innerText =
                "WARNING";


            // YELLOW
            document.getElementById("securityStatus").style.background =
                "#fef3c7";

            document.getElementById("securityStatus").style.color =
                "#d97706";

            document.getElementById("riskFill").style.background =
                "#f59e0b";

            document.querySelector(".score-circle").style.borderColor =
                "#f59e0b";

            document.getElementById("scoreNumber").style.color =
                "#d97706";
        }


        // =================================
        // LOW RISK
        // =================================

        else {

            document.getElementById("result").innerHTML =
                "🟢 LOW RISK - No Major Suspicious Signs Found";

            document.getElementById("riskLevel").innerText =
                "LOW RISK";

            document.getElementById("riskMessage").innerText =
                "No major suspicious signs were detected.";

            document.getElementById("securityStatus").innerText =
                "SAFE";


            // GREEN
            document.getElementById("securityStatus").style.background =
                "#dcfce7";

            document.getElementById("securityStatus").style.color =
                "#16a34a";

            document.getElementById("riskFill").style.background =
                "#16a34a";

            document.querySelector(".score-circle").style.borderColor =
                "#16a34a";

            document.getElementById("scoreNumber").style.color =
                "#16a34a";
        }


        // =================================
        // SECURITY ANALYSIS
        // =================================

        document.getElementById("reasons").innerHTML =
            "<h3>🔎 Security Analysis</h3>" +

            data.reasons
                .map(function(reason) {
                    return "<p>" + reason + "</p>";
                })
                .join("");


        // =================================
        // DOMAIN INFORMATION
        // =================================
        // MANDANA AI PROMPT
        let mandanaPrompt =
            "You are analyzing a website security result.\n\n" +

            "Website URL: " + data.url + "\n" +
            "Risk Score: " + data.risk_score + "/100\n" +
            "Risk Level: " + data.risk_level + "\n\n" +

            "Security Findings:\n" +
            data.reasons.join("\n") +

            "\n\nAnalyze this cybersecurity decision using:\n" +
            "1. Lean - What evidence suggests the website is risky or safe?\n" +
            "2. Tension - What uncertainty or opposing possibility should be considered?\n" +
            "3. Take - What is the best practical conclusion for the user?\n" +
            "4. Confidence - How confident are you and why?\n" +
            "5. Ask - What should the user verify or do next?\n\n" +

            "Do not claim that the website is definitely fake or definitely safe based only on these signals.";

        document.getElementById("mandanaPrompt").value =
            mandanaPrompt;

        document.getElementById("mandanaStatus").innerText =
            "✅ Mandana AI prompt generated. Click 'Copy for Mandana AI'.";
        if (data.domain_info) {

            document.getElementById("domainInfo").innerHTML =

                "<h3>🌐 Domain Information</h3>" +

                "<div class='domain-row'>" +

                "<span class='domain-label'>Protocol</span>" +

                "<span class='domain-value'>" +
                data.domain_info.protocol +
                "</span>" +

                "</div>" +


                "<div class='domain-row'>" +

                "<span class='domain-label'>Hostname</span>" +

                "<span class='domain-value'>" +
                data.domain_info.hostname +
                "</span>" +

                "</div>" +


                "<div class='domain-row'>" +

                "<span class='domain-label'>Path</span>" +

                "<span class='domain-value'>" +
                data.domain_info.path +
                "</span>" +

                "</div>";
        }

    }


    // =================================
    // CONNECTION ERROR
    // =================================

    catch (error) {

        console.error(error);

        document.getElementById("result").innerHTML =
            "❌ Could not connect to Python backend.";

        document.getElementById("securityStatus").innerText =
            "OFFLINE";

        document.getElementById("riskLevel").innerText =
            "Not Connected";

        document.getElementById("riskMessage").innerText =
            "Please make sure the Flask server is running.";

        document.getElementById("riskFill").style.width =
            "0%";
    }

}
function copyMandanaPrompt() {

    let prompt = document.getElementById("mandanaPrompt").value;

    if (prompt === "") {

        document.getElementById("mandanaStatus").innerText =
            "⚠️ Analyze a website first.";

        return;
    }

    navigator.clipboard.writeText(prompt)
        .then(function() {

            document.getElementById("mandanaStatus").innerText =
                "✅ Prompt copied! Open Mandana AI and paste it.";

        })
        .catch(function() {

            document.getElementById("mandanaStatus").innerText =
                "❌ Could not copy the prompt.";
        });
}
function showMandanaResponse() {

    let response =
        document.getElementById("mandanaResponseInput").value.trim();

    if (response === "") {

        document.getElementById("mandanaResponse").textContent =
            "⚠️ Please paste the Mandana AI response first.";

        return;
    }

    document.getElementById("mandanaResponse").textContent =
        response;
}
function showMandanaResponse() {

    let response =
        document.getElementById("mandanaResponseInput").value.trim();

    if (response === "") {

        document.getElementById("mandanaResponse").textContent =
            "⚠️ Please paste the Mandana AI response first.";

        return;
    }

    document.getElementById("mandanaResponse").textContent =
        response;
}
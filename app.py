from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse
import re

app = Flask(__name__)

# Allow frontend to connect with Flask
CORS(app)


# Home page
@app.route("/")
def home():
    return "Fake Website Detector Backend is Running!"


# Website checking API
@app.route("/check", methods=["POST"])
def check_website():

    data = request.get_json()

    url = data.get("url", "").strip()

    # Empty URL
    if url == "":
        return jsonify({
            "error": "URL is required"
        }), 400


    risk_score = 0
    reasons = []

    lower_url = url.lower()


    # ================= HTTPS CHECK =================

    if lower_url.startswith("https://"):

        reasons.append("✅ HTTPS detected")

    else:

        risk_score += 20

        reasons.append(
            "❌ Website is not using HTTPS"
        )


    # ================= URL INFORMATION =================

    parsed_url = urlparse(url)

    hostname = parsed_url.hostname or ""

    protocol = parsed_url.scheme or "unknown"

    path = parsed_url.path or "/"


    # ================= IP ADDRESS CHECK =================

    ip_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"

    if re.match(ip_pattern, hostname):

        risk_score += 25

        reasons.append(
            "⚠️ URL uses an IP address instead of a normal domain"
        )


    # ================= URL LENGTH =================

    if len(url) > 75:

        risk_score += 15

        reasons.append(
            "⚠️ URL is unusually long"
        )

    else:

        reasons.append(
            "✅ URL length looks normal"
        )


    # ================= SUSPICIOUS KEYWORDS =================

    suspicious_words = [
        "login",
        "verify",
        "password",
        "account",
        "free",
        "prize",
        "winner",
        "claim",
        "urgent",
        "update",
        "bank"
    ]

    found_keywords = []


    for word in suspicious_words:

        if word in lower_url:

            found_keywords.append(word)


    if found_keywords:

        risk_score += len(found_keywords) * 8

        reasons.append(
            "⚠️ Suspicious keywords detected: "
            + ", ".join(found_keywords)
        )

    else:

        reasons.append(
            "✅ No suspicious keywords detected"
        )


    # ================= @ SYMBOL =================

    if "@" in url:

        risk_score += 25

        reasons.append(
            "⚠️ Suspicious @ symbol found in URL"
        )


    # ================= SPECIAL CHARACTERS =================

    special_characters = len(
        re.findall(r"[-_@%]", url)
    )

    if special_characters >= 5:

        risk_score += 15

        reasons.append(
            "⚠️ URL contains many special characters"
        )


    # ================= DOUBLE SLASH =================

    if "//" in url[8:]:

        risk_score += 10

        reasons.append(
            "⚠️ Unusual URL structure detected"
        )


    # ================= SCORE LIMIT =================

    if risk_score > 100:

        risk_score = 100


    # ================= RISK LEVEL =================

    if risk_score >= 60:

        risk_level = "HIGH RISK"

    elif risk_score >= 30:

        risk_level = "MEDIUM RISK"

    else:

        risk_level = "LOW RISK"


    # ================= SEND RESULT =================

    return jsonify({

        "url": url,

        "risk_score": risk_score,

        "risk_level": risk_level,

        "reasons": reasons,

        "domain_info": {

            "protocol": protocol,

            "hostname": hostname,

            "path": path
        }
    })


# ================= START SERVER =================

if __name__ == "__main__":

    app.run(debug=True)
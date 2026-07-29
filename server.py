import os
import datetime
import webbrowser
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder="web", static_url_path="")
CORS(app)

SITES = [
    ["youtube", "https://www.youtube.com/"],
    ["facebook", "https://www.facebook.com/"],
    ["twitter", "https://www.twitter.com/"],
    ["github", "https://www.github.com/"],
    ["google", "https://www.google.com/"],
    ["google maps", "https://www.google.com/maps/"],
    ["zomato", "https://www.zomato.com/"],
    ["netflix", "https://www.netflix.com/"]
]

def process_command(query: str):
    if not query:
        return {"action": "none", "speech": "I did not receive a command."}

    query_lower = query.lower()

    # Sites
    for site, url in SITES:
        if f"open {site}" in query_lower:
            webbrowser.open(url)
            return {"action": "open_url", "url": url, "speech": f"Opening {site}."}

    # Spotify
    if "open spotify" in query_lower:
        try:
            webbrowser.open("spotify:")
            return {"action": "open_app", "app": "Spotify", "speech": "Opening Spotify."}
        except Exception:
            try:
                os.startfile("Spotify.exe")
                return {"action": "open_app", "app": "Spotify", "speech": "Opening Spotify."}
            except Exception as e:
                return {"action": "error", "speech": f"Failed to launch Spotify: {str(e)}"}

    # Time
    if "the time" in query_lower or "current time" in query_lower:
        current_time = datetime.datetime.now().strftime("%I:%M %p")
        return {"action": "tell_time", "speech": f"The current time is {current_time}."}

    # Name
    if "what is your name" in query_lower or "who are you" in query_lower:
        return {"action": "identity", "speech": "I am Cosmo, your futuristic desktop assistant."}

    # Greetings
    if any(k in query_lower for k in ["hello", "hi", "hey", "jarvis", "status"]):
        return {"action": "greet", "speech": "Greetings, Agent. JARVIS HUD online and systems fully operational."}

    return {"action": "unknown", "speech": f"Command processed: '{query}'. Systems standing by."}

@app.route("/")
def index():
    return send_from_directory("web", "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory("web", path)

@app.route("/api/command", methods=["POST"])
def api_command():
    data = request.get_json(force=True, silent=True) or {}
    query = data.get("query", "")
    res = process_command(query)
    return jsonify(res)

@app.route("/api/status", methods=["GET"])
def api_status():
    return jsonify({
        "status": "ONLINE",
        "system": "Cosmo JARVIS v2.0",
        "timestamp": datetime.datetime.now().isoformat()
    })

if __name__ == "__main__":
    print("Starting Cosmo JARVIS Server on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)

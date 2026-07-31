import os
import datetime
import webbrowser
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Import speech command handling from main
try:
    from main import take_command
except ImportError:
    def take_command():
        return ""

# Optional dotenv loading if module is available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Setup Gemini AI Client if API key present
gemini_client = None
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        print("[COSMO] Gemini AI Client initialized successfully!")
    except Exception as e:
        print(f"[COSMO WARNING] Could not initialize Gemini Client: {e}")

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

def call_gemini(prompt: str) -> str:
    if not gemini_client:
        return "Greetings! Configure your API_KEY in your .env file to enable AI responses."
    
    models_to_try = [
        'gemini-2.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-pro-latest',
        'gemini-1.5-pro'
    ]

    try:
        listed = [m.name for m in gemini_client.models.list()]
        if listed:
            clean_models = [m.replace('models/', '') for m in listed if 'gemini' in m.lower()]
            if clean_models:
                models_to_try = clean_models + models_to_try
    except Exception:
        pass
    
    last_err = ""
    for model_name in models_to_try:
        try:
            response = gemini_client.models.generate_content(
                model=model_name,
                contents=f"You are Cosmo, a helpful desktop voice assistant. Respond concisely and naturally (max 2 sentences). User query: {prompt}"
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            last_err = str(e)
            continue
            
    return f"Cosmo AI Note: Gemini API error: {last_err}."

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
            return {"action": "open_app", "app": "Spotify", "speech": "Opening Spotify application."}
        except Exception:
            try:
                os.startfile("Spotify.exe")
                return {"action": "open_app", "app": "Spotify", "speech": "Opening Spotify application."}
            except Exception as e:
                return {"action": "error", "speech": f"Error launching Spotify: {str(e)}"}

    # Time
    if "the time" in query_lower or "current time" in query_lower:
        current_time = datetime.datetime.now().strftime("%I:%M %p")
        return {"action": "tell_time", "speech": f"The current time is {current_time}."}

    # Name / Identity
    if "what is your name" in query_lower or "who are you" in query_lower:
        return {"action": "identity", "speech": "I am Cosmo, your desktop voice assistant."}

    # Greetings
    if any(k in query_lower for k in ["hello", "hi", "hey", "cosmo", "status"]):
        return {"action": "greet", "speech": "Hello! Cosmo systems online and ready."}

    # Default: Query Gemini API
    ai_response = call_gemini(query)
    return {"action": "gemini", "speech": ai_response}

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

@app.route("/api/listen", methods=["POST", "GET"])
def api_listen():
    query = take_command()
    if not query:
        return jsonify({"query": "", "speech": "No speech detected.", "action": "none"})
    res = process_command(query)
    res["query"] = query
    return jsonify(res)

@app.route("/api/status", methods=["GET"])
def api_status():
    return jsonify({
        "status": "ONLINE",
        "system": "Cosmo Desktop Assistant v5.1",
        "gemini_active": gemini_client is not None,
        "timestamp": datetime.datetime.now().isoformat()
    })

if __name__ == "__main__":
    print("Starting Cosmo Desktop Assistant Server on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)

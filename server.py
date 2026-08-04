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
chat_session = None

def get_best_model(client):
    models_to_try = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro']
    try:
        listed = [m.name.replace('models/', '') for m in client.models.list()]
        for m in models_to_try:
            if m in listed:
                return m
        if listed:
            return [m for m in listed if 'gemini' in m.lower()][0]
    except Exception:
        pass
    return 'gemini-1.5-flash'

def init_gemini(api_key):
    global gemini_client, chat_session
    try:
        from google import genai
        gemini_client = genai.Client(api_key=api_key)
        model_name = get_best_model(gemini_client)
        chat_session = gemini_client.chats.create(model=model_name)
        print(f"[COSMO] Gemini AI Client initialized with model {model_name}!")
        return True
    except Exception as e:
        print(f"[COSMO WARNING] Could not initialize Gemini Client: {e}")
        gemini_client = None
        chat_session = None
        return False

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    init_gemini(GEMINI_API_KEY)

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

def call_gemini(prompt: str, image=None) -> str:
    if not chat_session:
        return "Greetings! Configure your API_KEY in settings to enable AI responses."
    
    sys_prompt = f"You are Cosmo, a helpful desktop voice assistant. Respond concisely and naturally (max 2 sentences). User query: {prompt}"
    
    try:
        if image:
            response = chat_session.send_message([sys_prompt, image])
        else:
            response = chat_session.send_message(sys_prompt)
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        return f"Cosmo AI Note: Gemini API error: {str(e)}"
        
    return "Cosmo AI Note: No response."

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

    # Volume Control
    if "volume up" in query_lower:
        try:
            import platform, subprocess
            if platform.system() == "Linux":
                subprocess.run(["wpctl", "set-volume", "@DEFAULT_AUDIO_SINK@", "5%+"], check=False)
            else:
                import pyautogui
                pyautogui.press('volumeup', presses=5)
            return {"action": "volume_up", "speech": "Increasing volume."}
        except Exception as e:
            return {"action": "error", "speech": "Volume up failed."}
    if "volume down" in query_lower:
        try:
            import platform, subprocess
            if platform.system() == "Linux":
                subprocess.run(["wpctl", "set-volume", "@DEFAULT_AUDIO_SINK@", "5%-"], check=False)
            else:
                import pyautogui
                pyautogui.press('volumedown', presses=5)
            return {"action": "volume_down", "speech": "Decreasing volume."}
        except Exception as e:
            return {"action": "error", "speech": "Volume down failed."}
    if "mute" in query_lower:
        try:
            import platform, subprocess
            if platform.system() == "Linux":
                subprocess.run(["wpctl", "set-mute", "@DEFAULT_AUDIO_SINK@", "toggle"], check=False)
            else:
                import pyautogui
                pyautogui.press('volumemute')
            return {"action": "volume_mute", "speech": "Toggling audio mute."}
        except Exception as e:
            return {"action": "error", "speech": "Muting failed."}

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
        "system": "Cosmo Desktop Assistant v6.0",
        "gemini_active": chat_session is not None,
        "timestamp": datetime.datetime.now().isoformat()
    })

@app.route("/api/settings", methods=["POST"])
def api_settings():
    data = request.get_json(force=True, silent=True) or {}
    api_key = data.get("api_key", "").strip()
    if api_key:
        try:
            with open(".env", "w") as f:
                f.write(f"GEMINI_API_KEY={api_key}\n")
            os.environ["GEMINI_API_KEY"] = api_key
            success = init_gemini(api_key)
            if success:
                return jsonify({"status": "success", "message": "API Key saved and Gemini initialized."})
            else:
                return jsonify({"status": "error", "message": "Invalid API Key or initialization failed."})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)})
    return jsonify({"status": "error", "message": "No API Key provided."})



if __name__ == "__main__":
    print("Starting Cosmo Desktop Assistant Server on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)

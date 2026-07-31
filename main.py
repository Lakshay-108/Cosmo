import os
import sys
import datetime
import webbrowser
import speech_recognition as sr

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

# Fallback text-to-speech initialization
try:
    import win32com.client
    speaker = win32com.client.Dispatch("SAPI.SpVoice")
    def speak(text: str):
        print(f"Cosmo: {text}")
        try:
            speaker.speak(text)
        except Exception:
            pass
except Exception:
    try:
        import pyttsx3
        engine = pyttsx3.init()
        def speak(text: str):
            print(f"Cosmo: {text}")
            try:
                engine.say(text)
                engine.runAndWait()
            except Exception:
                pass
    except Exception:
        def speak(text: str):
            print(f"Cosmo: {text}")

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
        return "Gemini API key is not configured. Add GEMINI_API_KEY to your .env file for AI responses."
    
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
                contents=f"You are Cosmo, a helpful and intelligent desktop AI assistant. Respond concisely (max 2-3 sentences). User query: {prompt}"
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            last_err = str(e)
            continue
            
    return f"Gemini API Error: {last_err}"

def take_command():
    try:
        r = sr.Recognizer()
        with sr.Microphone() as source:
            r.pause_threshold = 1
            print("\nListening...")
            try:
                audio = r.listen(source, timeout=5)
                query = r.recognize_google(audio, language="en-in")
                print(f"User: {query}")
                return query
            except sr.UnknownValueError:
                print("Could not understand audio.")
                return ""
            except sr.RequestError as e:
                print(f"Speech Recognition service error: {e}")
                return ""
            except Exception:
                return ""
    except (AttributeError, OSError, Exception):
        try:
            query = input("\nEnter command (or press Ctrl+C to exit): ")
            return query
        except (KeyboardInterrupt, EOFError):
            return "exit"

def greet_user():
    current_hour = datetime.datetime.now().hour
    if current_hour < 12:
        greeting = "Good Morning, Commander!"
    elif current_hour < 18:
        greeting = "Good Afternoon, Commander!"
    else:
        greeting = "Good Evening, Commander!"
    speak(f"{greeting} I am Cosmo, your CLI assistant.")

def main():
    print("==============================================")
    print("      COSMO CLI DESKTOP AI ASSISTANT         ")
    print("==============================================")
    greet_user()
    
    while True:
        query = take_command()
        if not query:
            continue

        query_lower = query.lower()

        # Check websites
        opened_site = False
        for site, url in SITES:
            if f"open {site}" in query_lower:
                speak(f"Opening {site}...")
                webbrowser.open(url)
                opened_site = True
                break
        if opened_site:
            continue

        # Spotify
        if "open spotify" in query_lower:
            speak("Opening Spotify...")
            try:
                webbrowser.open("spotify:")
            except Exception:
                try:
                    os.startfile("Spotify.exe")
                except Exception as e:
                    speak("Could not open Spotify automatically.")
                    print(f"Error opening Spotify: {e}")

        # Current time
        elif "the time" in query_lower or "current time" in query_lower:
            current_time = datetime.datetime.now().strftime("%I:%M %p")
            speak(f"The current time is {current_time}")

        elif "what is your name" in query_lower or "who are you" in query_lower:
            speak("My name is Cosmo, your desktop CLI assistant.")

        # Exit commands
        elif any(cmd in query_lower for cmd in ["stop running cosmo", "exit", "quit", "goodbye"]):
            speak("Goodbye, Commander!")
            break

        # Fallback to Gemini AI
        else:
            response = call_gemini(query)
            speak(response)

if __name__ == "__main__":
    main()

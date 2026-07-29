import speech_recognition as sr
import os
import webbrowser
import win32com.client
import datetime

# Fallback voice initialization for TTS
try:
    speaker = win32com.client.Dispatch("SAPI.SpVoice")
    def speak(text: str):
        speaker.speak(text)
except Exception:
    import pyttsx3
    engine = pyttsx3.init()
    def speak(text: str):
        engine.say(text)
        engine.runAndWait()

def take_command():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        r.pause_threshold = 1
        print("Listening...")
        try:
            audio = r.listen(source)
            query = r.recognize_google(audio, language="en-in")
            print(f"User said: {query}\n")
            return query
        except sr.UnknownValueError:
            print("Could not understand audio.")
            return ""
        except sr.RequestError as e:
            print(f"Speech Recognition service error: {e}")
            return ""
        except Exception as e:
            print(f"Error listening: {e}")
            return ""

def greet_user():
    current_hour = datetime.datetime.now().hour
    if current_hour < 12:
        speak("Good Morning!")
    elif current_hour < 18:
        speak("Good Afternoon!")
    else:
        speak("Good Evening!")

def main():
    greet_user()
    speak("How can I assist you?")

    sites = [
        ["youtube", "https://www.youtube.com/"],
        ["facebook", "https://www.facebook.com/"],
        ["twitter", "https://www.twitter.com/"],
        ["github", "https://www.github.com/"],
        ["google", "https://www.google.com/"],
        ["google maps", "https://www.google.com/maps/"],
        ["zomato", "https://www.zomato.com/"],
        ["netflix", "https://www.netflix.com/"]
    ]

    while True:
        query = take_command()
        if not query:
            continue

        query_lower = query.lower()

        # Check websites
        opened_site = False
        for site, url in sites:
            if f"open {site}" in query_lower:
                speak(f"Opening {site}..")
                webbrowser.open(url)
                opened_site = True
                break
        if opened_site:
            continue

        # Opens Spotify via URI protocol or fallback
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

        # Shows current time
        elif "the time" in query_lower:
            current_time = datetime.datetime.now().strftime("%H:%M:%S")
            speak(f"The time is {current_time}")

        elif "what is your name" in query_lower:
            speak("My name is Cosmo")

        # Stop running Cosmo
        elif "stop running cosmo" in query_lower or "exit" in query_lower or "quit" in query_lower:
            speak("Goodbye!")
            print("Stopped Cosmo")
            break

if __name__ == "__main__":
    main()

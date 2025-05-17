import speech_recognition as sr
import os
import webbrowser
import win32com.client
import datetime

speaker = win32com.client.Dispatch("SAPI.SpVoice")

def take_command():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        r.pause_threshold = 1
        audio = r.listen(source)
        try:
            query = r.recognize_google(audio, language="en-in")
            print(f"User said: {query}\n")
            return query
        except Exception:
            return "An error occurred, Please try again"

def greet_user():
    current_hour = datetime.datetime.now().hour
    if current_hour < 12:
        speaker.speak("Good Morning!")
    elif current_hour < 18:
        speaker.speak("Good Afternoon!")
    else:
        speaker.speak("Good Evening!")

# Starts by greeting the user.
greet_user()
speaker.speak("How can I assist you?")

while True:
    print("Listening...")
    query = take_command()
    
    #Some websites are added including YouTube, Google, Github etc.
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
    for site in sites:
        if f"Open {site[0]}".lower() in query.lower():
            speaker.speak(f"Opening {site[0]}..")
            webbrowser.open(site[1])

    # Opens Spotify
    if "Open Spotify".lower() in query.lower():
        speaker.speak("Opening Spotify...")
        os.startfile("Spotify.exe")

    if "Open Telegram".lower() in query.lower():
        speaker.speak("Opening Telegram...")
        os.startfile()
    # Shows current time
    if "the time".lower() in query.lower():
        time = datetime.datetime.now().strftime("%H:%M:%S")
        speaker.speak(f"The time is {time}")

    if "What is your name".lower() in query.lower():
        speaker.speak("My name is Cosmo")

    # Stop running Cosmo by speaking "Stop running Cosmo"
    if "Stop Running Cosmo".lower() in query.lower():
        speaker.speak("Goodbyee!")
        print("Stopped Cosmo")
        exit()

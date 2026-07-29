# Desktop Assistant (Cosmo)

## Overview

**Cosmo** is a Python-powered desktop virtual assistant that responds to **voice inputs** and provides **voice outputs**. It performs multiple functions to enhance productivity, including:

- **Opening websites** with simple voice commands.
- **Launching Spotify** via URI protocol.
- **Telling current time**.
- **Introducing itself** upon request.

---

## Features

- 🎙️ **Voice Commands** – Natural speech interaction using Google Speech API.  
- 🌐 **Website Launcher** – Instant access to YouTube, Google, GitHub, Maps, etc.   
- ⏰ **Time Announcer** – Announces system time.  
- 🤖 **Voice Feedback** – SAPI5 / `pyttsx3` text-to-speech engine.  

---

## Prerequisites

- **Python 3.8+**
- Active internet connection (for Google Speech API).

---

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/lakshay-108/cosmo.git
   cd cosmo
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the assistant:
   ```bash
   python main.py
   ```

---

## Usage Examples

Run `python main.py` and speak any of the following commands:
- `"Open Google"`
- `"Open YouTube"`
- `"Open Spotify"`
- `"Tell me the time"`
- `"What is your name?"`
- `"Stop running Cosmo"` or `"exit"`

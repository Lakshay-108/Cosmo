# 🤖 COSMO — AI Desktop Assistant & UI

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Gemini AI](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%20API-ffaa00.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**COSMO** is a smart virtual desktop assistant featuring an intuitive Graphical User Interface (GUI). Built with Python and powered by the Google Gemini API, COSMO combines voice and text interactions with desktop automation to give you a smooth, interactive desktop experience.

---

## ✨ What's New

- 🎨 **Modern Graphical Interface:** Upgraded from CLI to a responsive, user-friendly UI for effortless interaction.
- ⚡ **Direct API Integration:** Powered by Google's Gemini API for low-latency AI responses.

---

## ✨ Features

- 🖥️ **Interactive Desktop UI:** Real-time visual feedback for voice commands, text prompts, and system actions.
- 🎙️ **Voice & Text Controls:** Hands-free voice operation paired with seamless text input.
- 🧠 **Google Gemini API Engine:** Fast, dynamic AI responses to general queries, summaries, and complex prompts.
- 🌐 **Web & App Automation:** Direct shortcuts and launch triggers for popular web services (YouTube, GitHub, Spotify, Google Maps, Zomato).
- 🔊 **Text-To-Speech Feedback:** Dynamic cross-platform audio responses via `pyttsx3`.

---


## 📋 Prerequisites

- **Python 3.8+**
- Active microphone (for voice interactions)
- **Google Gemini API Key** ([Get your API Key](https://aistudio.google.com/))

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Lakshay-108/Cosmo.git
cd Cosmo
```

### 2. Create a Virtual Environment

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows:**
```cmd
python -m venv .venv
.venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Your API Key
Copy `.env.example` to create your `.env` file:
```bash
cp .env.example .env
```
Open `.env` and paste your Gemini API key:
```ini
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

---

## 🚀 Usage

Launch the GUI Assistant:

```bash
python main.py
```

---

## 🗣️ Voice & Action Shortcuts

| Command / Input | Action Performed |
| :--- | :--- |
| `"Open YouTube"` | Launches YouTube in default browser |
| `"Open Spotify"` | Opens Spotify desktop or web player |
| `"Open GitHub"` | Navigates directly to GitHub |
| `"Tell me the time"` | Speaks and displays the system clock |
| *General Queries* | Processed via Gemini API and displayed in the UI |
| `"Exit"` / `"Quit"` | Safely closes COSMO |

---

## 📁 Repository Structure

```text
Cosmo/
├── main.py            # Primary application & UI launcher
├── requirements.txt   # Dependencies (GUI libraries, Gemini API SDK, TTS)
├── .env.example       # Template for API credentials
├── assets/            # UI icons, images, and visual assets
└── README.md          # Documentation
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

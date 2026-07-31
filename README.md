# 🤖 COSMO — Command Line AI Desktop Assistant

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Gemini AI](https://img.shields.io/badge/AI%20Engine-Google%20Gemini-ffaa00.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**COSMO** is a lightweight, command-line virtual desktop assistant built with Python. It supports voice & text inputs, text-to-speech feedback, system commands, website navigation, and Google Gemini AI responses.

---

## ✨ Features

- 🎙️ **Voice & Text Input**: Control Cosmo using natural voice commands or interactive terminal text fallback.
- 🧠 **Google Gemini AI Engine**: Integrated with `google-genai` for smart AI answers to general queries.
- 🌐 **Web & System Command Protocols**: Instantly open popular sites (YouTube, GitHub, Spotify, Google Maps, Zomato, etc.).
- 🔊 **Voice Feedback**: Cross-platform Text-To-Speech (`pyttsx3` / SAPI5).
- 💻 **CLI Native**: Extremely lightweight without browser overhead.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Lakshay-108/Cosmo.git
cd Cosmo
```

### 2. Set Up Virtual Environment (Recommended)
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Gemini API Key (Optional)
Copy `.env.example` to `.env` and add your Google Gemini API key:
```bash
cp .env.example .env
```
Inside `.env`:
```ini
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

---

## 🚀 Usage

Run the CLI assistant:
```bash
python3 main.py
```

---

## 🗣️ Supported Commands

| Input Command | Action Executed |
| :--- | :--- |
| `"Open YouTube"` | Launches YouTube in your default browser |
| `"Open Spotify"` | Opens Spotify desktop app or URI protocol |
| `"Open GitHub"` | Navigates to GitHub |
| `"Tell me the time"` | Announces system time |
| `"What is your name"` | Identifies as Cosmo CLI assistant |
| Any general prompt | Queries Google Gemini AI |
| `"exit"` or `"quit"` | Exits Cosmo |

---

## 📁 Repository Structure

```
Cosmo/
├── main.py             # CLI voice & text assistant script
├── requirements.txt    # Python dependencies list
├── .env.example        # Environment variables template
└── README.md           # Documentation
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

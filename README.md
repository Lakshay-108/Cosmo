# 🤖 COSMO — Futuristic 3D AI Droid Companion & Desktop Assistant

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Flask Server](https://img.shields.io/badge/backend-Flask-00f0ff.svg)](https://flask.palletsprojects.com/)
[![Three.js WebGL](https://img.shields.io/badge/3D%20Engine-Three.js-7000ff.svg)](https://threejs.org/)
[![Gemini AI](https://img.shields.io/badge/AI%20Engine-Google%20Gemini-ffaa00.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**COSMO** is an interactive, voice-controlled **Futuristic 3D AI Droid Companion** built with Python (Flask backend), WebGL (Three.js 3D viewport), and Google's Gemini AI. Cosmo features a 3D cybernetic droid model with real-time speech kinematics, dynamic lighting, voice recognition, and web browser protocol triggers.

---

## ✨ Features

- 🤖 **Interactive 3D WebGL Droid**: Full Three.js 3D cybernetic droid with dynamic lighting, glowing arc core, and real-time arm gesture kinematics when speaking.
- 🧠 **Google Gemini AI Integration**: Powered by Google GenAI (`google-genai`), automatically resolving supported Gemini models dynamically.
- 🎙️ **Speech Recognition & Voice Synthesis**: Hands-free voice recognition via Web Speech API and customizable browser Speech Synthesis.
- 🌐 **Web & System Command Protocols**: Instantly open popular sites (YouTube, GitHub, Spotify, Google Maps, Zomato, etc.) via voice or text terminal input.
- 💻 **Cross-Platform Compatibility**: Fully compatible with Linux, macOS, and Windows.

---

## 🛠️ Installation & Quickstart

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

### 4. Configure Gemini API Key (Optional but Recommended)
Copy `.env.example` to `.env` and add your Google Gemini API key:
```bash
cp .env.example .env
```
Inside `.env`:
```ini
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

---

## 🚀 Running Cosmo

### Option A: Web 3D HUD Interface (Recommended)
Run the Flask server and open the 3D WebGL interface in your browser:
```bash
python3 server.py
```
Open your browser and navigate to: **[http://localhost:5000](http://localhost:5000)**

### Option B: Native Terminal / CLI Voice Mode
Run the native Python desktop script:
```bash
python3 main.py
```

---

## 🗣️ Supported Commands & Triggers

| Voice / Text Input | Action Executed |
| :--- | :--- |
| `"Open YouTube"` | Launches YouTube in your default browser |
| `"Open Spotify"` | Opens Spotify desktop app or URI protocol |
| `"Open GitHub"` | Navigates to GitHub |
| `"What is the time"` | Announces system time |
| `"What is your name"` | Identifies as Cosmo AI Droid |
| Any general question | Queries Google Gemini AI for smart response |

---

## 📁 Repository Structure

```
Cosmo/
├── server.py           # Flask server & Gemini API integration backend
├── main.py             # Native CLI voice assistant script
├── requirements.txt    # Python dependencies list
├── .env.example        # Environment variables template
├── README.md           # Project documentation
└── web/                # WebGL 3D HUD Frontend
    ├── index.html      # Outer HUD & Canvas container
    ├── style.css       # Sci-fi dark cybernetic styling
    └── app.js          # Three.js 3D Engine, Speech API, and API fetch
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

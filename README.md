# Desktop Assistant

## Overview

The **Desktop Assistant** is an AI-powered virtual assistant that responds to **voice inputs** and provides **voice outputs**, allowing users to interact naturally. It performs multiple functions to enhance productivity, including:

- **Opening websites** with a single command.
- **Launching Spotify** to play music.
- **Telling the current time** upon request.
- **Introducing itself** when asked.

This project is perfect for users looking for a hands-free, efficient way to navigate their desktop environment.

## Features

 **Voice Commands** – Interact effortlessly using speech.  
 **Website Launcher** – Opens predefined websites instantly.   
 **Time Announcer** – Tells you the current time.  
 **Personalized Name Response** – The assistant introduces itself.  

## Prerequisites

Ensure you have the following installed before running the project:

- **Python** (latest version recommended)
- **Required Python modules**:
  - `speech_recognition`
  - `os` (built-in, no installation needed)
  - `webbrowser` (built-in, no installation needed)
  - `pywin32` (for Windows automation)
  - `datetime` (built-in, no installation needed)

To install the necessary modules, run the following command:

```bash
pip install speechrecognition pywin32
```

## Installation

Follow these steps to set up the **Desktop Assistant**:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/desktop-assistant.git
   ```
2. Navigate to the project directory:
   ```bash
   cd desktop-assistant
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the assistant:
   ```bash
   python assistant.py
   ```

## Usage

1. Start the assistant by running the script.
2. Speak clearly to issue commands such as:
   - `"Open Google"`
   - `"Play Spotify"`
   - `"Tell me the time"`
   - `"What is your name?"`
3. The assistant will process your request and respond accordingly.

## Contributing

Want to help improve this project? You can contribute by:
- Suggesting features  
- Enhancing documentation 

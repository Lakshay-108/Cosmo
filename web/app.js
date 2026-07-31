// Global State
let recognition = null;
let isListening = false;
let isBackendListening = false;

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initSpeechRecognition();
});

// Live clock
function initClock() {
    const clockEl = document.getElementById('live-clock');
    const update = () => {
        if (!clockEl) return;
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    update();
    setInterval(update, 10000);
}

// Initialize Speech Recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn('Browser Web Speech API not supported. Server-side mic fallback will be used.');
        return;
    }

    try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            setAssistantState('Listening...', 'listening');
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (interimTranscript) {
                setAssistantState(`"${interimTranscript}"`, 'listening');
            }

            if (finalTranscript) {
                const cleanQuery = finalTranscript.trim();
                if (cleanQuery) {
                    addChatMessage(cleanQuery, 'user');
                    sendBackendCommand(cleanQuery);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                addChatMessage('Microphone permission blocked by browser. Switching to server microphone listener...', 'assistant');
                fallbackToBackendListen();
            } else if (event.error === 'network') {
                addChatMessage('Network speech error. Switching to server microphone listener...', 'assistant');
                fallbackToBackendListen();
            } else {
                setAssistantState('Ready', 'ready');
            }
        };

        recognition.onend = () => {
            if (isListening) {
                setAssistantState('Ready', 'ready');
                isListening = false;
            }
        };
    } catch (e) {
        console.error('Error initializing Web Speech API:', e);
    }
}

// Toggle voice recording
async function toggleVoiceRecognition() {
    if (isBackendListening) return;

    // Check browser speech recognition
    if (recognition) {
        try {
            // Explicitly request mic permission if needed
            if (!isListening) {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                recognition.start();
            } else {
                recognition.stop();
            }
            return;
        } catch (err) {
            console.warn('Browser mic permission rejected or failed:', err);
            addChatMessage('Browser mic permission issue. Attempting server microphone listener...', 'assistant');
            fallbackToBackendListen();
            return;
        }
    }

    // Fallback to backend Python microphone
    fallbackToBackendListen();
}

// Server-side Python Microphone listener fallback
async function fallbackToBackendListen() {
    if (isBackendListening) return;
    isBackendListening = true;
    setAssistantState('Listening (Server Mic)...', 'listening');

    try {
        const response = await fetch('/api/listen', { method: 'POST' });
        const data = await response.json();

        if (data.query) {
            addChatMessage(data.query, 'user');
            addChatMessage(data.speech, 'assistant');
            speakBrowser(data.speech);
        } else {
            addChatMessage('No voice input detected by server microphone.', 'assistant');
        }
    } catch (err) {
        console.error('Backend listen error:', err);
        addChatMessage('Could not reach backend microphone listener.', 'assistant');
    } finally {
        isBackendListening = false;
        setAssistantState('Ready', 'ready');
    }
}

// Set visual assistant state
function setAssistantState(text, stateClass = 'ready') {
    const statusEl = document.getElementById('sys-status');
    const hintEl = document.getElementById('voiceHint');
    const orbWrapper = document.getElementById('orbWrapper');
    const micBtn = document.getElementById('micBtn');

    if (statusEl) statusEl.textContent = text;
    if (hintEl) hintEl.textContent = text.startsWith('Listening') ? text : 'Click or speak to Cosmo';

    if (orbWrapper) {
        orbWrapper.classList.remove('listening');
        if (stateClass === 'listening') orbWrapper.classList.add('listening');
    }

    if (micBtn) {
        micBtn.classList.remove('active');
        if (stateClass === 'listening') micBtn.classList.add('active');
    }
}

// Send text query to backend API
async function sendBackendCommand(query) {
    setAssistantState('Thinking...', 'thinking');
    try {
        const response = await fetch('/api/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        const data = await response.json();

        addChatMessage(data.speech, 'assistant');
        speakBrowser(data.speech);
    } catch (err) {
        addChatMessage('Error connecting to Cosmo server.', 'assistant');
    } finally {
        setAssistantState('Ready', 'ready');
    }
}

function sendQuickCommand(cmd) {
    addChatMessage(cmd, 'user');
    sendBackendCommand(cmd);
}

function submitTextInput() {
    const inputEl = document.getElementById('cmdInput');
    const val = inputEl.value.trim();
    if (val) {
        addChatMessage(val, 'user');
        sendBackendCommand(val);
        inputEl.value = '';
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        submitTextInput();
    }
}

// Append chat message to UI
function addChatMessage(text, sender = 'assistant') {
    const feed = document.getElementById('chatFeed');
    if (!feed) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text;

    msgDiv.appendChild(bubble);
    feed.appendChild(msgDiv);
    feed.scrollTop = feed.scrollHeight;
}

// Browser TTS
function speakBrowser(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

// Global state
let recognition = null;
let isListening = false;
let audioCtx = null;

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initArcCanvas();
    initRadarCanvas();
    initWaveformCanvas();
    initSpeechRecognition();
    initTelemetrySimulation();
});

// Live clock updating
function initClock() {
    const clockEl = document.getElementById('live-clock');
    setInterval(() => {
        const now = new Date();
        clockEl.textContent = now.toTimeString().split(' ')[0];
    }, 1000);
}

// ----------------------------------------------------
// Arc Reactor Canvas Animation Engine
// ----------------------------------------------------
function initArcCanvas() {
    const canvas = document.getElementById('arcCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let angle1 = 0;
    let angle2 = 0;
    let angle3 = 0;

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f3ff';

        // Outer Ring 1
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle1);
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 10, 5, 10]);
        ctx.beginPath();
        ctx.arc(0, 0, 190, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Outer Ring 2 (Counter rotation)
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-angle2);
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 3;
        ctx.setLineDash([40, 20, 10, 20]);
        ctx.beginPath();
        ctx.arc(0, 0, 160, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Inner Segment Ring
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle3);
        ctx.strokeStyle = 'rgba(0, 102, 255, 0.7)';
        ctx.lineWidth = 6;
        ctx.setLineDash([60, 30]);
        ctx.beginPath();
        ctx.arc(0, 0, 120, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Inner Pulsing Core
        ctx.save();
        ctx.translate(centerX, centerY);
        const pulseRadius = 70 + Math.sin(angle1 * 3) * 5;
        const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, pulseRadius);
        grad.addColorStop(0, 'rgba(0, 243, 255, 0.9)');
        grad.addColorStop(0.6, 'rgba(0, 102, 255, 0.4)');
        grad.addColorStop(1, 'rgba(0, 243, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Update rotation angles
        angle1 += 0.005;
        angle2 += 0.01;
        angle3 += 0.015;

        requestAnimationFrame(render);
    }

    render();
}

// ----------------------------------------------------
// Radar Canvas Sweep Engine
// ----------------------------------------------------
function initRadarCanvas() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    let sweepAngle = 0;

    function render() {
        ctx.clearRect(0, 0, w, h);

        // Radar background grid
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
        ctx.lineWidth = 1;

        ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, 90, 0, Math.PI * 2); ctx.stroke();

        ctx.beginPath(); ctx.moveTo(cx - 95, cy); ctx.lineTo(cx + 95, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - 95); ctx.lineTo(cx, cy + 95); ctx.stroke();

        // Radar sweep line
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sweepAngle);

        const grad = ctx.createConicGradient(0, 0, 0);
        grad.addColorStop(0, 'rgba(0, 243, 255, 0.4)');
        grad.addColorStop(0.2, 'rgba(0, 243, 255, 0)');
        grad.addColorStop(1, 'rgba(0, 243, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, 90, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(90, 0);
        ctx.stroke();

        ctx.restore();

        sweepAngle += 0.03;
        requestAnimationFrame(render);
    }
    render();
}

// ----------------------------------------------------
// Waveform Canvas Visualizer
// ----------------------------------------------------
function initWaveformCanvas() {
    const canvas = document.getElementById('waveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = isListening ? '#ff2a5f' : '#00f3ff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = isListening ? '#ff2a5f' : '#00f3ff';

        ctx.beginPath();
        const amplitude = isListening ? 20 : 6;
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin(x * 0.03 + phase) * amplitude * Math.sin(x * 0.006);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        phase += isListening ? 0.15 : 0.05;
        requestAnimationFrame(render);
    }
    render();
}

// ----------------------------------------------------
// Speech Recognition (Web Speech API)
// ----------------------------------------------------
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        logConsole('[WARNING] Web Speech API not supported in this browser. Use text input.');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isListening = true;
        playSynthSound('start');
        document.getElementById('micBtn').classList.add('active');
        document.getElementById('micHint').textContent = 'LISTENING... SPEAK NOW';
        document.getElementById('core-state').textContent = 'LISTENING';
        document.getElementById('core-subtext').textContent = 'PROCESSING AUDIO INPUT';
        logConsole('[VOICE] Microphone listening engaged...');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        logConsole(`[USER VOICE] "${transcript}"`, 'user');
        sendBackendCommand(transcript);
    };

    recognition.onerror = (event) => {
        logConsole(`[SPEECH ERROR] ${event.error}`, 'sys');
        resetMicState();
    };

    recognition.onend = () => {
        resetMicState();
    };
}

function toggleVoiceRecognition() {
    if (!recognition) {
        alert('Web Speech API is not supported on this browser. Please type commands below.');
        return;
    }
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function resetMicState() {
    isListening = false;
    document.getElementById('micBtn').classList.remove('active');
    document.getElementById('micHint').textContent = 'CLICK MIC TO SPEAK';
    document.getElementById('core-state').textContent = 'ONLINE';
    document.getElementById('core-subtext').textContent = 'AWAITING VOICE COMMAND';
}

// ----------------------------------------------------
// Send Command to Backend API
// ----------------------------------------------------
async function sendBackendCommand(query) {
    playSynthSound('process');
    try {
        const response = await fetch('/api/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        const data = await response.json();

        // Update Speech Box and Console
        document.getElementById('speechBox').textContent = `"${data.speech}"`;
        logConsole(`[COSMO] ${data.speech}`, 'bot');
        speakBrowser(data.speech);
        playSynthSound('success');
    } catch (err) {
        logConsole(`[BACKEND ERROR] ${err.message}`, 'sys');
    }
}

function sendQuickCommand(cmd) {
    logConsole(`[QUICK TRIGGER] "${cmd}"`, 'user');
    sendBackendCommand(cmd);
}

function submitTextInput() {
    const inputEl = document.getElementById('cmdInput');
    const val = inputEl.value.trim();
    if (val) {
        logConsole(`[TEXT INPUT] "${val}"`, 'user');
        sendBackendCommand(val);
        inputEl.value = '';
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        submitTextInput();
    }
}

// Console Logger
function logConsole(msg, type = 'sys') {
    const logEl = document.getElementById('consoleLog');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = msg;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}

// Telemetry stats simulator
function initTelemetrySimulation() {
    setInterval(() => {
        const cpu = (95 + Math.random() * 4.9).toFixed(1);
        const ram = (4.1 + Math.random() * 0.4).toFixed(1);
        document.getElementById('cpu-val').textContent = `${cpu}%`;
        document.getElementById('cpu-bar').style.width = `${cpu}%`;
        document.getElementById('ram-val').textContent = `${ram} / 16 GB`;
        document.getElementById('ram-bar').style.width = `${(ram / 16) * 100}%`;
    }, 2000);
}

// Browser TTS Speech Synthesis
function speakBrowser(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

// Web Audio API Sci-Fi Sound Synthesizer
function playSynthSound(type) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'start') {
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
        }
    } catch (e) {
        // Ignore audio context errors if blocked by browser policy
    }
}

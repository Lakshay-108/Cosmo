// Global variables
let scene, camera, renderer;
let cosmoGroup, headGroup, leftArm, rightArm, eyeVisorMesh, chestCoreMesh;
let recognition = null;
let isListening = false;
let isSpeakingGestures = false;
let synthVoices = [];

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initThreeJS();
    initSpeechRecognition();
    initTelemetrySimulation();
    initVoices();
});

function initVoices() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            synthVoices = window.speechSynthesis.getVoices();
        };
        synthVoices = window.speechSynthesis.getVoices();
    }
}

function initClock() {
    const clockEl = document.getElementById('live-clock');
    setInterval(() => {
        const now = new Date();
        clockEl.textContent = now.toTimeString().split(' ')[0];
    }, 1000);
}

// ----------------------------------------------------
// REALISTIC 3D THREE.JS ENGINE (COSMO CYBERNETIC DROID)
// ----------------------------------------------------
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // 1. Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    // 2. Camera setup - Centered directly on Cosmo in middle of screen
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.8, 5.5);

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Futuristic Cybernetic Lighting
    const ambientLight = new THREE.AmbientLight(0x0b2545, 1.5);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainKeyLight.position.set(5, 10, 7);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const cyanRimLight = new THREE.PointLight(0x00f0ff, 4.0, 15);
    cyanRimLight.position.set(-5, 3, 2);
    scene.add(cyanRimLight);

    const purpleFillLight = new THREE.PointLight(0x7000ff, 3.0, 15);
    purpleFillLight.position.set(5, -2, -3);
    scene.add(purpleFillLight);

    // 5. Grid Platform Environment
    buildCyberGridPlatform();

    // 6. Build High-Detail Realistic 3D Cosmo Droid
    build3DCosmoDroid();

    // Resize listener
    window.addEventListener('resize', onWindowResize, false);

    // Animation Loop
    animate();
}

function buildCyberGridPlatform() {
    // Cyber Floor Grid
    const gridHelper = new THREE.GridHelper(60, 60, 0x00f0ff, 0x112244);
    gridHelper.position.y = -1.65;
    scene.add(gridHelper);

    // Ambient floating particles
    const particleCount = 400;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 40;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.08, transparent: true, opacity: 0.6 });
    const pMesh = new THREE.Points(pGeom, pMat);
    scene.add(pMesh);
}

function build3DCosmoDroid() {
    cosmoGroup = new THREE.Group();

    // High-Gloss Metallic Materials
    const darkArmorMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 2.0
    });

    const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.95,
        roughness: 0.1
    });

    const jointMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.8,
        roughness: 0.5
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    // 1. HEAD & VISOR
    headGroup = new THREE.Group();

    const helmetGeom = new THREE.CylinderGeometry(0.24, 0.22, 0.38, 32);
    const helmet = new THREE.Mesh(helmetGeom, darkArmorMat);
    helmet.castShadow = true;
    headGroup.add(helmet);

    // Curved Glowing Cyan Visor
    const visorGeom = new THREE.BoxGeometry(0.36, 0.1, 0.08);
    eyeVisorMesh = new THREE.Mesh(visorGeom, cyanGlowMat);
    eyeVisorMesh.position.set(0, 0.05, 0.2);
    headGroup.add(eyeVisorMesh);

    // Ear Plates
    const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), chromeMat);
    earL.rotation.z = Math.PI / 2;
    earL.position.set(-0.25, 0.05, 0);
    headGroup.add(earL);

    const earR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), chromeMat);
    earR.rotation.z = Math.PI / 2;
    earR.position.set(0.25, 0.05, 0);
    headGroup.add(earR);

    headGroup.position.set(0, 1.48, 0);
    cosmoGroup.add(headGroup);

    // 2. TORSO & POWER CORE
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.15, 16), jointMat);
    neck.position.set(0, 1.22, 0);
    cosmoGroup.add(neck);

    // Sleek Chest Plate
    const chestGeom = new THREE.BoxGeometry(0.74, 0.65, 0.4);
    const chest = new THREE.Mesh(chestGeom, darkArmorMat);
    chest.position.set(0, 0.82, 0);
    chest.castShadow = true;
    cosmoGroup.add(chest);

    // Center Arc Power Core
    const coreGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 32);
    chestCoreMesh = new THREE.Mesh(coreGeom, cyanGlowMat);
    chestCoreMesh.rotation.x = Math.PI / 2;
    chestCoreMesh.position.set(0, 0.85, 0.21);
    cosmoGroup.add(chestCoreMesh);

    // Abdomen Midsection
    const abdomenGeom = new THREE.CylinderGeometry(0.28, 0.32, 0.38, 24);
    const abdomen = new THREE.Mesh(abdomenGeom, jointMat);
    abdomen.position.y = 0.35;
    cosmoGroup.add(abdomen);

    // Pelvis Unit
    const pelvisGeom = new THREE.BoxGeometry(0.62, 0.25, 0.36);
    const pelvis = new THREE.Mesh(pelvisGeom, darkArmorMat);
    pelvis.position.y = 0.05;
    cosmoGroup.add(pelvis);

    // 3. ARMS (Articulated for Speech Gestures)
    // LEFT ARM
    leftArm = new THREE.Group();
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), chromeMat);
    leftArm.add(shoulderL);

    const bicepL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.55, 16), darkArmorMat);
    bicepL.position.y = -0.3;
    leftArm.add(bicepL);

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 16), darkArmorMat);
    forearmL.position.y = -0.75;
    leftArm.add(forearmL);

    const handL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.16, 0.12), chromeMat);
    handL.position.y = -1.05;
    leftArm.add(handL);

    leftArm.position.set(-0.46, 1.05, 0);
    cosmoGroup.add(leftArm);

    // RIGHT ARM
    rightArm = new THREE.Group();
    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), chromeMat);
    rightArm.add(shoulderR);

    const bicepR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.55, 16), darkArmorMat);
    bicepR.position.y = -0.3;
    rightArm.add(bicepR);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 16), darkArmorMat);
    forearmR.position.y = -0.75;
    rightArm.add(forearmR);

    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.16, 0.12), chromeMat);
    handR.position.y = -1.05;
    rightArm.add(handR);

    rightArm.position.set(0.46, 1.05, 0);
    cosmoGroup.add(rightArm);

    // 4. LEGS & FEET
    const legLength = 1.1;

    const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, legLength * 0.5, 16), darkArmorMat);
    thighL.position.set(-0.2, -0.3, 0);
    thighL.castShadow = true;
    cosmoGroup.add(thighL);

    const shinL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, legLength * 0.5, 16), chromeMat);
    shinL.position.set(-0.2, -0.9, 0);
    shinL.castShadow = true;
    cosmoGroup.add(shinL);

    const footL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.38), darkArmorMat);
    footL.position.set(-0.2, -1.2, 0.08);
    footL.receiveShadow = true;
    cosmoGroup.add(footL);

    const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, legLength * 0.5, 16), darkArmorMat);
    thighR.position.set(0.2, -0.3, 0);
    thighR.castShadow = true;
    cosmoGroup.add(thighR);

    const shinR = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, legLength * 0.5, 16), chromeMat);
    shinR.position.set(0.2, -0.9, 0);
    shinR.castShadow = true;
    cosmoGroup.add(shinR);

    const footR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.38), darkArmorMat);
    footR.position.set(0.2, -1.2, 0.08);
    footR.receiveShadow = true;
    cosmoGroup.add(footR);

    cosmoGroup.position.set(0, -0.35, 0);
    scene.add(cosmoGroup);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ----------------------------------------------------
// ANIMATION LOOP (Cosmo Droid Gestures & Core Pulse)
// ----------------------------------------------------
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Natural Stance Breathing Motion
    if (cosmoGroup && headGroup) {
        headGroup.rotation.y = Math.sin(t * 0.6) * 0.06;
        headGroup.rotation.x = Math.sin(t * 0.4) * 0.02;
    }

    // Dynamic Arm Gestures when Speaking
    if (isSpeakingGestures && leftArm && rightArm) {
        leftArm.rotation.z = Math.sin(t * 3.5) * 0.25 + 0.35;
        leftArm.rotation.x = Math.cos(t * 3.0) * 0.35 - 0.2;

        rightArm.rotation.z = -Math.sin(t * 3.8) * 0.25 - 0.35;
        rightArm.rotation.x = Math.sin(t * 3.2) * 0.35 - 0.2;
    } else if (leftArm && rightArm) {
        leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.12, 0.08);
        leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0, 0.08);

        rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -0.12, 0.08);
        rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, 0.08);
    }

    renderer.render(scene, camera);
}

function triggerCosmoGestures(durationMs = 4000) {
    isSpeakingGestures = true;
    setTimeout(() => {
        isSpeakingGestures = false;
    }, durationMs);
}

// ----------------------------------------------------
// Speech Recognition (Web Speech API)
// ----------------------------------------------------
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        logConsole('[WARNING] Web Speech API not supported in browser. Use text input.');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isListening = true;
        triggerCosmoGestures(3000);
        document.getElementById('micBtn').classList.add('active');
        document.getElementById('micHint').textContent = 'COSMO LISTENING... SPEAK NOW';
        document.getElementById('core-state').textContent = 'COSMO LISTENING';
        document.getElementById('core-subtext').textContent = 'PROCESSING NEURAL SIGNAL';

        logConsole('[VOICE] Cosmo neural audio sensors engaged...');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        logConsole(`[USER TRANSMISSION] "${transcript}"`, 'user');
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
        alert('Web Speech API is not supported on this browser. Please type commands in the text bar.');
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
    document.getElementById('micHint').textContent = 'COMMUNICATE WITH COSMO';
    document.getElementById('core-state').textContent = 'COSMO AI DROID';
    document.getElementById('core-subtext').textContent = '3D FUTURISTIC CYBORG DROID';
}

// ----------------------------------------------------
// Send Command to Backend API
// ----------------------------------------------------
async function sendBackendCommand(query) {
    triggerCosmoGestures(5000);

    try {
        const response = await fetch('/api/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        const data = await response.json();

        logConsole(`[COSMO] ${data.speech}`, 'bot');
        speakCosmoVoice(data.speech);
        triggerCosmoGestures(5000);
    } catch (err) {
        logConsole(`[BACKEND ERROR] ${err.message}`, 'sys');
    }
}

function sendQuickCommand(cmd) {
    logConsole(`[QUICK PROTOCOL] "${cmd}"`, 'user');
    sendBackendCommand(cmd);
}

function submitTextInput() {
    const inputEl = document.getElementById('cmdInput');
    const val = inputEl.value.trim();
    if (val) {
        logConsole(`[TEXT COMMAND] "${val}"`, 'user');
        sendBackendCommand(val);
        inputEl.value = '';
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        submitTextInput();
    }
}

// Cosmo Voice Synthesis Engine
function speakCosmoVoice(text) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick crisp English voice
    const preferredVoice = synthVoices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
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

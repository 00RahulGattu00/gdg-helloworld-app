// Enhanced Hello World App with Multiple Features

// App state
const appState = {
    greetings: [
        "Hello World!",
        "Welcome to JavaScript!",
        "Greetings, Developer!",
        "Hi there, Coder!",
        "Salutations, Programmer!"
    ],
    currentGreetingIndex: 0,
    clickCount: 0,
    soundEnabled: true,
    autoCycleActive: false,
    autoCycleInterval: null,
    currentAnimation: 'fade'
};

// DOM Elements
let elements = {};

// Sound effects (using Web Audio API for compatibility)
const playSound = (frequency = 440, duration = 200) => {
    if (!appState.soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        console.log('Audio not supported');
    }
};

// Animation functions
const animateText = (element, animation) => {
    // Remove any existing animation classes
    element.className = element.className.replace(/\b\w*-animation\b/g, '');
    
    switch (animation) {
        case 'slide':
            element.classList.add('slide-animation');
            break;
        case 'bounce':
            element.classList.add('bounce-animation');
            break;
        case 'zoom':
            element.classList.add('zoom-animation');
            break;
        case 'fade':
        default:
            element.classList.add('fade-animation');
            break;
    }
};

// Theme switching
const setTheme = (theme) => {
    document.body.className = theme === 'gradient' ? '' : `${theme}-theme`;
    
    // Update active theme button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
};

// Text changing function
const changeText = () => {
    appState.currentGreetingIndex = (appState.currentGreetingIndex + 1) % appState.greetings.length;
    appState.clickCount++;
    
    // Play sound
    playSound(523, 150); // C note
    
    // Apply animation and update text
    const greetingElement = elements.greeting;
    
    // For fade animation, use opacity transition
    if (appState.currentAnimation === 'fade') {
        greetingElement.style.opacity = '0';
        setTimeout(() => {
            greetingElement.textContent = appState.greetings[appState.currentGreetingIndex];
            greetingElement.style.opacity = '1';
        }, 150);
    } else {
        greetingElement.textContent = appState.greetings[appState.currentGreetingIndex];
        animateText(greetingElement, appState.currentAnimation);
    }
    
    // Update statistics
    updateStats();
    
    console.log(`Text changed to: ${appState.greetings[appState.currentGreetingIndex]}`);
};

// Auto-cycle functionality
const toggleAutoCycle = () => {
    if (appState.autoCycleActive) {
        clearInterval(appState.autoCycleInterval);
        appState.autoCycleActive = false;
        elements.autoCycleBtn.textContent = 'Auto Cycle: OFF';
        elements.autoCycleBtn.classList.remove('active');
    } else {
        appState.autoCycleInterval = setInterval(changeText, 2000);
        appState.autoCycleActive = true;
        elements.autoCycleBtn.textContent = 'Auto Cycle: ON';
        elements.autoCycleBtn.classList.add('active');
    }
    playSound(330, 100); // E note
};

// Add custom message
const addCustomMessage = () => {
    const input = elements.customMessageInput;
    const message = input.value.trim();
    
    if (message && !appState.greetings.includes(message)) {
        appState.greetings.push(message);
        input.value = '';
        updateStats();
        playSound(659, 150); // E high note
        
        // Show confirmation
        const originalText = elements.addMessageBtn.textContent;
        elements.addMessageBtn.textContent = 'Added!';
        setTimeout(() => {
            elements.addMessageBtn.textContent = originalText;
        }, 1000);
    }
};

// Toggle sound
const toggleSound = () => {
    appState.soundEnabled = !appState.soundEnabled;
    elements.soundToggleBtn.textContent = appState.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    elements.soundToggleBtn.classList.toggle('muted', !appState.soundEnabled);
    
    if (appState.soundEnabled) {
        playSound(440, 100);
    }
};

// Update statistics
const updateStats = () => {
    elements.clickCount.textContent = appState.clickCount;
    elements.messageCount.textContent = appState.greetings.length;
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM element references
    elements = {
        greeting: document.getElementById('greeting'),
        changeTextBtn: document.getElementById('changeTextBtn'),
        autoCycleBtn: document.getElementById('autoCycleBtn'),
        soundToggleBtn: document.getElementById('soundToggleBtn'),
        animationSelect: document.getElementById('animationSelect'),
        customMessageInput: document.getElementById('customMessageInput'),
        addMessageBtn: document.getElementById('addMessageBtn'),
        clickCount: document.getElementById('clickCount'),
        messageCount: document.getElementById('messageCount')
    };
    
    // Event listeners
    elements.changeTextBtn.addEventListener('click', changeText);
    elements.autoCycleBtn.addEventListener('click', toggleAutoCycle);
    elements.soundToggleBtn.addEventListener('click', toggleSound);
    elements.addMessageBtn.addEventListener('click', addCustomMessage);
    
    // Animation selector
    elements.animationSelect.addEventListener('change', (e) => {
        appState.currentAnimation = e.target.value;
        playSound(392, 100); // G note
    });
    
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setTheme(e.target.dataset.theme);
            playSound(294, 100); // D note
        });
    });
    
    // Custom message input - Enter key support
    elements.customMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomMessage();
        }
    });
    
    // Initialize statistics
    updateStats();
    
    // Welcome sound
    setTimeout(() => playSound(523, 200), 500);
    
    console.log('Enhanced Hello World app loaded successfully!');
    console.log('Features: Themes, Animations, Sounds, Auto-cycle, Custom messages, Statistics');
});
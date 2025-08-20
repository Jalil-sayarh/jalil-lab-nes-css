// Character data with personalities and quotes
const characters = {
    badr: {
        name: "BADR",
        title: "The Creative Designer",
        quotes: [
            "Why did the CSS box go to therapy? It had too many issues with its padding!",
            "I don't make websites, I craft digital experiences... with terrible puns!",
            "My designs are like my jokes - they grow on you... eventually.",
            "CSS is my canvas, and bad jokes are my paintbrush!",
            "I put the 'fun' in functional design!"
        ],
        color: "#ff6b6b"
    },
    jalil: {
        name: "JALIL",
        title: "The Problem Solver",
        quotes: [
            "Every bug is just an undocumented feature waiting to be discovered!",
            "I solve problems faster than I create new random ideas!",
            "Generosity is my superpower, randomness is my weakness!",
            "Logic is optional when you're feeling randomly generous!",
            "I help everyone, but my code choices... completely unpredictable!"
        ],
        color: "#74b9ff"
    }
};

// Sound effects (using Web Audio API for retro beeps)
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log("Web Audio API not supported");
        }
    }

    playBeep(frequency = 800, duration = 100, type = 'square') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    playSelect() {
        this.playBeep(1000, 150, 'square');
    }

    playHover() {
        this.playBeep(600, 80, 'square');
    }

    playStart() {
        // Play a sequence of beeps for the start sound
        this.playBeep(800, 100, 'square');
        setTimeout(() => this.playBeep(1000, 100, 'square'), 120);
        setTimeout(() => this.playBeep(1200, 200, 'square'), 240);
    }
}

const sounds = new SoundEffects();

// Background Music System
class BackgroundMusic {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentOscillators = [];
        this.masterGain = null;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.1; // Low volume for background
        } catch (e) {
            console.log("Background music not supported");
        }
    }

    // Simple melody inspired by Pokemon-style slice of life music
    async playBackgroundMusic() {
        if (!this.audioContext || this.isPlaying) return;
        
        this.isPlaying = true;
        
        // Simple pentatonic melody pattern (relaxing and nostalgic)
        const melody = [
            { note: 261.63, duration: 1000 }, // C4
            { note: 293.66, duration: 500 },  // D4
            { note: 329.63, duration: 500 },  // E4
            { note: 392.00, duration: 1000 }, // G4
            { note: 440.00, duration: 500 },  // A4
            { note: 392.00, duration: 500 },  // G4
            { note: 329.63, duration: 1000 }, // E4
            { note: 293.66, duration: 1000 }, // D4
            { note: 261.63, duration: 2000 }, // C4
        ];

        const playNote = (frequency, duration, startTime) => {
            const oscillator = this.audioContext.createOscillator();
            const noteGain = this.audioContext.createGain();
            
            oscillator.connect(noteGain);
            noteGain.connect(this.masterGain);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'square'; // Retro 8-bit sound
            
            // Envelope for softer attack/release
            noteGain.gain.setValueAtTime(0, startTime);
            noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
            noteGain.gain.linearRampToValueAtTime(0.2, startTime + duration * 0.001 - 0.1);
            noteGain.gain.linearRampToValueAtTime(0, startTime + duration * 0.001);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration * 0.001);
            
            return oscillator;
        };

        const playMelody = () => {
            if (!this.isPlaying) return;
            
            let currentTime = this.audioContext.currentTime;
            
            melody.forEach(({ note, duration }) => {
                playNote(note, duration, currentTime);
                currentTime += duration * 0.001;
            });
            
            // Loop the melody
            setTimeout(() => {
                if (this.isPlaying) playMelody();
            }, melody.reduce((sum, { duration }) => sum + duration, 0) + 2000);
        };

        playMelody();
    }

    stop() {
        this.isPlaying = false;
        this.currentOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { /* ignore */ }
        });
        this.currentOscillators = [];
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.playBackgroundMusic();
        }
        
        // Update button text
        const button = document.getElementById('musicToggle');
        if (button) {
            button.textContent = this.isPlaying ? '🎵 Music: ON' : '🔇 Music: OFF';
        }
    }
}

// Bouncing Characters Animation System
class BouncingCharacters {
    constructor() {
        this.characters = [];
        this.animationId = null;
        this.init();
    }

    init() {
        const characterElements = document.querySelectorAll('.bounce-character');
        
        characterElements.forEach((element, index) => {
            const character = {
                element: element,
                x: Math.random() * (window.innerWidth - 50),
                y: Math.random() * (window.innerHeight - 50),
                vx: (Math.random() - 0.5) * parseFloat(element.dataset.speed),
                vy: (Math.random() - 0.5) * parseFloat(element.dataset.speed),
                speed: parseFloat(element.dataset.speed),
                size: 32 // Approximate size of is-small icons
            };
            
            // Position the element
            element.style.left = character.x + 'px';
            element.style.top = character.y + 'px';
            
            this.characters.push(character);
        });
        
        this.startAnimation();
    }

    startAnimation() {
        const animate = () => {
            this.characters.forEach(char => {
                // Update position
                char.x += char.vx;
                char.y += char.vy;
                
                // Bounce off edges
                if (char.x <= 0 || char.x >= window.innerWidth - char.size) {
                    char.vx *= -1;
                    char.x = Math.max(0, Math.min(window.innerWidth - char.size, char.x));
                }
                
                if (char.y <= 0 || char.y >= window.innerHeight - char.size) {
                    char.vy *= -1;
                    char.y = Math.max(0, Math.min(window.innerHeight - char.size, char.y));
                }
                
                // Apply position
                char.element.style.left = char.x + 'px';
                char.element.style.top = char.y + 'px';
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    // Handle window resize
    handleResize() {
        this.characters.forEach(char => {
            // Keep characters within new bounds
            char.x = Math.min(char.x, window.innerWidth - char.size);
            char.y = Math.min(char.y, window.innerHeight - char.size);
        });
    }
}

// Initialize background systems
let backgroundMusic;
let bouncingCharacters;

// Dialog system for Pokemon-style introductions
class DialogSystem {
    constructor() {
        this.messages = [
            {
                speaker: "Jalil's Lab",
                text: "Hey there! Welcome to our little corner of the internet! 👋",
                emoji: "🎮"
            },
            {
                speaker: "Jalil's Lab", 
                text: "We were just sitting around being bored adults when suddenly...",
                emoji: "😴"
            },
            {
                speaker: "Jalil's Lab",
                text: "We remembered what it felt like to be 7 years old again! ✨",
                emoji: "👶"
            },
            {
                speaker: "Jalil's Lab",
                text: "So we decided to make something our younger selves would absolutely LOVE!",
                emoji: "💖"
            },
            {
                speaker: "Jalil's Lab",
                text: "A gameboy-inspired webpage using NES.css that's pure nostalgic fun! 🕹️",
                emoji: "🎮"
            },
            {
                speaker: "Jalil's Lab",
                text: "Choose your character and dive into our retro adventure! Ready? Let's go! 🚀",
                emoji: "✨"
            }
        ];
        this.currentMessage = 0;
        this.isTyping = false;
        this.typewriterSpeed = 50; // milliseconds per character
        this.currentTypeInterval = null; // Track current typing interval
        this.init();
    }

    init() {
        this.showDialog();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const continueButton = document.querySelector('.dialog-continue-btn');
        const overlay = document.getElementById('dialogOverlay');
        
        // Click to continue (prevent event bubbling)
        continueButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextMessage();
        });
        
        // Space bar or Enter to continue
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && this.isDialogVisible()) {
                e.preventDefault();
                this.nextMessage();
            }
        });

        // Click anywhere on dialog to continue (but not if clicking the continue button)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && !e.target.closest('.dialog-continue-btn')) {
                this.nextMessage();
            }
        });
    }

    isDialogVisible() {
        const overlay = document.getElementById('dialogOverlay');
        return overlay && !overlay.classList.contains('hidden') && overlay.style.display !== 'none';
    }

    showDialog() {
        const overlay = document.getElementById('dialogOverlay');
        overlay.style.display = 'block';
        overlay.classList.remove('hidden');
        this.displayMessage();
    }

    hideDialog() {
        const overlay = document.getElementById('dialogOverlay');
        overlay.classList.add('hidden');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }

    displayMessage() {
        console.log(`Displaying message ${this.currentMessage} of ${this.messages.length}`);
        
        if (this.currentMessage >= this.messages.length) {
            console.log('All messages displayed, hiding dialog');
            setTimeout(() => this.hideDialog(), 1000);
            return;
        }

        const message = this.messages[this.currentMessage];
        const dialogText = document.getElementById('dialogText');
        const dialogEmoji = document.querySelector('.dialog-emoji');
        const continueButton = document.querySelector('.dialog-continue-btn');

        console.log(`Message: "${message.text}"`);

        // Update emoji
        dialogEmoji.textContent = message.emoji;

        // Hide continue button while typing
        continueButton.style.opacity = '0';

        // Clear previous text and ensure clean state
        dialogText.textContent = '';
        dialogText.classList.add('typewriter');

        // Typewriter effect
        this.isTyping = true;
        this.typeMessage(message.text, dialogText, () => {
            this.isTyping = false;
            dialogText.classList.remove('typewriter');
            continueButton.style.opacity = '1';
            
            // Play a soft completion sound
            sounds.playBeep(800, 100, 'sine');
        });

        // Play dialog sound
        sounds.playBeep(600, 80, 'square');
    }

    typeMessage(text, element, callback) {
        // Clear any existing typing interval
        if (this.currentTypeInterval) {
            clearInterval(this.currentTypeInterval);
            this.currentTypeInterval = null;
        }

        // Process text to add line breaks at appropriate points
        const processedText = this.addLineBreaks(text, 45);
        
        let i = 0;
        element.innerHTML = ''; // Use innerHTML to support <br> tags
        
        this.currentTypeInterval = setInterval(() => {
            if (i < processedText.length) {
                // Handle <br> tags specially
                if (processedText.substr(i, 4) === '<br>') {
                    element.innerHTML += '<br>';
                    i += 4; // Skip the entire <br> tag
                } else {
                    element.innerHTML += processedText.charAt(i);
                    i++;
                }
                
                // Play typing sound occasionally (but not for <br> tags)
                if (i % 3 === 0 && processedText.charAt(i-1) !== '>') {
                    sounds.playBeep(400 + Math.random() * 200, 30, 'square');
                }
            } else {
                clearInterval(this.currentTypeInterval);
                this.currentTypeInterval = null;
                callback();
            }
        }, this.typewriterSpeed);
    }

    addLineBreaks(text, maxLength) {
        const words = text.split(' ');
        let currentLine = '';
        let result = '';
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            
            // If adding this word would exceed the max length, start a new line
            if (testLine.length > maxLength && currentLine.length > 0) {
                result += currentLine + '<br>';
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        // Add the last line
        result += currentLine;
        
        return result;
    }

    nextMessage() {
        console.log(`nextMessage called. Currently on message ${this.currentMessage}, isTyping: ${this.isTyping}`);
        
        if (this.isTyping) {
            console.log('Skipping typing animation');
            // Skip typing animation
            this.skipTyping();
            return;
        }

        sounds.playHover();
        this.currentMessage++;
        console.log(`Moving to message ${this.currentMessage}`);
        
        // Small delay before next message for better pacing
        setTimeout(() => {
            this.displayMessage();
        }, 200);
    }

    skipTyping() {
        // Clear the current typing interval
        if (this.currentTypeInterval) {
            clearInterval(this.currentTypeInterval);
            this.currentTypeInterval = null;
        }

        const message = this.messages[this.currentMessage];
        const dialogText = document.getElementById('dialogText');
        const continueButton = document.querySelector('.dialog-continue-btn');
        
        // Use the same line-break processing when skipping
        const processedText = this.addLineBreaks(message.text, 45);
        dialogText.innerHTML = processedText;
        dialogText.classList.remove('typewriter');
        continueButton.style.opacity = '1';
        this.isTyping = false;
        
        sounds.playBeep(800, 100, 'sine');
    }
}

// Character selection functionality
function selectCharacter(characterId) {
    const character = characters[characterId];
    const selectedDisplay = document.getElementById('selected-display');
    const selectedName = document.getElementById('selected-name');
    const selectedQuote = document.getElementById('selected-quote');
    const characterSelect = document.querySelector('.character-select');

    // Play select sound
    sounds.playSelect();

    // Hide character selection
    characterSelect.style.display = 'none';

    // Show selected character
    selectedDisplay.style.display = 'block';
    selectedName.textContent = `${character.name} - ${character.title}`;
    
    // Pick a random quote
    const randomQuote = character.quotes[Math.floor(Math.random() * character.quotes.length)];
    selectedQuote.textContent = `"${randomQuote}"`;

    // Apply character color theme
    selectedDisplay.style.borderColor = character.color;
    selectedDisplay.querySelector('.nes-container').style.borderColor = character.color;

    // Add some celebration effects
    createConfetti();
}

function resetSelection() {
    const selectedDisplay = document.getElementById('selected-display');
    const characterSelect = document.querySelector('.character-select');

    sounds.playHover();

    selectedDisplay.style.display = 'none';
    characterSelect.style.display = 'flex';
}

function startGame() {
    sounds.playStart();
    
    // Create a fun "game starting" effect
    const body = document.body;
    body.style.animation = 'fadeOut 2s ease-in-out';
    
    setTimeout(() => {
        alert('Adventure starting... 🎮\n\nWelcome to Jalil\'s Lab!\nYour character is ready for epic coding adventures!');
        body.style.animation = 'fadeIn 1s ease-in-out';
    }, 1000);
}

// Confetti effect for character selection
function createConfetti() {
    const colors = ['#ff6b6b', '#74b9ff', '#feca57', '#ff7675', '#fd79a8', '#6c5ce7'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 10}px) rotate(720deg)`, opacity: 0 }
            ], {
                duration: 3000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => confetti.remove();
        }, i * 50);
    }
}

// Initialize dialog system
let dialogSystem;

// Add hover sound effects to buttons and cards
document.addEventListener('DOMContentLoaded', () => {
    // Initialize background systems
    backgroundMusic = new BackgroundMusic();
    bouncingCharacters = new BouncingCharacters();
    
    // Initialize the dialog system
    dialogSystem = new DialogSystem();
    
    // Start background music after a short delay
    setTimeout(() => {
        backgroundMusic.playBackgroundMusic();
    }, 2000);
    // Add hover sounds to buttons
    const buttons = document.querySelectorAll('.nes-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => sounds.playHover());
    });

    // Add hover effects to character cards
    const cards = document.querySelectorAll('.character-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            sounds.playHover();
            card.style.filter = 'brightness(1.1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.filter = 'brightness(1)';
        });
    });

    // Add click sound to VS container for fun
    const vsContainer = document.querySelector('.vs-container');
    if (vsContainer) {
        vsContainer.addEventListener('click', () => {
            sounds.playBeep(400, 200, 'sawtooth');
            vsContainer.style.animation = 'none';
            setTimeout(() => {
                vsContainer.style.animation = 'vsRotate 4s linear infinite';
            }, 100);
        });
    }

    // Konami code easter egg
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        // Music toggle with 'M' key
        if (e.code === 'KeyM') {
            backgroundMusic.toggle();
            return;
        }
        
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Handle window resize for bouncing characters
    window.addEventListener('resize', () => {
        if (bouncingCharacters) {
            bouncingCharacters.handleResize();
        }
    });
});

function activateEasterEgg() {
    sounds.playStart();
    
    // Create a fun rainbow effect
    const body = document.body;
    const originalBackground = body.style.background;
    
    body.style.background = 'linear-gradient(45deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8800ff)';
    body.style.backgroundSize = '400% 400%';
    body.style.animation = 'gradientShift 0.5s ease infinite';
    
    // Show easter egg message
    const easterEgg = document.createElement('div');
    easterEgg.innerHTML = `
        <div class="nes-container is-rounded" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; text-align: center; background: rgba(255,255,255,0.95);">
            <h2 class="nes-text is-success">🎉 KONAMI CODE ACTIVATED! 🎉</h2>
            <p class="nes-text">You unlocked the rainbow mode!</p>
            <button class="nes-btn is-primary" onclick="this.parentElement.parentElement.remove(); document.body.style.background = '${originalBackground}'; document.body.style.animation = 'gradientShift 8s ease infinite';">Cool!</button>
        </div>
    `;
    document.body.appendChild(easterEgg);
    
    // Create extra confetti
    createConfetti();
    setTimeout(createConfetti, 500);
}

// Add CSS for fade effects
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0.3; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0.3; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let fireworkSoundBuffer = null;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawBuildings() {
    const buildingMaxWidth = 100;
    const buildingMinHeight = 100;
    const buildingMaxHeight = 350;
    let currentX = 0;

    while (currentX < canvas.width) {
        const height = Math.random() * (buildingMaxHeight - buildingMinHeight) + buildingMinHeight;
        const width = Math.random() * (buildingMaxWidth - 50) + 50; // Vary building width
        const greyShade = Math.floor(Math.random() * 150) + 50; // Shades of grey (50-200)
        ctx.fillStyle = `rgb(${greyShade},${greyShade},${greyShade})`;
        ctx.fillRect(currentX, canvas.height - height, width, height);
        currentX += width + 5; // Add a small gap between buildings
    }
}

// Function to load the sound
async function loadSound(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        audioCtx.decodeAudioData(arrayBuffer, (buffer) => {
            fireworkSoundBuffer = buffer;
        }, (error) => {
            console.error('Error decoding audio data:', error);
        });
    } catch (error) {
        console.error('Error fetching sound:', error);
    }
}

// Function to play the sound
function playSound(buffer) {
    if (!buffer || audioCtx.state === 'suspended') return; // Don't play if buffer not loaded or audio context suspended
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
}

const fireworks = [];
const particles = [];

// Particle class for fireworks
class Particle {
    constructor(x, y, color, velocity, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.size = size; // Added size property
        this.gravity = 0.04; // Adjusted gravity for a more natural fall
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); // Use this.size
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.015; // Slightly faster fade out
        this.draw();
    }
}

// Firework class (the rocket)
class Firework {
    constructor(x, y, targetX, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.velocity = {
            x: (targetX - x) / 60, // Adjust speed by changing divisor
            y: (targetY - y) / 60  // Adjust speed by changing divisor
        };
        this.trail = [];
        this.trailLength = 5; // Length of the rocket trail
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.trail[this.trail.length -1]?.x || this.x, this.trail[this.trail.length -1]?.y || this.y);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3; // Make rocket trail thicker
        ctx.stroke();
    }

    update() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        if (this.y > this.targetY) { // Check if rocket reached target height
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.draw();
        } else {
            this.explode();
            return true; // Mark for removal
        }
        return false;
    }

    explode() {
        const particleCount = 150; // More particles for a bigger explosion
        const angleIncrement = (Math.PI * 2) / particleCount;
        for (let i = 0; i < particleCount; i++) {
            const speed = Math.random() * 6 + 2; // Increased speed for bigger spread
            // Make particles bigger - random size between 2 and 5
            const particleSize = Math.random() * 3 + 2; 
            particles.push(new Particle(
                this.x,
                this.y,
                `hsl(${Math.random() * 360}, 100%, 70%)`, // Brighter colors
                {
                    x: Math.cos(angleIncrement * i) * speed,
                    y: Math.sin(angleIncrement * i) * speed
                },
                particleSize // Pass the size to the particle
            ));
        }
        if (fireworkSoundBuffer) { // ADD THIS LINE
            playSound(fireworkSoundBuffer); // ADD THIS LINE
        }
    }
}

function launchFirework() {
    const startX = Math.random() * canvas.width / 2 + canvas.width / 4; // Launch from middle half
    const startY = canvas.height;
    const targetX = startX;
    const targetY = Math.random() * canvas.height / 2 + 50; // Explode in upper half
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    fireworks.push(new Firework(startX, startY, targetX, targetY, color));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Slower fade for trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBuildings(); // Redraw buildings each frame

    // Update and draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        if (fireworks[i].update()) {
            fireworks.splice(i, 1); // Remove exploded fireworks
        }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        } else {
            particles[i].update();
        }
    }
}

function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBuildings();
    // No need to call animate() here, it's called by requestAnimationFrame
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // No need to call init() here, animate will handle redraws.
    // If buildings need to be recalculated on resize, call drawBuildings() or a specific setup function.
});

// init(); // Call init once to draw initial buildings - Not needed as animate calls drawBuildings
animate(); // Start the animation loop

setInterval(launchFirework, 2000); // Launch a new firework every 2 seconds

// Load the sound when the script initializes
// loadSound('https://www.soundjay.com/buttons/sounds/button-09.mp3');

// It's good practice to resume AudioContext on a user gesture if it's suspended
// For this example, we'll try to resume it once.
// You might want to add a button or interaction for a more robust solution.
if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
        console.log('AudioContext resumed.');
        // Load the sound after resuming context
        loadSound('https://www.soundjay.com/buttons/sounds/button-09.mp3');
    }).catch(e => console.error('Error resuming AudioContext:', e));
} else {
    // Load the sound if context is already running
    loadSound('https://www.soundjay.com/buttons/sounds/button-09.mp3');
}

// Also, ensure the user can interact to enable audio if autoplay is blocked.
// A simple way (though not always perfectly effective due to browser policies):
document.body.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}, { once: true });

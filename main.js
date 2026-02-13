// --- Elements ---
const menuToggle = document.getElementById('menu-toggle');
const settingsPanel = document.getElementById('settings-panel');
const colorPicker = document.getElementById('color-picker');
const speedSlider = document.getElementById('speed-slider');
const glowSlider = document.getElementById('glow-slider');
const thickSlider = document.getElementById('thick-slider');
const resetBtn = document.getElementById('reset-btn');

// --- Menu Interaction ---
menuToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

// --- Core Update Function ---
function applyDragonCustoms() {
    if (typeof ctx !== 'undefined') {
        ctx.strokeStyle = colorPicker.value;
        ctx.shadowColor = colorPicker.value;
        ctx.shadowBlur = parseInt(glowSlider.value);
        ctx.lineWidth = parseInt(thickSlider.value);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }
    
    if (typeof critter !== 'undefined') {
        critter.fAccel = parseInt(speedSlider.value);
        critter.rAccel = 1.8; // Instant direction change
        critter.fRes = 0.15;  // Low air resistance for snappy feel
    }
}

// Sliders event listener
[colorPicker, speedSlider, glowSlider, thickSlider].forEach(el => {
    el.addEventListener('input', applyDragonCustoms);
});

// Reset Function
resetBtn.addEventListener('click', () => {
    colorPicker.value = "#ff0000";
    speedSlider.value = 60;
    glowSlider.value = 30;
    thickSlider.value = 4;
    applyDragonCustoms();
});

// --- Turbo Touch/Drag Logic ---
const turboMode = () => {
    if (typeof critter !== 'undefined') {
        critter.fAccel = 400; // Extreme speed on touch
        critter.fRes = 0.05;
        ctx.shadowColor = "#ffffff"; // Glowing white mixed during turbo
        ctx.shadowBlur = 50;
    }
};

const normalMode = () => applyDragonCustoms();

canvas.addEventListener('mousedown', turboMode);
canvas.addEventListener('mouseup', normalMode);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); turboMode(); });
canvas.addEventListener('touchend', normalMode);

// Background white glow effect dots
function drawAmbientGlow() {
    if (typeof ctx !== 'undefined') {
        ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Load initialization
window.onload = () => {
    applyDragonCustoms();
    setInterval(drawAmbientGlow, 40); // Constant white glow mix
};


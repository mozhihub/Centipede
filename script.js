const menuToggle = document.getElementById('menu-toggle');
const settingsPanel = document.getElementById('settings-panel');
const speedSlider = document.getElementById('speed-slider');

menuToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

// Setup visuals for the Dragon Objects
function applyVisuals() {
    // Objects - Solid Red with Neon Glow
    ctx.strokeStyle = "#ff0000"; 
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 25;
    ctx.lineWidth = 3;
    
    // Glowing White Mix in the Background (Ambient)
    ctx.globalCompositeOperation = 'lighter'; 
}

// Speed & Direction Logic - Instant Response
function setInstantPhysics(accel, resistance, rotationSpeed) {
    if (typeof critter !== 'undefined') {
        critter.fAccel = accel;      // Forward Speed
        critter.fRes = resistance;   // Drag (Lower means faster stop/start)
        critter.rAccel = 2.0;        // Instant direction change (Original was 0.5)
        critter.rRes = 0.1;          // Rotation resistance koraichachu
    }
}

// Turbo mode on Touch/Drag
const startTurbo = () => {
    // Accel 250 - Rocket speed
    // Resistance 0.01 - Milli-second reaction
    setInstantPhysics(250, 0.01); 
    ctx.shadowColor = "#ffffff"; // Touch pannum pothu white glow mix aagum
    ctx.shadowBlur = 40;
};

const stopTurbo = () => {
    setInstantPhysics(30, 0.5);
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 25;
};

// Events
canvas.addEventListener('mousedown', startTurbo);
canvas.addEventListener('mouseup', stopTurbo);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startTurbo(); });
canvas.addEventListener('touchend', stopTurbo);

// Frame Loop to keep Background Gradient & White Glow Mix
function drawBackgroundGlow() {
    // Ithu background-la white mixed glowing particles maari theriyum
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();
}

// Original script-oda draw loop-kulla ithai pugutha mudiyaathulthaal, 
// interval-ah override seigirom
window.onload = () => {
    applyVisuals();
    setInstantPhysics(30, 0.5);
    
    // Adding extra glow every frame
    setInterval(drawBackgroundGlow, 50);
};

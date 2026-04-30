const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Game Configuration ---
let score = 0;
let gameActive = true;
const gravity = 3; // How fast leads fall
let leads = [];
let frames = 0;

// --- Assets ---
const staffHeads = []; // Array of staff head image objects
const bodyM = new Image(); bodyM.src = 'assets/body_m.png';
const bodyF = new Image(); bodyF.src = 'assets/body_f.png';
const leadImg = new Image(); leadImg.src = 'assets/lead_icon.png';

// Player Object
const player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 120,
    width: 80,
    height: 100,
    gender: 'm', // Toggle based on selected staff member
    head: null    // Current staff head image
};

// --- Controls ---
window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left - player.width / 2;
});

// --- Game Functions ---
function spawnLead() {
    leads.push({
        x: Math.random() * (canvas.width - 30),
        y: -50,
        size: 40
    });
}

function update() {
    if (!gameActive) return;

    frames++;
    if (frames % 60 === 0) spawnLead(); // Spawn every 60 frames

    leads.forEach((lead, index) => {
        lead.y += gravity;

        // Collision Detection
        if (
            lead.x < player.x + player.width &&
            lead.x + lead.size > player.x &&
            lead.y < player.y + player.height &&
            lead.y + lead.size > player.y
        ) {
            score += 10;
            leads.splice(index, 1);
        }

        // Game Over if lead hits the floor (Optional: or just miss points)
        if (lead.y > canvas.height) {
            leads.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Player Body
    const currentBody = player.gender === 'm' ? bodyM : bodyF;
    ctx.drawImage(currentBody, player.x, player.y, player.width, player.height);

    // 2. Draw Player Head (Layered on top)
    if (player.head) {
        ctx.drawImage(player.head, player.x + 15, player.y - 30, 50, 50);
    }

    // 3. Draw Leads
    leads.forEach(lead => {
        ctx.drawImage(leadImg, lead.x, lead.y, lead.size, lead.size);
    });

    // 4. Draw Score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Leads Caught: ${score}`, 20, 30);

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

// Start Game
draw();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "user.png";

const dildoImg = new Image(); dildoImg.src = "dildo.png";
const burgerImg = new Image(); burgerImg.src = "burger.png";
const pizzaImg = new Image(); pizzaImg.src = "pizza.png";
const friesImg = new Image(); friesImg.src = "fries.png";
const hotdogImg = new Image(); hotdogImg.src = "hotdog.png";

const fallingItems = [
    { img: dildoImg, type: "dildo" },
    { img: burgerImg, type: "food" },
    { img: pizzaImg, type: "food" },
    { img: friesImg, type: "food" },
    { img: hotdogImg, type: "food" }
];

// Bigger player
const player = {
    x: 150,
    y: 500,
    width: 100,
    height: 100,
    speed: 7
};

let dildos = [];
let score = 0;
let lives = 3;
let keys = {};
let gameOver = false;

// Wait for all images to load
let imagesLoaded = 0;
[playerImg, dildoImg, burgerImg, pizzaImg, friesImg, hotdogImg].forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 6) loop();
    };
});

function spawnItem() {
    const x = Math.random() * (canvas.width - 70);
    const item = fallingItems[Math.floor(Math.random() * fallingItems.length)];
    dildos.push({
        x,
        y: -70,
        width: 70,
        height: 70,
        speed: 2 + Math.random() * 1.5,
        img: item.img,
        type: item.type
    });
}

function update() {
    if (gameOver) return;

    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    for (let i = dildos.length - 1; i >= 0; i--) {
        const d = dildos[i];
        d.y += d.speed;

        if (
            d.x < player.x + player.width &&
            d.x + d.width > player.x &&
            d.y < player.y + player.height &&
            d.y + d.height > player.y
        ) {
            if (d.type === "food") {
                score++;
            } else if (d.type === "dildo") {
                lives--;
                if (lives <= 0) gameOver = true;
            }
            dildos.splice(i, 1);
        } else if (d.y > canvas.height) {
            dildos.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    dildos.forEach(d => ctx.drawImage(d.img, d.x, d.y, d.width, d.height));

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillText("Lives: " + lives, 10, 60);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", 70, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Press R to Restart", 110, canvas.height / 2 + 40);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function restartGame() {
    score = 0;
    lives = 3;
    dildos = [];
    gameOver = false;
}

window.addEventListener("keydown", function (e) {
    keys[e.key] = true;
    if (gameOver && e.key.toLowerCase() === "r") restartGame();
});
window.addEventListener("keyup", e => keys[e.key] = false);

setInterval(() => {
    if (!gameOver) spawnItem();
}, 1000);

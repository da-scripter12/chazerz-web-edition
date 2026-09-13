// project variables
console.log("this may or may not be a game");

const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");

// player variables
let x = 100;
let y = 100;
let speed = 10;
let radius = 30;

// score variables
let score = 0;
let touchFrames = 0;

// controls
let keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

// resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Keep player onscreen after resizing
    x = Math.max(radius, Math.min(x, canvas.width - radius));
    y = Math.max(radius, Math.min(y, canvas.height - radius));

    // Keep balloon onscreen after resizing
    balloon.x = Math.max(0, Math.min(balloon.x, canvas.width - balloon.width));
    balloon.y = Math.max(0, Math.min(balloon.y, canvas.height - balloon.height));
}

window.addEventListener("resize", resizeCanvas);

// balloon
let balloon = {
    x: 300,
    y: 200,
    speedX: 2,
    speedY: 2,
    width: 60,
    height: 80
};

let balloonImage = new Image();

balloonImage.onload = function () {
    console.log("BALLOON LOADED");
};

balloonImage.onerror = function () {
    console.log("BALLOON FAILED TO LOAD");
};

balloonImage.src = "balloon.png";

resizeCanvas();

// game loop
function gameLoop() {

    // player movement
    if (keys["ArrowUp"]) y -= speed;
    if (keys["ArrowDown"]) y += speed;
    if (keys["ArrowLeft"]) x -= speed;
    if (keys["ArrowRight"]) x += speed;

    // player boundary
    x = Math.max(radius, Math.min(x, canvas.width - radius));
    y = Math.max(radius, Math.min(y, canvas.height - radius));

    // balloon movement
    balloon.x += balloon.speedX;
    balloon.y += balloon.speedY;

    // random wandering
    balloon.speedX += (Math.random() - 0.5) * 0.2;
    balloon.speedY += (Math.random() - 0.5) * 0.2;

    // limit balloon speed
    balloon.speedX = Math.max(-4, Math.min(balloon.speedX, 4));
    balloon.speedY = Math.max(-4, Math.min(balloon.speedY, 4));

    // balloon boundaries
    if (balloon.x <= 0) {
        balloon.x = 0;
        balloon.speedX *= -1;
    }

    if (balloon.x + balloon.width >= canvas.width) {
        balloon.x = canvas.width - balloon.width;
        balloon.speedX *= -1;
    }

    if (balloon.y <= 0) {
        balloon.y = 0;
        balloon.speedY *= -1;
    }

    if (balloon.y + balloon.height >= canvas.height) {
        balloon.y = canvas.height - balloon.height;
        balloon.speedY *= -1;
    }

    // collision detection
    let distance = Math.hypot(
        x - (balloon.x + balloon.width / 2),
        y - (balloon.y + balloon.height / 2)
    );

    let touchingBalloon = distance < radius + 30;

    // score
    if (touchingBalloon) {
        touchFrames++;

        // ~6 animation frames = ~100ms at 60 FPS
        if (touchFrames >= 6) {
            score++;
            touchFrames = 0;
        }
    } else {
        touchFrames = 0;
    }

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw player
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();

    // draw balloon
    ctx.drawImage(
        balloonImage,
        balloon.x,
        balloon.y,
        balloon.width,
        balloon.height
    );

    // draw score
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 20, 40);

    requestAnimationFrame(gameLoop);
}

gameLoop();
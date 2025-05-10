let currentScore = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gamePaused = false;
let canvas = document.getElementById("pingpong-game");
let ctx = canvas.getContext("2d");

// Izmēri
canvas.width = 800;
canvas.height = 400;

// Ping pong spēles objekti
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 2,
    dy: 2,
};

let paddleLeft = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 4
};

let paddleRight = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 4
};

// Vairogs AI labajā pusē
let paddleRightY = canvas.height / 2 - 50;
let paddleSpeed = 6;

// Spēles funkcionalitātes
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddles() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(paddleLeft.x, paddleLeft.y, paddleLeft.width, paddleLeft.height);
    ctx.fillRect(paddleRight.x, paddleRightY, paddleRight.width, paddleRight.height);
}

function drawScores() {
    document.getElementById("current-score").textContent = currentScore;
    document.getElementById("high-score").textContent = highScore;
}

function moveBall() {
    if (!gamePaused) {
        ball.x += ball.dx;
        ball.y += ball.dy;
    }
}

function collisionDetection() {
    // Augšējā un apakšējā siena
    if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    }
    
    // Labās un kreisās malas
    if (ball.x + ball.dx > canvas.width - ball.radius) {
        currentScore++;
        if (currentScore > highScore) {
            highScore = currentScore;
            localStorage.setItem("highScore", highScore);
        }
        resetBall();
    }

    if (ball.x + ball.dx < ball.radius) {
        currentScore++;
        if (currentScore > highScore) {
            highScore = currentScore;
            localStorage.setItem("highScore", highScore);
        }
        resetBall();
    }

    // Paddle kolīzijas
    if (ball.x - ball.radius < paddleLeft.x + paddleLeft.width && ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.height) {
        ball.dx = -ball.dx;
    }

    if (ball.x + ball.radius > paddleRight.x && ball.y > paddleRightY && ball.y < paddleRightY + paddleRight.height) {
        ball.dx = -ball.dx;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 2;
    ball.dy = 2;
}

// AI kustība (sekot bumbai)
function moveAI() {
    if (ball.y < paddleRightY + paddleRight.height / 2) {
        paddleRightY -= paddleSpeed;
    } else if (ball.y > paddleRightY + paddleRight.height / 2) {
        paddleRightY += paddleSpeed;
    }

    paddleRightY = Math.max(0, Math.min(paddleRightY, canvas.height - paddleRight.height));
}

// Kontroles
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        gamePaused = !gamePaused;
    }

    if (e.key === "ArrowUp") {
        paddleLeft.y = Math.max(paddleLeft.y - paddleSpeed, 0);
    }

    if (e.key === "ArrowDown") {
        paddleLeft.y = Math.min(paddleLeft.y + paddleSpeed, canvas.height - paddleLeft.height);
    }
});

// Peles kustība
document.addEventListener("mousemove", (e) => {
    paddleLeft.y = e.clientY - canvas.offsetTop - paddleLeft.height / 2;
    paddleLeft.y = Math.max(0, Math.min(paddleLeft.y, canvas.height - paddleLeft.height)); // Ierobežojam kustību
});

// Spēles loģika
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddles();
    moveBall();
    collisionDetection();
    moveAI(); // AI kustība, lai sekotu bumbai
    drawScores();

    if (!gamePaused) {
        requestAnimationFrame(gameLoop);
    }
}

// Sākt spēli
document.getElementById("start-btn").addEventListener("click", () => {
    currentScore = 0;
    gamePaused = false;
    gameLoop();
});

// Pauzēt spēli
document.getElementById("pause-btn").addEventListener("click", () => {
    gamePaused = !gamePaused;
});

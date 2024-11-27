// Get the canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Set the dimensions of the canvas
canvas.width = 800;
canvas.height = 600;

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 5; // Speed at which the paddles move

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;
const maxBallSpeed = 8; // Maximum speed for the ball

// Score properties
let playerScore = 0;
let aiScore = 0;

// Game state
let gameRunning = true;
let gameOver = false;
let flashText = true;
let flashTimer = 0;

// Key press handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Reset game function
function resetGame() {
    playerScore = 0;
    aiScore = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 3;
    ballSpeedY = 3;
    gameOver = false;
}

// Game over screen logic
function drawGameOverScreen() {
    ctx.fillStyle = 'red';
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);

    if (flashText) {
        ctx.font = '30px Arial';
        ctx.fillText('Press Space to Play Again', canvas.width / 2, canvas.height / 2 + 30);
    }
}

// Paddle movement logic
function movePaddles() {
    // Player paddle movement
    if (keys['ArrowUp'] && playerY > 0) {
        playerY -= paddleSpeed;
    }
    if (keys['ArrowDown'] && playerY < canvas.height - paddleHeight) {
        playerY += paddleSpeed;
    }

    // AI paddle movement
    const aiPaddleCenter = aiY + paddleHeight / 2;
    if (aiPaddleCenter < ballY - 30 && aiY < canvas.height - paddleHeight) {
        aiY += paddleSpeed;
    } else if (aiPaddleCenter > ballY + 30 && aiY > 0) {
        aiY -= paddleSpeed;
    }
}

// Ball movement logic
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY <= 10 || ballY >= canvas.height - 10) {
        ballSpeedY *= -1;
    }

    // Paddle collision
    const playerPaddleRight = paddleWidth;
    const aiPaddleLeft = canvas.width - paddleWidth;

    if (
        ballX <= playerPaddleRight &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX *= -1.05; // Increase speed on collision
        ballSpeedY += (ballY - (playerY + paddleHeight / 2)) * 0.1;
    } else if (
        ballX >= aiPaddleLeft &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballSpeedX *= -1.05; // Increase speed on collision
        ballSpeedY += (ballY - (aiY + paddleHeight / 2)) * 0.1;
    }

    // Scoring
    if (ballX <= 0) {
        aiScore++;
        resetBall();
    } else if (ballX >= canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Reset ball position and speed after scoring
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1; // Reverse the direction of the ball
    ballSpeedY *= Math.random() * 3 - 1.5; // Randomize the Y speed

    // Reset ball speed to initial values if game over
    if (playerScore >= 3 || aiScore >= 3) {
        gameOver = true;
        gameRunning = false;
    }
}

// Drawing logic
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        // Draw paddles
        ctx.fillStyle = 'white';
        ctx.fillRect(0, playerY, paddleWidth, paddleHeight); // Player paddle
        ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight); // AI paddle

        // Draw ball
        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Draw scores
        ctx.font = '30px Arial';
        ctx.fillText(playerScore, canvas.width / 4, 50);
        ctx.fillText(aiScore, (canvas.width * 3) / 4, 50);
    } else {
        drawGameOverScreen();
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) {
        // Flash the "Press Space to Play Again" text
        flashTimer++;
        if (flashTimer % 15 === 0) {
            flashText = !flashText;
        }

        // Check for spacebar press to restart game
        if (keys[' ']) {
            resetGame();
            gameRunning = true;
        }
    } else {
        movePaddles();
        moveBall();
    }

    draw();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

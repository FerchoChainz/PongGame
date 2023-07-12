const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleWidth = 18,
    paddleHeight = 120,
    paddleSpeed = 8,
    ballRadius = 12,
    initialBallSpeed = 8,
    maxBallSpeed = 40,
    netWidth = 5,
    netColor = "WHITE";

// Dibujar net en el canva
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
    }
}

// Dibujar rectangulo 
function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// Dibujar el circulo
function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Setear texto en canva
function drawText(text, x, y, color, fontSize = 60, fontWeight = 'bold', font = "Courier New") {
    context.fillStyle = color;
    context.font = `${fontWeight} ${fontSize}px ${font}`;
    context.textAlign = "center";
    context.fillText(text, x, y);
}

// crear el paddle
function createPaddle(x, y, width, height, color) {
    return { x, y, width, height, color, score: 0 };
}

// Crear la pelota
function createBall(x, y, radius, velocityX, velocityY, color) {
    return { x, y, radius, velocityX, velocityY, color, speed: initialBallSpeed };
}

// Definir el usuario y la com
const user = createPaddle(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

const com = createPaddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

// Definir el objeto de la pelota
const ball = createBall(canvas.width / 2, canvas.height / 2, ballRadius, initialBallSpeed, initialBallSpeed, "WHITE");

// actualizar el paddle con el movimiento del mouse
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(event) {
    const rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
}

// colision de el paddle y la pelota
function collision(b, p) {
    return (
        b.x + b.radius > p.x && b.x - b.radius < p.x + p.width && b.y + b.radius > p.y && b.y - b.radius < p.y + p.height
    );
}

// Reset de la velocidad y posicion
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
    ball.velocityX = -ball.velocityX;
    ball.speed = initialBallSpeed;
}

// Logica del juego 
function update() {
    // Score y reset de la pelota
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    // Actualizar posicion de la pelota
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // actializar el paddle de la computadora en base a la pelota
    com.y += (ball.y - (com.y + com.height / 2)) * 0.1;

    // paredes de arriba y abajo
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Determinar cual paddle ha sido golpeada por la pelota 
    let player = ball.x + ball.radius < canvas.width / 2 ? user : com;
    if (collision(ball, player)) {
        const collidePoint = ball.y - (player.y + player.height / 2);
        const collisionAngle = (Math.PI / 4) * (collidePoint / (player.height / 2));
        const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(collisionAngle);
        ball.velocityY = ball.speed * Math.sin(collisionAngle);

        // Incrementar la velocidad de la pelota
        ball.speed += 0.2;
        if (ball.speed > maxBallSpeed) {
            ball.speed = maxBallSpeed;
        }
    }
}

// Render el juego en el canva
function render() {
    // limpiar el canva con una pantalla negra 
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    drawNet();

    // setear scores
    drawText(user.score, canvas.width / 4, canvas.height / 2, "GRAY", 120, 'bold');
    drawText(com.score, (3 * canvas.width) / 4, canvas.height / 2, "GRAY", 120, 'bold');

    // Dibujar paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Dibujar pelota
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

}


// Juego en loop
function gameLoop() {
    update();
    render();
}

// setear el juego en loop a 60fps
const framePerSec = 60;
setInterval(gameLoop, 1000 / framePerSec);
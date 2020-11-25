const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Player 1
const P1 = {
	x: canvas.width * 0.05,
	y: canvas.height / 2,
	w: 6,
	h: 100,
	speed: 5,
	move_up: 0,
	move_down: 0,
	color: 'blue'
}

drawPlayer = (player) => {
	ctx.fillStyle = player.color
	ctx.fillRect(player.x, player.y, player.w, player.h)
}

movePlayer = (player) => {
	if (player.move_up == 1 && player.y > 0)
		player.y -= player.speed
	if (player.move_down == 1 && player.y < (canvas.height - player.h))
		player.y += player.speed
}

keyDown = (key) => {
	if (key.key == 'ArrowUp')
		P1.move_up = 1
	if (key.key == 'ArrowDown')
		P1.move_down = 1
}


keyUp = (key) => {
	if (key.key == 'ArrowUp')
		P1.move_up = 0
	if (key.key == 'ArrowDown')
		P1.move_down = 0
}

const Ball = {
	x: 300,
	y: 300,
	size: 10,
	angle: 0,
	speed: 5,
	dx: 5,
	dy: 0,
	calcDir() {
		this.dx = Math.cos(this.angle) * this.speed;
		this.dy = Math.sin(this.angle) * this.speed;
	},
}

drawBall = () => {
	ctx.beginPath();
	ctx.arc(Ball.x, Ball.y, Ball.size, 0, Math.PI * 2);
	ctx.fillStyle = 'green';
	ctx.fill();
}

calculateBounceAngle = (player, ball) => {
	const playerMiddle = player.y + player.h / 2;
	const offset = - (playerMiddle - ball.y);
	// Multiplico Pi por 0,9 para evitar que rebote verticalmente de manera eterna
	const angleInc = (offset / (player.h / 2)) * (Math.PI * Math.PI / 3);
	ball.angle = ball.angle + angleInc;
	ball.calcDir();
//	ball.dx = Math.cos(newAngle) * ball.speed;
//	ball.dy = Math.sin(newAngle) * ball.speed;
}

moveBall = () => {
//	console.log("Ball x = "+Ball.y+" P1 x = "+P1.y);
	if (Ball.x + Ball.size >= canvas.width) {
		Ball.dx *= -1;
	}
	if (Ball.x - Ball.size <= 0) {
		Ball.x = canvas.width / 2;
		Ball.y = canvas.height / 2;
		Ball.angle = -Math.PI
		Ball.calcDir()
	}
	if (Ball.x - Ball.size <= P1.x + P1.w &&
		(Ball.y + Ball.size >= P1.y && Ball.y - Ball.size <= P1.y + P1.h)) {
		calculateBounceAngle(P1, Ball)
	
	}

	if (Ball.y + Ball.size <= P1.y && Ball.y + Ball.size >= (P1.y + P1.y))
		console.log("collision")
	if (Ball.y + Ball.size >= canvas.height || Ball.y - Ball.size <= 0)
		Ball.dy *= -1
	Ball.x += Ball.dx;
	Ball.y += Ball.dy;
}

drawLoop = () =>
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	moveBall();
	drawPlayer(P1);
	document.addEventListener('keydown', keyDown)
	document.addEventListener('keyup', keyUp)
	movePlayer(P1);
	requestAnimationFrame(drawLoop);
}

drawLoop()

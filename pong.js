const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Player 
class Player {
	constructor(x, color) {
		this.x = x
		this.color = color
	}
	y = canvas.height / 2
	w = 6
	h = 100
	speed = 5
	move_up = 0
	move_down = 0
}

const P1 = new Player(canvas.width * 0.05, 'blue');
const P2 = new Player(canvas.width * 0.95, 'red');

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
		P2.move_up = 1
	if (key.key == 'ArrowDown')
		P2.move_down = 1
	if (key.key == 'w')
		P1.move_up = 1
	if (key.key == 's')
		P1.move_down = 1
}


keyUp = (key) => {
	if (key.key == 'ArrowUp')
		P2.move_up = 0
	if (key.key == 'ArrowDown')
		P2.move_down = 0
	if (key.key == 'w')
		P1.move_up = 0
	if (key.key == 's')
		P1.move_down = 0
}

const Ball = {
	x: 300,
	y: 300,
	size: 10,
	angle: - 2 * Math.PI,
	speed: 5,
	dx: 5,
	dy: 0,
	calcDir() {
		if (this.angle > (2 * Math.PI))
			this.angle = this.angle % (2 * Math.PI);
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
	const playerMiddle = player.y + (player.h / 2);
	const offset = (playerMiddle - ball.y) / (player.h / 2);
	ball.angle = offset * (Math.PI * 0.833);
}

moveBall = () => {
	console.log("Ball angle = "+(Ball.angle * 57.29));
	if (Ball.x + Ball.size >= canvas.width || Ball.x - Ball.size <= 0) {
		Ball.angle = Math.PI - Ball.angle
	}
	if (Ball.x - Ball.size <= 0) {
		Ball.x = canvas.width / 2;
		Ball.y = canvas.height / 2;
		Ball.angle = -Math.PI
	}
	if (Ball.x - Ball.size <= P1.x &&
		(Ball.y >= P1.y && Ball.y <= P1.y + P1.h)) {
		calculateBounceAngle(P1, Ball)
	
	}
	if (Ball.y + Ball.size >= canvas.height || Ball.y <= 0)
		Ball.angle = 2 * Math.PI - Ball.angle
	Ball.calcDir()
	Ball.x += Ball.dx;
	Ball.y += Ball.dy;
}

const listen = () => {
	document.addEventListener('keydown', keyDown)
	document.addEventListener('keyup', keyUp)
}

drawLoop = () =>
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	moveBall();
	listen();
	drawPlayer(P1);
	drawPlayer(P2);
	listen();
	movePlayer(P1);
	movePlayer(P2);
	requestAnimationFrame(drawLoop);
}

drawLoop()

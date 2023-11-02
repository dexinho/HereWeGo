const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
    }

    draw = () => {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, 50, 50);
    };

    update = () => {
        for (const key in keysPressed) {
            if (
                key === "ArrowRight" &&
                keysPressed[key] &&
                this.position.x + this.velocity.x < canvas.width - 50
            )
                this.position.x += this.velocity.x;
            if (
                key === "ArrowLeft" &&
                keysPressed[key] &&
                this.position.x - this.velocity.x > 0
            )
                this.position.x += this.velocity.x * -1;
            if (
                key === "ArrowUp" &&
                keysPressed[key] &&
                this.position.y + this.velocity.y > 0
            )
                this.position.y += this.velocity.y * -1;
            if (
                key === "ArrowDown" &&
                keysPressed[key] &&
                this.position.y + this.velocity.y < canvas.height - 50
            )
                this.position.y += this.velocity.y;
        }

        this.draw();
    };
}

class Enemy {
    constructor({ id, size, position, velocity, color }) {
        this.id = id;
        this.size = size;
        this.position = position;
        this.velocity = velocity;
        this.color = color;
    }

    spawn = () => {
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        c.fillStyle = this.color;
        c.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    };
}

const player = new Player({
    position: {
        x: canvas.width / 2 - 25,
        y: canvas.height - 100,
    },
    velocity: {
        x: 1,
        y: 1,
    },
});

const ENEMIES = [];
let ENEMY_VELOCITY_X = 0;
let ENEMY_VELOCITY_Y = 1;
let ENEMY_SPAWN_SPEED = 500;
let ENEMY_ID = 1;

function enemySpawn(){
    const spawnInterval = setInterval(() => {
        const enemy = new Enemy({
            id: ENEMY_ID++,
            position: {
                x: Math.floor(Math.random() * canvas.width - 50),
                y: -50,
            },
            size: {
                width: Math.floor(Math.random() * 50) + 50,
                height: Math.floor(Math.random() * 50) + 50,
            },
            velocity: {
                x: ENEMY_VELOCITY_X * Math.floor(Math.random() * 3 - 1),
                y: ENEMY_VELOCITY_Y,
            },
            color: `rgb(${Math.floor(Math.random() * 200) + 56}, 
                ${Math.floor(Math.random() * 200 + 56)}, 
                ${Math.floor(Math.random() * 200 + 56)})`,
        });
    
        ENEMIES.push(enemy);

        console.log(ENEMY_SPAWN_SPEED)

        if (ENEMIES.length % 10 === 0) {
            ENEMY_SPAWN_SPEED -= 50
            clearInterval(spawnInterval)
            enemySpawn()
        }
    }, ENEMY_SPAWN_SPEED);
}

enemySpawn()

const enemyVelocityInterval = setInterval(() => {
    

    if (ENEMY_VELOCITY_Y < 5) {
        ENEMY_VELOCITY_Y++;
    }
    if (ENEMY_VELOCITY_X === 0) ENEMY_VELOCITY_X = 1;
}, 5000);

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    ENEMIES.forEach((enemy) => enemy.spawn());
}

const keysPressed = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false,
};

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") keysPressed.ArrowRight = true;
    else if (e.key === "ArrowLeft") keysPressed.ArrowLeft = true;
    else if (e.key === "ArrowUp") keysPressed.ArrowUp = true;
    else if (e.key === "ArrowDown") keysPressed.ArrowDown = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") keysPressed.ArrowRight = false;
    else if (e.key === "ArrowLeft") keysPressed.ArrowLeft = false;
    else if (e.key === "ArrowUp") keysPressed.ArrowUp = false;
    else if (e.key === "ArrowDown") keysPressed.ArrowDown = false;
});

animate();

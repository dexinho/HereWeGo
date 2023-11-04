const canvas = document.querySelector("canvas");
const CX = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
    }

    draw = () => {
        CX.fillStyle = "red";
        CX.fillRect(this.position.x, this.position.y, 50, 50);
    };

    update = () => {
        for (const key in keysPressed) {
            if (
                key === "arrowRight" &&
                keysPressed[key] &&
                this.position.x + this.velocity < canvas.width - 50
            )
                this.position.x += this.velocity;
            if (
                key === "arrowLeft" &&
                keysPressed[key] &&
                this.position.x - this.velocity >= 0
            )
                this.position.x += this.velocity * -1;
            if (
                key === "arrowUp" &&
                keysPressed[key] &&
                this.position.y + this.velocity >= 0
            )
                this.position.y += this.velocity * -1;
            if (
                key === "arrowDown" &&
                keysPressed[key] &&
                this.position.y + this.velocity <= canvas.height - 50
            )
                this.position.y += this.velocity;
        }

        this.draw();
    };


    get getVelocity() {
        return this.velocity;
    }

    set setVelocity(newValue) {
        this.velocity = newValue;
    }
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

        CX.fillStyle = this.color;
        CX.fillRect(
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
    velocity: 1,
});

const ENEMIES = [];
let ENEMY_VELOCITY_X = 0;
let ENEMY_VELOCITY_Y = 1;
let ENEMY_SPAWN_SPEED = 1000;
let OBSTACLE_ID = 1;

let SPAWN_INTERVAL = setInterval(enemySpawn, ENEMY_SPAWN_SPEED);

function updateInverval() {
    clearInterval(SPAWN_INTERVAL);
    SPAWN_INTERVAL = setInterval(enemySpawn, ENEMY_SPAWN_SPEED);
}

function enemySpawn() {
    const obstacle = new Enemy({
        id: OBSTACLE_ID++,
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

    console.log(ENEMY_SPAWN_SPEED);

    ENEMIES.push(obstacle);

    if (ENEMIES.length % 10 === 0) {
        ENEMY_SPAWN_SPEED -= 50;
        updateInverval();
    }
}

const enemyVelocityInterval = setInterval(() => {
    if (ENEMY_VELOCITY_Y < 5) {
        ENEMY_VELOCITY_Y++;

        player.setVelocity = ++player.getVelocity;
    }
    if (ENEMY_VELOCITY_X === 0) ENEMY_VELOCITY_X = 1;
}, ENEMY_SPAWN_SPEED * 10);

function animate() {
    window.requestAnimationFrame(animate);
    CX.fillStyle = "black";
    CX.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    ENEMIES.forEach((enemy) => enemy.spawn());
}

const keysPressed = {
    arrowRight: false,
    arrowLeft: false,
    arrowUp: false,
    arrowDown: false,
};

document.addEventListener("keydown", (e) => {
    if (e.key === "arrowRight") keysPressed.arrowRight = true;
    else if (e.key === "arrowLeft") keysPressed.arrowLeft = true;
    else if (e.key === "arrowUp") keysPressed.arrowUp = true;
    else if (e.key === "arrowDown") keysPressed.arrowDown = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "arrowRight") keysPressed.arrowRight = false;
    else if (e.key === "arrowLeft") keysPressed.arrowLeft = false;
    else if (e.key === "arrowUp") keysPressed.arrowUp = false;
    else if (e.key === "arrowDown") keysPressed.arrowDown = false;
});

animate();
const canvas = document.querySelector("canvas");
const CX = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 650;
CX.fillStyle = "black";
CX.fillRect(0, 0, canvas.width, canvas.height);

const highscoreCountDiv = document.querySelector("#highscore-count-div");
let HIGHSCORE = 0;

let PLAYER_WIDTH = 50;
let PLAYER_HEIGHT = 50;

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
    }

    draw = () => {
        CX.fillStyle = "red";
        CX.fillRect(
            this.position.x,
            this.position.y,
            PLAYER_WIDTH,
            PLAYER_HEIGHT
        );
    };

    update = () => {
        for (const key in keysPressed) {
            if (
                key === "ArrowRight" &&
                keysPressed[key] &&
                this.position.x + this.velocity < canvas.width - PLAYER_WIDTH
            )
                this.position.x += this.velocity;
            if (
                key === "ArrowLeft" &&
                keysPressed[key] &&
                this.position.x - this.velocity >= 0
            )
                this.position.x += this.velocity * -1;
            if (
                key === "ArrowUp" &&
                keysPressed[key] &&
                this.position.y + this.velocity >= 0
            )
                this.position.y += this.velocity * -1;
            if (
                key === "ArrowDown" &&
                keysPressed[key] &&
                this.position.y + this.velocity <= canvas.height - PLAYER_HEIGHT
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

    move = () => {
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
        x: (canvas.width - PLAYER_WIDTH) / 2,
        y: canvas.height - 100,
    },
    velocity: 1,
});

const OBSTACLES = [];
let ENEMY_VELOCITY_X = 0;
let ENEMY_VELOCITY_Y = 1;
let ENEMY_SPAWN_SPEED = 1000;
let OBSTACLE_ID = 1;

let SPAWN_INTERVAL;

function updateInverval() {
    clearInterval(SPAWN_INTERVAL);
    SPAWN_INTERVAL = setInterval(enemySpawn, ENEMY_SPAWN_SPEED);
}

function enemySpawn() {
    const obstacle = new Enemy({
        id: OBSTACLE_ID++,
        position: {
            x: Math.floor(Math.random() * (canvas.width - 150) + 50),
            y: -100,
        },
        size: {
            width: Math.floor(Math.random() * 50) + canvas.width / 10,
            height: Math.floor(Math.random() * 50) + canvas.height / 10,
        },
        velocity: {
            x: ENEMY_VELOCITY_X * Math.floor(Math.random() * 3 - 1),
            y: ENEMY_VELOCITY_Y,
        },
        color: `rgb(${Math.floor(Math.random() * 200) + 56}, 
            ${Math.floor(Math.random() * 200 + 56)}, 
            ${Math.floor(Math.random() * 200 + 56)})`,
    });

    OBSTACLES.unshift(obstacle);

    if (OBSTACLES.length % 5 === 0 && ENEMY_SPAWN_SPEED > 200) {
        ENEMY_SPAWN_SPEED -= 100;
        updateInverval();
    }
}

const checkForCollision = ({ posX, posY, width, height }) => {
    if (
        (posX + width === player.position.x &&
            posY + height === player.position.y) ||
        (posX === player.position.x + PLAYER_WIDTH &&
            posY === player.position.y + PLAYER_HEIGHT)
    ) {
        console.log("---------");
        console.log("collision");
    }
};

const checkIfOutOfBounds = ({ id, posX, posY, width }) => {
    let obstacleIndex = OBSTACLES.findIndex((obstacle) => obstacle.id === id);

    if (posY > canvas.height) {
        OBSTACLES.splice(obstacleIndex, 1);
        HIGHSCORE++;
    }

    if (posX + width > canvas.width || posX < 0) return -1;

    return 1;
};

const highscoreDiv = document.querySelector('#highscore-div')
const livesLeftDiv = document.querySelector('#lives-left-div')

const updateHighscore = () => {
    highscoreDiv.innerText = HIGHSCORE;
};

const enemyVelocityInterval = setInterval(() => {
    if (ENEMY_VELOCITY_Y < 6) {
        ENEMY_VELOCITY_Y++;
        player.setVelocity = ++player.getVelocity;
    }
    if (ENEMY_VELOCITY_Y === 4) ENEMY_VELOCITY_X = 3;
    if (ENEMY_VELOCITY_X === 0) ENEMY_VELOCITY_X = 1;
}, ENEMY_SPAWN_SPEED * 15);

function animate() {
    window.requestAnimationFrame(animate);
    CX.fillStyle = "black";
    CX.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    OBSTACLES.forEach((obstacle) => {
        obstacle.move();

        checkForCollision({
            posX: obstacle.position.x,
            posY: obstacle.position.y,
            width: obstacle.size.width,
            height: obstacle.size.height,
        });

        obstacle.velocity.x *= checkIfOutOfBounds({
            id: obstacle.id,
            posX: obstacle.position.x,
            posY: obstacle.position.y,
            width: obstacle.size.width,
        });
    });

    updateHighscore();
}

const keysPressed = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false,
};

function whichKeyIsPressed(key, down = true) {
    if (key === "ArrowRight") keysPressed[key] = down ? true : false;
    else if (key === "ArrowLeft") keysPressed[key] = down ? true : false;
    else if (key === "ArrowUp") keysPressed[key] = down ? true : false;
    else if (key === "ArrowDown") keysPressed[key] = down ? true : false;
}

document.addEventListener("keydown", (e) => whichKeyIsPressed(e.key));
document.addEventListener("keyup", (e) => whichKeyIsPressed(e.key, false));

const startBtns = document.querySelectorAll(".start-btns");
const mainMenuDiv = document.querySelector("#main-menu-div");
const nicknameDiv = document.querySelector('#nickname-div')
const nicknameInput = document.querySelector('#nickname-input')

startBtns.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.id === "normal-btn") {
            mainMenuDiv.style.display = "none";
            nicknameDiv.innerText = nicknameInput.value
            updateInverval();
            animate();
        }
    });
});

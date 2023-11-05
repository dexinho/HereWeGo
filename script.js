const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 650;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const icon = new Image();
icon.src = "/assets/transformers_icon_2.png";
icon.onload = () => {
    ctx.drawImage(icon, 400, 300, 50, 50);
};

const highscoreCountDiv = document.querySelector("#highscore-count-div");
let HIGHSCORE = 0;
let SURVIVED_TIME = 0;
let LIVES_LEFT = 0;

class Player {
    constructor({ position, velocity, size }) {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
    }

    draw = () => {
        console.log(icon.complete)
        ctx.drawImage(
            icon,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    };

    update = () => {
        for (const key in keysPressed) {
            if (
                key === "ArrowRight" &&
                keysPressed[key] &&
                this.position.x + this.velocity < canvas.width - this.size.width
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
                this.position.y + this.velocity <=
                    canvas.height - this.size.height
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

        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    };
}

const player = new Player({
    size: {
        width: 50,
        height: 50,
    },
    position: {
        x: (canvas.width - 50) / 2,
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

function updateSpawnInterval() {
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
        updateSpawnInterval();
    }
}

const changeHeartShape = () => {
    const faHeart = document.querySelectorAll(".fa-heart");

    for (let i = faHeart.length - 1; i >= 0; i--) {
        if (faHeart[i].classList.contains("fa-solid")) {
            faHeart[i].classList.remove("fa-solid");
            faHeart[i].classList.add("fa-regular");
            break;
        }
    }
};

const checkForCollision = ({ id, posX, posY, width, height }) => {
    const playerTop = player.position.y;
    const playerRight = player.position.x + player.size.width;
    const playerBottom = player.position.y + player.size.height;
    const playerLeft = player.position.x;

    const obstacleTop = posY;
    const obstacleRight = posX + width;
    const obstacleBottom = posY + height;
    const obstacleLeft = posX;

    if (
        playerTop < obstacleBottom &&
        playerRight > obstacleLeft &&
        playerBottom > obstacleTop &&
        playerLeft < obstacleRight
    ) {
        console.log("collision");
        removeObstacle(id);
        changeHeartShape();
        LIVES_LEFT--;
        return true;
    }

    return false;
};

const removeObstacle = (id) => {
    let obstacleIndex = OBSTACLES.findIndex((obstacle) => obstacle.id === id);
    OBSTACLES.splice(obstacleIndex, 1);
};

let TIMER_INTERVAL;
const startTimer = () => {
    TIMER_INTERVAL = setInterval(() => {
        SURVIVED_TIME++;
    }, 1000);
};

const stopTimer = () => {
    clearInterval(TIMER_INTERVAL);
};

const resetSettings = () => {
    player.setVelocity = 1;
    player.position.x = (canvas.width - 50) / 2;
    player.position.y = canvas.height - 100;
    ENEMY_VELOCITY_X = 0;
    ENEMY_VELOCITY_Y = 1;
    ENEMY_SPAWN_SPEED = 1000;
    OBSTACLE_ID = 1;
    HIGHSCORE = 0;
    SURVIVED_TIME = 0;
    OBSTACLES.length = 0;
};

const checkIfOutOfBounds = ({ id, posX, posY, width }) => {
    if (posY > canvas.height) {
        removeObstacle(id);
        HIGHSCORE++;
    }

    if (posX + width > canvas.width || posX < 0) return -1;

    return 1;
};

const highscoreDiv = document.querySelector("#highscore-div");
const livesLeftDiv = document.querySelector("#lives-left-div");

const createHearts = (quantity) => {
    livesLeftDiv.innerText = "";

    for (let i = 0; i < quantity; i++) {
        const heart = document.createElement("i");
        heart.classList.add("fa-solid");
        heart.classList.add("fa-heart");
        livesLeftDiv.appendChild(heart);
    }

    return quantity;
};

const updateHighscore = () => {
    highscoreDiv.innerText = HIGHSCORE;
};

let ENEMY_VELOCITY_INTERVAL;
const updateEnemeyVelocityInterval = () => {
    clearInterval(ENEMY_VELOCITY_INTERVAL);

    ENEMY_VELOCITY_INTERVAL = setInterval(() => {
        if (ENEMY_VELOCITY_Y < 6) {
            ENEMY_VELOCITY_Y++;
            player.setVelocity = ++player.getVelocity;
        }
        if (ENEMY_VELOCITY_Y === 4) ENEMY_VELOCITY_X = 3;
        if (ENEMY_VELOCITY_X === 0) ENEMY_VELOCITY_X = 1;
    }, ENEMY_SPAWN_SPEED * 15);
};

const endingDialogDiv = document.querySelector("#ending-div");

function animate() {
    const frame = window.requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    OBSTACLES.forEach((obstacle) => {
        obstacle.move();

        if (
            checkForCollision({
                id: obstacle.id,
                posX: obstacle.position.x,
                posY: obstacle.position.y,
                width: obstacle.size.width,
                height: obstacle.size.height,
            }) &&
            LIVES_LEFT === 0
        ) {
            window.cancelAnimationFrame(frame);
            endingDialogDiv.style.display = "flex";
            writeStats();
            stopTimer();
        }
        obstacle.velocity.x *= checkIfOutOfBounds({
            id: obstacle.id,
            posX: obstacle.position.x,
            posY: obstacle.position.y,
            width: obstacle.size.width,
        });
    });

    updateHighscore();
}

const TIMEOUT_IDS = [];

const writeLetterByLetter = (placeToWrite, text) => {
    placeToWrite.innerText = "";
    for (const id of TIMEOUT_IDS) clearTimeout(id);

    return new Promise((res) => {
        for (let i = 0; i < text.length; i++) {
            TIMEOUT_IDS.push(
                setTimeout(() => {
                    placeToWrite.textContent += text[i];
                    if (i === text.length - 1) res();
                }, i * 30)
            );
        }
    });
};

const writeStats = async () => {
    const nicknameResultSpan = document.querySelector("#nickname-result-span");
    const pointsScoredSpan = document.querySelector("#points-scored-span");
    const survivedTimerSpan = document.querySelector("#survived-timer-span");

    let nickname = `Player: ${nicknameInput.value}`;
    let pointsScored = `Points: ${HIGHSCORE}`;
    let survivedFor = `Survived: ${SURVIVED_TIME} seconds`;

    await writeLetterByLetter(nicknameResultSpan, nickname);
    await writeLetterByLetter(pointsScoredSpan, pointsScored);
    await writeLetterByLetter(survivedTimerSpan, survivedFor);
};

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
const nicknameDiv = document.querySelector("#nickname-div");
const nicknameInput = document.querySelector("#nickname-input");

startBtns.forEach((button) => {
    button.addEventListener("click", () => {
        LIVES_LEFT =
            button.id === "normal-btn" ? createHearts(3) : createHearts(1);

        resetSettings();
        updateSpawnInterval();
        updateEnemeyVelocityInterval();
        startTimer();
        animate();
        nicknameDiv.innerText = nicknameInput.value;
        mainMenuDiv.style.display = "none";
    });
});

const playAgainBtn = document.querySelector("#play-again-btn");
playAgainBtn.addEventListener("click", () => {
    endingDialogDiv.style.display = "none";
    mainMenuDiv.style.display = "flex";
});

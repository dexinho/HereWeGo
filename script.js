const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 650;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let HIGHSCORE = 0;
let SURVIVED_TIME = 0;
let LIVES_LEFT = 0;
let ENEMY_VELOCITY_X = 0;
let ENEMY_VELOCITY_Y = 1;
let ENEMY_SPAWN_SPEED = 1000;
let OBSTACLE_ID = 1;
let SPAWN_INTERVAL;
let TIMER_INTERVAL;
let OBSTACLE_VELOCITY_INTERVAL;

const TIMEOUT_IDS = [];
const OBSTACLES = [];

const highscoreCountDiv = document.querySelector("#highscore-count-div");
const endingDialogDiv = document.querySelector("#ending-div");
const highscoreDiv = document.querySelector("#highscore-div");
const livesLeftDiv = document.querySelector("#lives-left-div");
const playAgainBtn = document.querySelector("#play-again-btn");
const mainMenuDiv = document.querySelector("#main-menu-div");
const startBtns = document.querySelectorAll(".start-btns");
const nicknameDiv = document.querySelector("#nickname-div");
const nicknameInput = document.querySelector("#nickname-input");

const ICON = new Image();
ICON.src = "assets/transformers_icon_2.png";

class Player {
    constructor({ position, velocity, size }) {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
    }

    draw = () => {
        ctx.drawImage(
            ICON,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    };

    update = () => {
        for (const key in keysPressed) {
            if (
                key === "d" &&
                keysPressed[key] &&
                this.position.x + this.velocity < canvas.width - this.size.width
            )
                this.position.x += this.velocity;
            if (
                key === "a" &&
                keysPressed[key] &&
                this.position.x - this.velocity >= 0
            )
                this.position.x += this.velocity * -1;
            if (
                key === "w" &&
                keysPressed[key] &&
                this.position.y + this.velocity >= 0
            )
                this.position.y += this.velocity * -1;
            if (
                key === "s" &&
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

class Obstacle {
    constructor({ id, size, position, velocity, color, icon }) {
        this.id = id;
        this.size = size;
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.icon = icon
    }

    move = () => {
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        ctx.fillStyle = this.color;
        ctx.drawImage(
            this.icon,
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

function updateSpawnInterval() {
    clearInterval(SPAWN_INTERVAL);
    SPAWN_INTERVAL = setInterval(enemySpawn, ENEMY_SPAWN_SPEED);
}

function enemySpawn() {
    const icon = new Image()
    icon.src = `assets/icon${Math.floor(Math.random() * 10)}.png`

    const obstacle = new Obstacle({
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
        icon: icon,
    });

    OBSTACLES.unshift(obstacle);
    console.log(ENEMY_SPAWN_SPEED)
    if (SURVIVED_TIME % 5 === 0 && ENEMY_SPAWN_SPEED > 250) {
        ENEMY_SPAWN_SPEED -= 50;
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
        removeCollidedObstacle(id);
        changeHeartShape();
        LIVES_LEFT--;
    }
};

const removeCollidedObstacle = (id) => {
    let obstacleIndex = OBSTACLES.findIndex((obstacle) => obstacle.id === id);
    OBSTACLES.splice(obstacleIndex, 1);
};

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
        removeCollidedObstacle(id);
        HIGHSCORE++;
    }

    if (posX + width > canvas.width || posX < 0) return -1;

    return 1;
};

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

const updateEnemeyVelocityInterval = () => {
    clearInterval(OBSTACLE_VELOCITY_INTERVAL);

    OBSTACLE_VELOCITY_INTERVAL = setInterval(() => {
        if (ENEMY_VELOCITY_Y < 6) {
            ENEMY_VELOCITY_Y++;
            player.setVelocity = ++player.getVelocity;
        }
        if (ENEMY_VELOCITY_Y === 4) ENEMY_VELOCITY_X = Math.floor(Math.random() * 3 + 2);
        if (ENEMY_VELOCITY_X === 0) ENEMY_VELOCITY_X = 1;
    }, ENEMY_SPAWN_SPEED * 15);
};

function animate() {
    const frame = window.requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    if (LIVES_LEFT === 0) {
        window.cancelAnimationFrame(frame);
        endingDialogDiv.style.display = "flex";
        writeStats();
        stopTimer();
    }

    OBSTACLES.forEach((obstacle) => {
        obstacle.move();

        checkForCollision({
            id: obstacle.id,
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

const writeLetterByLetter = (placeToWrite, text) => {
    for (const id of TIMEOUT_IDS) clearTimeout(id);
    TIMEOUT_IDS.length = 0
    
    placeToWrite.innerText = "";
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
    w: false,
    a: false,
    s: false,
    d: false,
};

function whichKeyIsPressed(key, down = true) {
    if (key === "w") keysPressed[key] = down ? true : false;
    else if (key === "a") keysPressed[key] = down ? true : false;
    else if (key === "s") keysPressed[key] = down ? true : false;
    else if (key === "d") keysPressed[key] = down ? true : false;
}

document.addEventListener("keydown", (e) => whichKeyIsPressed(e.key));
document.addEventListener("keyup", (e) => whichKeyIsPressed(e.key, false));

startBtns.forEach((button) => {
    button.addEventListener("click", () => {
        LIVES_LEFT =
            button.id === "normal-btn" ? createHearts(3) : createHearts(1);

        updateEnemeyVelocityInterval();
        updateSpawnInterval();
        resetSettings();
        startTimer();
        animate();
        nicknameDiv.innerText = nicknameInput.value;
        mainMenuDiv.style.display = "none";
    });
});

playAgainBtn.addEventListener("click", () => {
    endingDialogDiv.style.display = "none";
    mainMenuDiv.style.display = "flex";
});

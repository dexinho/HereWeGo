const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 800;

class Sprite {
    constructor({ positions, velocity }) {
        this.positions = positions;
        this.velocity = velocity;
    }

    draw = () => {
        c.fillStyle = "red";
        c.fillRect(this.positions.x, this.positions.y, 50, 50);
    };

    update = () => {
        for (const key in keysPressed) {
            if (key === "ArrowRight" && keysPressed[key])
                this.positions.x += this.velocity.x;

            if (key === "ArrowLeft" && keysPressed[key])
                this.positions.x += this.velocity.x * -1;

            if (key === "ArrowUp" && keysPressed[key])
                this.positions.y += this.velocity.y * -1;

            if (key === "ArrowDown" && keysPressed[key])
                this.positions.y += this.velocity.y;
        }

        this.draw();
    };
}

const player = new Sprite({
    positions: {
        x: 100,
        y: 100,
    },
    velocity: {
        x: 1,
        y: 1,
    },
});

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
}

const keysPressed = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false,
};

animate();

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
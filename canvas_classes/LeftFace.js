class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    getLength() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    setLength(length) {
        const angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    addTo(v) {
        this.x += v.x;
        this.y += v.y;
    }

    multiplyBy(value) {
        this.x *= value;
        this.y *= value;
    }

    setAngle(angle) {
        const length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }
}

class Planet {
    constructor(x, y, g) {
        this.pos = new Vector(x, y);
        this.g = g;
    }

    draw(ctx) {
        // This method is reserved for drawing the planet if needed
    }
}

class Particle {
    constructor(x, y, spikeLength) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, spikeLength);
    }

    move(force) {
        if (force) {
            this.vel.addTo(force);
        }
        if (this.vel.getLength() > this.vel.spikeLength) {
            this.vel.setLength(this.vel.spikeLength);
        }
    }

    draw(ctx) {
        let p2 = this.pos.add(this.vel);
        let gradient = ctx.createLinearGradient(this.pos.x, this.pos.y, p2.x, p2.y);
        gradient.addColorStop(0, "rgba(0, 255, 255, 0)");
        gradient.addColorStop(1, "rgba(0, 255, 255, 1)");

        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = gradient;
        ctx.stroke();
    }
}

export default class LeftFace {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.planets = [];
        this.particles = [];
        this.setup();
        this.draw(1);
    }

    setup() {
        // Setup configurations and initial conditions
        this.config = {
            text: "</>",
            widthToSpikeLengthRatio: 0.054
        };

        this.colorConfig = {
            particleOpacity: 0.2,
            baseHue: 350,
            hueRange: 9,
            hueSpeed: 0.04,
            colorSaturation: 100
        };

        // Adjust this part based on actual needs
        this.reset();
        window.addEventListener("resize", () => this.reset());
        this.canvas.addEventListener("mousemove", (event) => this.mousemove(event));
    }

    reset() {
        // Reset or initialize the scene
    }

    mousemove(event) {
        // Handle mouse movement
    }

    draw(now) {
        this.clear();
        requestAnimationFrame((now) => this.draw(now));
        // Update and draw particles
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateParticles() {
        // Update particles based on the gravity of planets
    }

    drawText() {
        // Optional: draw text or other static elements
    }
}

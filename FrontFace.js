class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 3.5;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.radius, this.radius);
        ctx.restore();
    }
}

export default class FrontFace {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.particlePositions = [];
        this.particles = [];
        this.letters = 'APT </>'.split('');
        this.currentPos = 0;
        this.init();
    }

    init() {
        this.W = this.canvas.width = window.innerWidth;
        this.H = this.canvas.height = window.innerHeight;

        setInterval(() => {
            this.changeLetter();
            this.getPixels();
        }, 1200);

        this.makeParticles(1000);
        this.animate();
    }

    changeLetter() {
        this.time = this.letters[this.currentPos];
        this.currentPos = (this.currentPos + 1) % this.letters.length;
    }

    makeParticles(num) {
        for (let i = 0; i <= num; i++) {
            this.particles.push(new Particle(this.W / 2 + Math.random() * 400 - 200, this.H / 2 + Math.random() * 400 - 200));
        }
    }

    getPixels() {
        const keyword = this.time,
              gridX = 6,
              gridY = 6;

        const tmpCanvas = document.createElement('canvas'),
              tmpCtx = tmpCanvas.getContext('2d');

        tmpCanvas.width = window.innerWidth;
        tmpCanvas.height = window.innerHeight;
        tmpCtx.fillStyle = 'red';
        tmpCtx.font = 'italic bold 330px Noto Serif';
        tmpCtx.fillText(keyword, tmpCanvas.width / 2 - tmpCtx.measureText(keyword).width / 2, tmpCanvas.height / 2 + 100);

        const idata = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height),
              buffer32 = new Uint32Array(idata.data.buffer);

        this.particlePositions = [];
        for (let y = 0; y < tmpCanvas.height; y += gridY) {
            for (let x = 0; x < tmpCanvas.width; x += gridX) {
                if (buffer32[y * tmpCanvas.width + x]) {
                    this.particlePositions.push({x, y});
                }
            }
        }
    }

    animateParticles() {
        for (let i = 0, num = this.particles.length; i < num; i++) {
            const p = this.particles[i],
                  pPos = this.particlePositions[i];
            if (pPos) {
                p.x += (pPos.x - p.x) * 0.3;
                p.y += (pPos.y - p.y) * 0.3;
                p.draw(this.ctx);
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.fillStyle = 'rgba(23, 41, 58, 0.8)';
        this.ctx.fillRect(0, 0, this.W, this.H);
        this.animateParticles();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const frontFace = new FrontFace('particle-canvas');
});

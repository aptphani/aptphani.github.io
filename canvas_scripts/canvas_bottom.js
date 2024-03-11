class TextParticlesGalaxy {
  constructor(canvas, text) {
    this.canvas = canvas;
    this.text = text;
    this.particles = [];
    this.isExploded = false;
    this.app = new PIXI.Application({
      view: canvas,
      width: canvas.width,
      height: canvas.height,
      transparent: true,
    });
  }

  init() {
    this.createParticles();
    this.app.stage.interactive = true;
    this.app.stage.on('pointerdown', this.explode.bind(this));
    this.app.ticker.add(() => {
      this.animateParticles();
    });
  }

  createParticles() {
    const textStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
    });
    const textMetrics = PIXI.TextMetrics.measureText(this.text, textStyle);
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.height;

    const textSprite = new PIXI.Text(this.text, textStyle);
    textSprite.anchor.set(0.5);
    textSprite.x = this.app.screen.width / 2;
    textSprite.y = this.app.screen.height / 2;
    this.app.stage.addChild(textSprite);

    // Convert textSprite to particles
    const textureCanvas = this.app.renderer.plugins.extract.canvas(textSprite);
    const textureContext = textureCanvas.getContext('2d');
    const imageData = textureContext.getImageData(0, 0, textureCanvas.width, textureCanvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) {
        const x = (i / 4) % textureCanvas.width;
        const y = Math.floor(i / 4 / textureCanvas.width);

        const particle = new PIXI.Sprite(PIXI.Texture.WHITE);
        particle.tint = 0xffffff;
        particle.width = particle.height = 1;
        particle.x = textSprite.x + (x - textureCanvas.width / 2);
        particle.y = textSprite.y + (y - textureCanvas.height / 2);
        particle.anchor.set(0.5);
        particle.alpha = 0.8;
        this.app.stage.addChild(particle);
        this.particles.push(particle);
      }
    }

    textSprite.destroy();
  }

  animateParticles() {
    if (this.isExploded) {
      this.particles.forEach((particle) => {
        particle.x += Math.random() * 10 - 5;
        particle.y += Math.random() * 10 - 5;
        particle.alpha -= 0.01;
      });

      if (this.particles[0].alpha <= 0) {
        this.isExploded = false;
        this.resetParticles();
      }
    }
  }

  resetParticles() {
    this.particles.forEach((particle) => {
      particle.x = this.app.screen.width / 2;
      particle.y = this.app.screen.height / 2;
      particle.alpha = 0.8;
    });
  }

  explode() {
    this.isExploded = true;
  }
}

// Usage
const container = document.getElementById('container');
const particlesGalaxy = new TextParticlesGalaxy(container, 'Hello, World!');
particlesGalaxy.init();
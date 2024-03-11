class InteractiveTextWave {
  constructor(canvas, text) {
    this.canvas = canvas;
    this.text = text;
    this.textSprites = [];
    this.app = new PIXI.Application({
      view: canvas,
      width: canvas.width,
      height: canvas.height,
      transparent: true,
    });
  }

  init() {
    this.createWaveText();
    this.app.ticker.add(() => {
      this.animateWave();
    });
  }

  createWaveText() {
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;

    // Split text into individual characters and create sprites for each
    for (let i = 0; i < this.text.length; i++) {
      const charSprite = new PIXI.Text(this.text[i], {fontFamily: 'Arial', fontSize: 48, fill: 0xffffff});
      charSprite.x = i * 50 - (this.text.length * 50) / 2 + containerWidth / 2;
      charSprite.y = containerHeight / 2;
      charSprite.anchor.set(0.5);
      this.app.stage.addChild(charSprite);
      this.textSprites.push(charSprite);
    }
  }

  animateWave() {
    this.textSprites.forEach((sprite, index) => {
      // Apply wave motion based on sprite position and mouse interaction
      const mouseX = this.app.renderer.plugins.interaction.mouse.global.x;
      const distanceX = mouseX - sprite.x;
      sprite.y = Math.sin(this.app.ticker.lastTime / 1000 + index * 0.5 + distanceX * 0.02) * 20 + this.app.screen.height / 2;
    });
  }
}

// Usage
const container = document.getElementById('container');
const textWave = new InteractiveTextWave(container, 'Wave Text');
textWave.init();
function initializeLeftFaceAnimation(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("LeftFace canvas element not found");
    return;
  }

  const ctx = canvas.getContext("2d");
  let w, h;
  let hue;
  let particles;
  let spikeLength;
  let planets;
  let A;
  let B;
  let a;
  let b;
  let tick;

  const config = {
    text: "</>",
    widthToSpikeLengthRatio: 0.054,
  };

  const colorConfig = {
    particleOpacity: 0.2,
    baseHue: 350,
    hueRange: 9,
    hueSpeed: 0.04,
    colorSaturation: 100,
  };

  function setup() {
    tick = 0;
    planets = [];
    let len = Math.round(Math.random() * 3 + 3);
    for (let i = 0; i < len; i++) {
      let p = new Planet(50 + i * 100, 340, i ? 1000 : 4000);
      planets.push(p);
    }
    window.addEventListener("resize", reset);
    canvas.addEventListener("mousemove", mousemove);
    reset();
  }

  function reset() {
    hue = colorConfig.baseHue;
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    spikeLength = w * config.widthToSpikeLengthRatio;
    A = w / 2.2;
    B = h / 2.2;
    a = Math.round(Math.random() + 2);
    b = Math.round(Math.random() + 2);
    drawText();
  }

  function mousemove(event) {
    let x = event.clientX;
    let y = event.clientY;
    planets[0].pos.x = x;
    planets[0].pos.y = y;
  }

  function draw(now) {
    clear();
    requestAnimationFrame(draw);
    updateParticles();
    updatePlanets();
    tick = now / 50;
  }

  function clear() {
    ctx.clearRect(0, 0, w, h);
  }

  function drawText() {
    ctx.save();
    let fontSize = w * 0.2;
    ctx.font = "bold " + fontSize + "px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.strokeText(config.text, w / 2, h / 2);
    ctx.restore();
    let imageData = ctx.getImageData(0, 0, w, h);

    particles = [];

    let skipFactor = 2;

    for (let x = 0; x < w; x += skipFactor) {
      for (let y = 0; y < h; y += skipFactor) {
        let i = (x + w * y) * 4;
        let average =
          (imageData.data[i] +
            imageData.data[i + 1] +
            imageData.data[i + 2] +
            imageData.data[i + 3]) /
          4;
        if (average > 200) {
          let particle = new Particle(x, y);
          particles.push(particle);
        }
      }
    }
    clear();
  }

  function updatePlanets() {
    let len = planets.length;
    for (let i = 1; i < len; i++) {
      let angle = ((Math.PI * 2) / (len - 1)) * i;
      let x = A * Math.sin((a * tick) / 100 + angle) + w / 2;
      let y = B * Math.sin((b * tick) / 100 + angle) + h / 2;
      let p = planets[i];
      p.pos.x = x;
      p.pos.y = y;
      p.draw();
    }
  }

  function updateParticles() {
    hue += colorConfig.hueSpeed;
    let h = Math.sin(hue) * colorConfig.hueRange + colorConfig.baseHue;
    ctx.strokeStyle = `hsla(180, 100%, 50%, 1)`;
    particles.forEach((p) => {
      planets.forEach((planet) => {
        let d = p.pos.sub(planet.pos);
        let length = d.getLength();
        let g = planet.g / length;
        if (g > 40) {
          g = 40;
        }
        d.setLength(g);
        p.move(d);
      });
      p.draw();
    });
  }

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
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setLength(length) {
      var angle = this.getAngle();
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
      var length = this.getLength();
      this.x = Math.cos(angle) * length;
      this.y = Math.sin(angle) * length;
    }
  }

  class Planet {
    constructor(x, y, g) {
      this.pos = new Vector(x, y);
      this.g = g;
    }

    draw() {
      // ctx.beginPath();
      // ctx.fillStyle = "white";
      // ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
      // ctx.fill();
    }
  }

  class Particle {
    constructor(x, y) {
      this.pos = new Vector(x, y);
      this.vel = new Vector(0, spikeLength);
    }

    move(force) {
      if (force) {
        this.vel.addTo(force);
      }
      if (this.vel.getLength() > spikeLength) {
        this.vel.setLength(spikeLength);
      }
    }

    draw() {
      let p2 = this.pos.add(this.vel);
      let gradient = ctx.createLinearGradient(
        this.pos.x,
        this.pos.y,
        p2.x,
        p2.y
      );
      gradient.addColorStop(0, "rgba(0, 255, 255, 0)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 1)");

      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = gradient;
      ctx.stroke();
    }
  }

  setup();
  draw(1);
}
export { initializeLeftFaceAnimation };
function initializeFrontFaceAnimation(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("FrontFace canvas element not found");
    return;
  }
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth * 0.98; // Adjusted to match modal canvas width
  canvas.height = window.innerHeight * 0.45; // Adjusted to match modal canvas height

  let particlePositions = [];
  let particles = [];
  const letters = "APT </>".split("");
  let currentPos = 0;
  let W = canvas.width;
  let H = canvas.height;

  function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 4;

    this.draw = function () {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = "rgb(10,242,122)";
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    };
  }

  function changeLetter() {
    time = letters[currentPos];
    currentPos = (currentPos + 1) % letters.length;
  }

  function makeParticles(num) {
    for (let i = 0; i <= num; i++) {
      particles.push(
        new Particle(
          W / 2 + Math.random() * 400 - 200,
          H / 2 + Math.random() * 400 - 200
        )
      );
    }
  }

  function getPixels() {
    const keyword = letters[currentPos],
      gridX = 6,
      gridY = 6;

    const tmpCanvas = document.createElement("canvas"),
      tmpCtx = tmpCanvas.getContext("2d");

    tmpCanvas.width = W;
    tmpCanvas.height = H;
    tmpCtx.fillStyle = "red";
    tmpCtx.font = "italic bold 400px Noto Serif";
    const textHeight = 500; // Approximation of text height, adjust as needed
    tmpCtx.fillText(
      keyword,
      W / 2 - tmpCtx.measureText(keyword).width / 1.5,
      H / 2 + textHeight / 4
    );

    const idata = tmpCtx.getImageData(
        0,
        0,
        tmpCanvas.width,
        tmpCanvas.height
      ),
      buffer32 = new Uint32Array(idata.data.buffer);

    particlePositions = [];
    for (let y = 0; y < tmpCanvas.height; y += gridY) {
      for (let x = 0; x < tmpCanvas.width; x += gridX) {
        if (buffer32[y * tmpCanvas.width + x]) {
          particlePositions.push({ x, y });
        }
      }
    }
  }

  function animateParticles() {
    for (let i = 0, num = particles.length; i < num; i++) {
      const p = particles[i],
        pPos = particlePositions[i];
      if (pPos) {
        p.x += (pPos.x - p.x) * 0.3;
        p.y += (pPos.y - p.y) * 0.3;
        p.draw();
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(9, 5, 77, 1)";
    ctx.fillRect(0, 0, W, H);
    animateParticles();
  }

  // Initialize the animation
  setInterval(() => {
    changeLetter();
    getPixels();
  }, 600);

  makeParticles(10000);
  animate();
}
export { initializeFrontFaceAnimation };
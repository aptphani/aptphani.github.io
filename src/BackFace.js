function initializeBackFaceAnimation() {
    const canvas = document.getElementById("backFaceCanvas");
    if (!canvas) {
      console.error("BackFace canvas element not found");
      return;
    }
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = [
      "#FF4500", // Orangered
      "#00CED1", // Dark Turquoise
      "#FF00FF", // Magenta
      "#FFFF00", // Yellow
      "#7FFFD4", // Aquamarine
      "#FF1493", // Deep Pink
      "#00FF00", // Lime
      "#8A2BE2", // Blue Violet
      "#FF6347", // Tomato
      "#00FFFF", // Cyan
      "#FF8C00", // Dark Orange
      "#9400D3", // Dark Violet
    ];

    const userName = localStorage.getItem("userName") || "<APT/>";

    class Particle {
      constructor(effect, x, y) {
        this.effect = effect;
        this.x = Math.random() * this.effect.canvasWidth;
        this.y = Math.random() * this.effect.canvasHeight;
        this.originX = Math.floor(x);
        this.originY = Math.floor(y);
        this.size = Math.random() * 5 + 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.dx = 0;
        this.dy = 0;
        this.vx = 0;
        this.vy = 0;
        this.force = 10;
        this.angle = 0;
        this.distance = 0;
        this.friction = 0.8;
        this.ease = 1;
      }
      update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = -this.effect.mouse.radius / this.distance;
        if (this.distance < this.effect.mouse.radius) {
          this.angle = Math.atan2(this.dy, this.dx);
          this.vx += this.force * Math.cos(this.angle);
          this.vy += this.force * Math.sin(this.angle);
        }
        this.x +=
          (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y +=
          (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
      }
      draw() {
        this.effect.context.fillStyle = this.color;
        this.effect.context.beginPath();
        this.effect.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.effect.context.fill();
      }
    }

    class Effect {
      constructor(context, canvasWidth, canvasHeight) {
        this.context = context;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.particles = [];
        this.gap = 5;
        this.mouse = {
          radius: 800 * 800,
          x: undefined,
          y: undefined,
        };
        window.addEventListener("mousemove", (event) => {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          this.mouse.x = (event.clientX - rect.left) * scaleX;
          this.mouse.y = (event.clientY - rect.top) * scaleY;
        });
        window.addEventListener("mouseout", () => {
          this.mouse.x = undefined;
          this.mouse.y = undefined;
        });
        this.wrapText(userName);
      }
      wrapText(text) {
        this.context.font = "500px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText(
          text,
          this.canvasWidth / 2,
          this.canvasHeight / 1.8
        );
        this.convertToParticles();
      }
      convertToParticles() {
        this.particles = [];
        const imageData = this.context.getImageData(
          0,
          0,
          this.canvasWidth,
          this.canvasHeight
        );
        const data = imageData.data;
        for (let y = 0; y < this.canvasHeight; y += this.gap) {
          for (let x = 0; x < this.canvasWidth; x += this.gap) {
            const index = (y * this.canvasWidth + x) * 4;
            if (data[index + 3] > 128) {
              this.particles.push(new Particle(this, x, y));
            }
          }
        }
      }
      render() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.particles.forEach((particle) => {
          particle.update();
          particle.draw();
        });
      }
    }

    let effect = new Effect(ctx, canvas.width, canvas.height);

    function animate() {
      effect.render();
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      effect = new Effect(ctx, canvas.width, canvas.height);
      effect.wrapText(userName); // Re-generate text and particles for new dimensions
    });
  }
  export  {initializeBackFaceAnimation};
 
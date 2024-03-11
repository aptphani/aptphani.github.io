class Particle {
    constructor(disableScale = false) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
    
        this.canvas = canvas;
        this.context = context;
        this.disableScale = disableScale;
    
        this.resizeHandlers = [];
        this.handleResize = this.debounce(this.handleResize.bind(this), 100);
    
        this.adjust();
    
        window.addEventListener('resize', this.handleResize);
      }
  
    draw(context) {
      this.opacity -= this.speed / 200;
      context.fillStyle = this.color();
      context.fillRect(this.x, this.y, this.size, this.size);
    }
  
    move() {
      this.x += this.vx;
      // y speed is influenced by "gravity"
      this.y += this.vy + (1 - this.opacity) * this.speed;
    }
  
    color() {
      return "rgba(25, 7, 61, " + this.opacity + ")";
    }
  }
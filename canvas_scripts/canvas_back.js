class Interactive3DTextMaze {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.textMeshes = [];
  }

  init() {
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.camera.position.z = 5;
    this.loadFontAndCreateMaze();
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.animate();
  }

  loadFontAndCreateMaze() {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      // Create maze walls using text geometries
      const wallGeometry = new THREE.TextGeometry('Maze Wall', {
        font: font,
        size: 0.5,
        height: 0.2,
      });
      const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
      wallMesh.position.set(-2, 0, 0);
      this.scene.add(wallMesh);
      this.textMeshes.push(wallMesh);

      // Create maze paths using text geometries
      const pathGeometry = new THREE.TextGeometry('Maze Path', {
        font: font,
        size: 0.5,
        height: 0.1,
      });
      const pathMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
      pathMesh.position.set(2, 0, 0);
      this.scene.add(pathMesh);
      this.textMeshes.push(pathMesh);
    });
  }

  onMouseMove(event) {
    const mouseX = (event.clientX / this.container.clientWidth) * 2 - 1;
    const mouseY = -(event.clientY / this.container.clientHeight) * 2 + 1;

    // Rotate the maze based on mouse position
    this.textMeshes.forEach((mesh) => {
      mesh.rotation.y = mouseX * 0.05;
      mesh.rotation.x = mouseY * 0.05;
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

// Usage
const container = document.getElementById('container');
const textMaze = new Interactive3DTextMaze(container);
textMaze.init();
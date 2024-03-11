class TypographicWindField {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.textMeshes = [];
    this.windForce = new THREE.Vector3(0, 0, 0);
  }

  init() {
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.camera.position.z = 5;
    this.createTypographicField();
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.animate();
  }

  createTypographicField() {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new THREE.TextGeometry('Wind', {
        font: font,
        size: 2,
        height: 0.5,
        curveSegments: 12,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      this.scene.add(textMesh);
      this.textMeshes.push(textMesh);
    });
  }

  onMouseMove(event) {
    const mouseX = (event.clientX / this.container.clientWidth) * 2 - 1;
    const mouseY = -(event.clientY / this.container.clientHeight) * 2 + 1;
    this.windForce.set(mouseX, mouseY, 0);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.textMeshes.forEach((mesh) => {
      mesh.geometry.vertices.forEach((vertex) => {
        const distance = vertex.distanceTo(this.windForce);
        const force = this.windForce.clone().multiplyScalar(1 / (distance * distance));
        vertex.add(force);
      });
      mesh.geometry.verticesNeedUpdate = true;
    });

    this.renderer.render(this.scene, this.camera);
  }
}

// Usage
const container = document.getElementById('container');
const windField = new TypographicWindField(container);
windField.init();
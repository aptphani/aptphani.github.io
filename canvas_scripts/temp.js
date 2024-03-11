//.....canvas_top.js....////
class TypographicWindField {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.textMeshes = [];
    this.windForce = new THREE.Vector3(0, 0, 0);
  }

  init() {
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;
    this.renderer.setSize(containerWidth, containerHeight);
    this.container.appendChild(this.renderer.domElement);

    // Camera positioning
    this.camera.position.z = 5;

    this.createTypographicField();

    // Add event listener for mouse movement
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));

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

////.....canvas_right.js....////
class AugmentedRealityTextOverlay {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.textMesh = null;
  }

  init() {
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;
    this.renderer.setSize(containerWidth, containerHeight);
    this.container.appendChild(this.renderer.domElement);

    // Create AR.js source and initialize marker
    const arToolkitSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });
    arToolkitSource.init(() => {
      setTimeout(() => {
        arToolkitSource.onResize();
        arToolkitSource.copySizeTo(this.renderer.domElement);
      }, 500);
    });

    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: '\src\libs\camera_para.dat',
      detectionMode: 'mono',
    });
    arToolkitContext.init(() => {
      this.camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    // Create marker controls
    const markerControls = new THREEx.ArMarkerControls(arToolkitContext, this.camera, {
      type: 'pattern',
      patternUrl: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/patt.hiro',
      changeMatrixMode: 'cameraTransformMatrix',
    });

    // Create text geometry and mesh
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new THREE.TextGeometry('AR Text', {
        font: font,
        size: 1,
        height: 0.2,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
      this.textMesh.position.y = 1;
      this.scene.add(this.textMesh);
    });

    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

// Usage
const container = document.getElementById('container');
const arTextOverlay = new AugmentedRealityTextOverlay(container);
arTextOverlay.init();

////.....canvas_back.js....////

class Interactive3DTextMaze {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.textMeshes = [];
  }

  init() {
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;
    this.renderer.setSize(containerWidth, containerHeight);
    this.container.appendChild(this.renderer.domElement);

    // Camera positioning
    this.camera.position.z = 5;

    this.loadFontAndCreateMaze();

    // Add event listener for mouse movement
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));

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
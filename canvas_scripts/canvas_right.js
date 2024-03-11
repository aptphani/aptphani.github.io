class AugmentedRealityTextOverlay {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    this.textMesh = null;
  }

  init() {
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    const arToolkitSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });
    arToolkitSource.init(() => {
      setTimeout(() => {
        arToolkitSource.onResize();
        arToolkitSource.copySizeTo(this.renderer.domElement);
      }, 500);
    });
    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: 'src/libs/camera_para.dat',
      detectionMode: 'mono',
    });
    arToolkitContext.init(() => {
      this.camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });
    const markerControls = new THREEx.ArMarkerControls(arToolkitContext, this.camera, {
      type: 'pattern',
      patternUrl: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/patt.hiro',
      changeMatrixMode: 'cameraTransformMatrix',
    });
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
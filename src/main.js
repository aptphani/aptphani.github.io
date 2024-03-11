function createFaceCanvas(FaceClass, text) {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const faceInstance = new FaceClass(canvas, text);
  faceInstance.init();
  return canvas;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const faceNames = ['front', 'back', 'top', 'bottom', 'left', 'right'];
const planeGeometry = new THREE.PlaneGeometry(4, 4);
const cube = new THREE.Group();

const frontCanvas = createFaceCanvas(canvas_front);
const backCanvas = createFaceCanvas(Interactive3DTextMaze);
const topCanvas = createFaceCanvas(TypographicWindField);
const bottomCanvas = createFaceCanvas(TextParticlesGalaxy, 'Hello, World!');
const leftCanvas = createFaceCanvas(InteractiveTextWave, 'Wave Text');
const rightCanvas = createFaceCanvas(AugmentedRealityTextOverlay);

const frontMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(frontCanvas) });
const backMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(backCanvas) });
const topMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(topCanvas) });
const bottomMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(bottomCanvas) });
const leftMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(leftCanvas) });
const rightMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(rightCanvas) });

const cubeMaterials = [frontMaterial, backMaterial, topMaterial, bottomMaterial, leftMaterial, rightMaterial];

cubeMaterials.forEach((material, index) => {
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.name = faceNames[index];
  cube.add(plane);
  positionFace(plane, index);
});

scene.add(cube);

cube.position.set(0, 15, 40);
camera.position.set(0, 15, 50);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let lastClickTime = 0;
let rotationSpeed = 0.005;

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('dblclick', onDoubleClick);

setupLighting();
createFloor();
animate();

function positionFace(face, index) {
  switch (index) {
    case 0: // Front
      face.position.set(0, 0, -2);
      face.rotation.y = Math.PI;
      break;
    case 1: // Back
      face.position.set(0, 0, 2);
      break;
    case 2: // Top
      face.position.set(0, 2, 0);
      face.rotation.x = -Math.PI / 2;
      break;
    case 3: // Bottom
      face.position.set(0, -2, 0);
      face.rotation.x = Math.PI / 2;
      break;
    case 4: // Right
      face.position.set(2, 0, 0);
      face.rotation.y = Math.PI / 2;
      break;
    case 5: // Left
      face.position.set(-2, 0, 0);
      face.rotation.y = -Math.PI / 2;
      break;
  }
}

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
}

function onMouseMove(event) {
  if (isDragging) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };
    const rotateAngleX = deltaMove.y * Math.PI / 180 * 0.5;
    const rotateAngleY = deltaMove.x * Math.PI / 180 * 0.5;
    cube.rotation.x += rotateAngleX;
    cube.rotation.y += rotateAngleY;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  }
}

function onMouseUp() {
  isDragging = false;
}

function onDoubleClick(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cube.children);

  if (intersects.length > 0) {
    const clickedFace = intersects[0].object;
    const clickedFaceName = clickedFace.name;

    new TWEEN.Tween(cube.position)
      .to({ x: -50, y: 5, z: -20 }, 1000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(() => {
        rotationSpeed = 0;
        showModal(clickedFaceName);
      })
      .start();
  }
}

function setupLighting() {
  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 20, 20);
  spotLight.angle = Math.PI / 2;
  spotLight.penumbra = 0.1;
  spotLight.decay = 0;
  spotLight.distance = 1000;
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function createFloor() {
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xF7F5DA });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -5;
  floor.receiveShadow = true;
  scene.add(floor);
}

function animate() {
  if (!isDragging) {
    cube.rotation.x += rotationSpeed;
    cube.rotation.y += rotationSpeed;
  }
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
}

function showModal(faceName) {
  const modal = document.getElementById('modal');
  const modalContent = document.querySelector('.modal-content');
  const faceNameElement = document.getElementById('faceName');
  const closeButton = document.getElementById('closeButton');

  const modalCanvas = document.createElement('canvas');
  modalCanvas.width = modalContent.clientWidth;
  modalCanvas.height = modalContent.clientHeight;
  modalContent.appendChild(modalCanvas);

  let canvasInstance;
  switch (faceName) {
    case 'front':
      canvasInstance = new canvas_front(modalCanvas);
      break;
    case 'back':
      canvasInstance = new Interactive3DTextMaze(modalCanvas);
      break;
    case 'top':
      canvasInstance = new TypographicWindField(modalCanvas);
      break;
    case 'bottom':
      canvasInstance = new TextParticlesGalaxy(modalCanvas, 'Hello, World!');
      break;
    case 'left':
      canvasInstance = new InteractiveTextWave(modalCanvas, 'Wave Text');
      break;
    case 'right':
      canvasInstance = new AugmentedRealityTextOverlay(modalCanvas);
      break;
  }
  canvasInstance.init();

  faceNameElement.textContent = faceName;
  modal.style.display = 'flex';

  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    modalContent.removeChild(modalCanvas);
    new TWEEN.Tween(cube.position)
      .to({ x: 0, y: 15, z: 40 }, 1000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(() => {
        rotationSpeed = 0.005;
      })
      .start();
  });
}
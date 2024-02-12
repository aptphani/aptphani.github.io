
import { Tween } from 'tween';
import {THREE} from 'three';
const tween = new Tween();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Global variables for click tracking
let lastClickTime = 0;
let clickCount = 0;

function createVideoTexture(videoPath) {
  const video = document.createElement('video');
  video.src = videoPath;
  video.loop = true;
  video.muted = true;
  video.playbackRate = 1.0;
  video.crossOrigin = 'anonymous';
  const texture = new THREE.VideoTexture(video);
  video.addEventListener('loadedmetadata', () => { video.play(); });
  return texture;
}

const videoPaths = [
  '/ani/Video1.mp4',
  '/ani/Video2.mp4',
  '/ani/Video3.mp4',
  '/ani/Video4.mp4',
  '/ani/Video5.mp4',
  '/ani/Video6.mp4',
];

const videoMaterials = videoPaths.map(path => new THREE.MeshBasicMaterial({ map: createVideoTexture(path), side: THREE.DoubleSide }));

const planeGeometry = new THREE.PlaneGeometry(2, 2);
const planes = videoMaterials.map(material => new THREE.Mesh(planeGeometry, material));
const cube = new THREE.Group();
planes.forEach(plane => cube.add(plane));
cube.position.set(0, 10, 20);
scene.add(cube);

// Position and orientation of planes
planes[0].position.set(0, 0, -1); // Front
planes[1].position.set(0, 0, 1);  // Back
planes[1].rotation.y = Math.PI;
planes[2].position.set(0, 1, 0);  // Top
planes[2].rotation.x = -Math.PI / 2;
planes[3].position.set(0, -1, 0); // Bottom
planes[3].rotation.x = Math.PI / 2;
planes[4].position.set(1, 0, 0);  // Right
planes[4].rotation.y = Math.PI / 2;
planes[5].position.set(-1, 0, 0); // Left
planes[5].rotation.y = -Math.PI / 2;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', event => {
  isDragging = true;
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
});// Double click handler
function onPlaneDoubleClicked(plane) {

  // Figure out clicked face
  let clickedFace;
  if (plane === planes[0]) {
    clickedFace = planes[0];
  }
  // And so on for other planes

  // Position tween
  tween(cube.position)
    .to({ x: -10, y: 50, z: 10 }, 500)
    .easing(Tween.Easing.Elastic.Out)
    .start();

  // Calculate target rotation
  let targetRotation;
  if (clickedFace === planes[0]) {
    targetRotation = new THREE.Euler(
      0,
      Math.PI + Math.PI / 4,
      0
    );
  }

  // Rotation tween
  tween(cube.rotation)
    .to(targetRotation, 500)
    .start();

}

document.addEventListener('mousemove', event => {
  if (isDragging) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };

    const rotateAngleX = deltaMove.y * Math.PI / 180 * 0.5; // Rotation speed
    const rotateAngleY = deltaMove.x * Math.PI / 180 * 0.5; // Rotation speed

    cube.rotation.x += rotateAngleX;
    cube.rotation.y += rotateAngleY;

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

document.addEventListener('click', (event) => {
  if (!isDragging) { // Prevent click action when dragging
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cube.children);

    if (intersects.length > 0) {
      const now = Date.now();
      const delta = now - lastClickTime;
      lastClickTime = now;

      if (delta < 300) { // Double click detected
        // Correctly define intersectedObject from the intersects array
        const intersectedObject = intersects[0].object;
        const clickedPlaneIndex = planes.indexOf(intersectedObject);

        let clickedFace;

        switch (clickedPlaneIndex) {
          case 0:
            clickedFace = "Front";
            break;
          case 1:
            clickedFace = "Back";
            break;
          case 2:
            clickedFace = "Top";
            break;
          case 3:
            clickedFace = "Bottom";
            break;
          case 4:
            clickedFace = "Right";
            break;
          case 5:
            clickedFace = "Left";
            break;
          default:
            console.log("Clicked object is not a recognized plane");
            break;
        }

        console.log(clickedFace);
        // Position tween
        new Tween(cube.position)
          .to({ x: -20, y: 5, z: 10 }, 500)
          .easing(Tween.Easing.Quadratic.Out)
          .start();
        console.log(`Double-clicked on ${clickedFace}`);
      } else {
        console.log("Single click detected");
      }
    }
  }
});

// Spotlight
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 8, 10); // Adjusted to shine onto the cube and floor
spotLight.angle = Math.PI / 2;
spotLight.penumbra = 0.1;
spotLight.decay = 0.1; // Adjusted for a realistic light falloff
spotLight.distance = 50; // Ensure the light reaches the floor
spotLight.castShadow = true;
spotLight.shadow.bias = 0.001; // Reduces acne
scene.add(spotLight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(400, 400);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -10;
floor.receiveShadow = true;
scene.add(floor);

camera.position.set(0, 5, 40); // Adjust camera position to view the entire scene


function animate() {
  if (!isDragging) {
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.005;
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

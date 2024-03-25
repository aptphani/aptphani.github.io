let scene, camera, renderer, cube, light, floor, cubeContainer;
let controls;
let loadingManager = new THREE.LoadingManager();
let loader = new THREE.AudioLoader(loadingManager);

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Container for the cube
    cubeContainer = new THREE.Object3D();
    scene.add(cubeContainer);

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cubeContainer.add(cube);

    // Light - Spotlight
    light = new THREE.SpotLight(0xffffff, 1);
    light.position.set(0, 5, 0);
    light.angle = Math.PI / 4;
    light.penumbra = 0.5;
    light.decay = 2;
    light.distance = 50;
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.radius = 10;
    scene.add(light);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    scene.add(floor);

    camera.position.z = 5;

    // OrbitControls for interactive rotation of the cube
    controls = new THREE.OrbitControls(cubeContainer, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    // Sound
    let listener = new THREE.AudioListener();
    camera.add(listener);
    let sound = new THREE.Audio(listener);

    loader.load('light.wav', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(1);
    });

loadingManager.onLoad = function () {
    if (document.getElementById('preloader')) {
        document.getElementById('preloader').style.display = 'none';
    }
    if (document.getElementById('switch-button')) {
        document.getElementById('switch-button').style.display = 'block';
    }
    if (sound) {
        sound.play();
    }
};

// ... Animation function ...

if (typeof jQuery !== 'undefined') {
    jQuery(function ($) {
        // Your existing jQuery functionality
    });
} else {
    console.error('jQuery not loaded');
}

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

initThreeJS();

document.getElementById('switch-button').addEventListener('click', function() {
    document.getElementById('canvas-container').style.display = 'none';
    document.getElementById('main').style.display = 'block';
});

// jQuery functionality
jQuery(function ($) {
    // Place your existing jQuery functionality here
});

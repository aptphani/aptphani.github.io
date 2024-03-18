import * as THREE from 'three';

export class TopFace {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('TopFace: Container element not found');
            return;
        }
        this.init();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.offsetWidth / this.container.offsetHeight, 1, 2000);
        this.camera.position.z = 1000;
        this.scene.fog = new THREE.FogExp2(0x000000, 0.0008);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);

        this.materials = [];
        this.createParticles();

        document.body.style.touchAction = 'none';
        document.body.addEventListener('pointermove', (event) => this.onPointerMove(event));
    }

    createParticles() {
        const nameString = localStorage.getItem('name') || 'ABC';
        const totalParticles = 10000;
        const particlesPerCharacter = Math.floor(totalParticles / nameString.length);
        const textures = this.createTextures(nameString);

        textures.forEach((texture, index) => {
            const parameters = [1.0 - index * 0.1, 0.2 - index * 0.05, 0.5, texture, 20 - index * 3];
            this.addParticleGroup(parameters, particlesPerCharacter);
        });
    }

    createTextures(nameString) {
        return Array.from(nameString).map(character => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 128;
            canvas.height = 128;
            ctx.fillStyle = 'white';
            ctx.font = '100px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(character, 64, 64);
            return new THREE.CanvasTexture(canvas);
        });
    }

    addParticleGroup([hsl, texture, size], particlesPerCharacter) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        for (let i = 0; i < particlesPerCharacter; i++) {
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            vertices.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ size, map: texture, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });
        material.color.setHSL(...hsl);

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.materials.push(material);
    }

    onPointerMove(event) {
        this.mouseX = (event.clientX - this.container.clientWidth / 2) * 2;
        this.mouseY = (event.clientY - this.container.clientHeight / 2) * 2;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.render();
    }

    render() {
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }
}

import * as THREE from 'three';

export class BottomFace {
    constructor() {
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 1000;
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.particles = this.createParticles();
        this.scene.add(this.particles);

        this.animate();
    }

    createParticles() {
        const AMOUNTX = 50, AMOUNTY = 50;
        const SEPARATION = 100, particles = [];
        
        // Dummy data for the example. Replace this with actual data/logic.
        const positions = [], scales = [], letterIndices = [];
        let index = 0;
        for (let i = 0; i < AMOUNTX; i++) {
            for (let j = 0; j < AMOUNTY; j++) {
                positions.push(i * SEPARATION - ((AMOUNTX * SEPARATION) / 2), 0, j * SEPARATION - ((AMOUNTY * SEPARATION) / 2));
                scales.push(1);
                letterIndices.push(index % 5); // Assuming 5 different letters/textures
                index++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.Float32BufferAttribute(scales, 1));
        geometry.setAttribute('letterIndex', new THREE.Float32BufferAttribute(letterIndices, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffffff) },
                textureSampler: { value: [] }, // Placeholder, load actual textures
            },
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            transparent: true,
        });

        return new THREE.Points(geometry, material);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

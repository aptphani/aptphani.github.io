// RightFace.js
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

export default class RightFace {
  constructor() {
    this.birds = [];
    this.init();
  }

  async init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 200;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.font = await this.loadFont();
    await this.loadFont();
    this.createBirds();
    this.animate();
  }

  async loadFont() {
    const fontLoader = new FontLoader();
    return new Promise((resolve) => {
      fontLoader.load(
        "https://unpkg.com/three@0.156.0/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          this.font = font;
          resolve();
        }
      );
    });
  }
  createBirds() {
    const NUM_BIRDS = 20;
    const letterString = localStorage.getItem("name")
      ? localStorage.getItem("name")
      : "</>";
    for (let i = 0; i < NUM_BIRDS; i++) {
      const letter = letterString[i % letterString.length];
      const birdGroup = this.createBird(letter);
      this.birds.push(birdGroup);
      this.scene.add(birdGroup);
    }
  }

  updateBirds() {
    const WING_FLAP_ANGLE = Math.PI / 4;
    const BOUNDS = 500;

    this.birds.forEach((birdGroup) => {
      birdGroup.position.add(birdGroup.velocity);
      if (birdGroup.position.z < -BOUNDS) {
        this.scene.remove(birdGroup);
        this.birds.splice(this.birds.indexOf(birdGroup), 1);
      }

      birdGroup.flapAngle += birdGroup.flapSpeed;
      if (birdGroup.flapAngle > WING_FLAP_ANGLE || birdGroup.flapAngle < 0) {
        birdGroup.flapSpeed = -birdGroup.flapSpeed;
      }

      birdGroup.children.forEach((wing) => {
        wing.rotation.y =
          wing === birdGroup.children[0]
            ? birdGroup.flapAngle
            : -birdGroup.flapAngle;
      });

      const opacity = 1 - Math.abs(birdGroup.position.z) / BOUNDS;
      birdGroup.children.forEach((wing) => {
        wing.material.opacity = opacity;
      });
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.updateBirds();
    this.renderer.render(this.scene, this.camera);
  }
}

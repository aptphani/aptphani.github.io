async function initializeRightFaceAnimation(canvasId) {
  if (typeof BABYLON === 'undefined') {
      await import('https://cdn.babylonjs.com/babylon.js');
      await import('https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js');
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
      console.error("RightFace canvas element not found");
      return;
  }

  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.03, 0.03, 0.12, 1); // Dark navy blue background

  const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 300, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

  const glowLayer = new BABYLON.GlowLayer("glow", scene);
  glowLayer.intensity = 0.6;

  const letters = ['A', 'P', 'T'];
  const planets = [];
  const AMOUNTX = 10, AMOUNTY = 10; // Grid size
  const SEPARATION = 5; // Distance between letters

  for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = (ix + iy) % letters.length;
          const letter = letters[index];
          const planet = createLetterPlanet(letter, ix, iy, SEPARATION, scene);
          planets.push(planet);
      }
  }

  function createLetterPlanet(letter, ix, iy, SEPARATION, scene) {
      const size = 50; // Size of the dynamic texture
      const dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width: size, height: size}, scene, true);
      dynamicTexture.drawText(letter, 10, 40, "bold 40px Arial", "#07F7DF", "transparent", true);
      dynamicTexture.hasAlpha = true;

      const plane = BABYLON.MeshBuilder.CreatePlane("textPlane", {size: 1}, scene);
      plane.position.x = (ix - AMOUNTX / 2) * SEPARATION;
      plane.position.y = 0; // Adjust as necessary for your scene
      plane.position.z = (iy - AMOUNTY / 2) * SEPARATION;

      const material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
      material.diffuseTexture = dynamicTexture;
      material.emissiveColor = new BABYLON.Color3.FromHexString("#07F7DF"); // Bright neon blue
      material.useAlphaFromDiffuseTexture = true;
      plane.material = material;

      glowLayer.addIncludedOnlyMesh(plane);

      return plane;
  }

  engine.runRenderLoop(() => {
      scene.render();
  });

  window.addEventListener('resize', () => {
      engine.resize();
  });
}
export {initializeRightFaceAnimation};
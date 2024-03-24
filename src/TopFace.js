function initializeTopFaceAnimation(canvasId) {
  let engine, scene, camera;
  let letters = [];
  let ripples = [];
  let water;
  init();
  animate();

  function init() {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error("TopFace canvas element not found");
      return;
    }

    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    camera = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 2,
      80,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvas, true);

    new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(1, 1, 0),
      scene
    ).intensity = 0.7;

    waterMaterial = new BABYLON.StandardMaterial("waterMaterial", scene);
    waterMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    waterMaterial.alpha = 0.6;
    water = BABYLON.MeshBuilder.CreateGround(
      "water",
      { width: 300, height: 300 },
      scene
    );
    water.material = waterMaterial;
    water.position.y = -30;

    createTextParticles();
  }

  function createTextParticles() {
    const lettersOptions = ["A", "P", "T"];

    lettersOptions.forEach((letter) => {
      for (let i = 0; i < 300; i++) {
        const plane = BABYLON.MeshBuilder.CreatePlane(
          "textPlane",
          { width: 2, height: 2 },
          scene
        );
        const dynamicTexture = new BABYLON.DynamicTexture(
          "DynamicTexture",
          512,
          scene,
          true
        );
        dynamicTexture.drawText(
          letter,
          75,
          400,
          "bold 440px Arial",
          "white",
          "transparent",
          true
        );
        dynamicTexture.hasAlpha = true;

        const material = new BABYLON.StandardMaterial(
          "TextPlaneMaterial",
          scene
        );
        material.diffuseTexture = dynamicTexture;
        material.useAlphaFromDiffuseTexture = true;

        plane.material = material;
        plane.position = new BABYLON.Vector3(
          Math.random() * 300 - 150,
          Math.random() * 90 + 30,
          Math.random() * 300 - 150
        );
        plane.metadata = { velocity: -Math.random() * 0.5 - 0.5 };

        letters.push(plane);
      }
    });
  }

  function createRipple(position) {
    const ripple = BABYLON.MeshBuilder.CreateTorus(
      "ripple",
      { diameter: 1.5, thickness: 0.15, tessellation: 32 },
      scene
    );
    ripple.position = new BABYLON.Vector3(
      position.x,
      water.position.y - 20,
      position.z - 20
    );
    ripple.rotation.x = Math.PI / 2;
    const material = new BABYLON.StandardMaterial("rippleMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.0118, 0.9882, 0.9569);
    material.alpha = 1;
    ripple.material = material;

    ripples.push({
      mesh: ripple,
      scale: 1,
      alpha: material.alpha,
      maxSize: 9,
    });
  }

  function animate() {
    engine.runRenderLoop(() => {
      letters.forEach((letter) => {
        letter.position.y += letter.metadata.velocity;
        if (letter.position.y < -90) {
          const impactPosition = new BABYLON.Vector3(
            letter.position.x,
            -4.95,
            letter.position.z
          );
          createRipple(impactPosition);
          letter.position.y = 90 + Math.random() * 30;
          letter.position.x = Math.random() * 300 - 150;
          letter.position.z = Math.random() * 300 - 150;
        }
      });

      ripples.forEach((ripple, index) => {
        ripple.scale += 0.05;
        ripple.alpha -= 0.02;
        ripple.mesh.scaling.x = ripple.mesh.scaling.y = ripple.scale;
        ripple.mesh.material.alpha = ripple.alpha;

        if (ripple.scale > ripple.maxSize || ripple.alpha <= 0) {
          ripple.mesh.dispose();
          ripples.splice(index, 1);
        }
      });

      scene.render();
    });
  }
}

export { initializeTopFaceAnimation };
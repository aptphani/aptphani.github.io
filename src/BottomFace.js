async function initializeBottomFaceAnimation(canvasId) {
  if (typeof BABYLON === "undefined") {
    await import("https://cdn.babylonjs.com/babylon.js");
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("BottomFace canvas element not found");
    return;
  }

  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(1 / 255, 4 / 255, 43 / 255, 1); // Dark navy blue background

  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 4,
    1000,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );

  // Wave parameters
  const SEPARATION = 100,
    AMOUNTX = 50,
    AMOUNTY = 50;
  let count = 0;

  // Store all planes for animation
  const planes = [];

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const index = Math.floor(Math.random() * 3);
      const letter = ["A", "P", "T"][index];
      const plane = createLetterParticle(
        letter,
        ix,
        iy,
        SEPARATION,
        scene
      );
      planes.push(plane);
    }
  }

  function createLetterParticle(letter, ix, iy, SEPARATION, scene) {
    const dynamicTexture = new BABYLON.DynamicTexture(
      "DynamicTexture",
      { width: 512, height: 512 },
      scene,
      true
    );
    dynamicTexture.drawText(
      letter,
      75,
      400,
      "bold 440px Arial",
      "#07f7df",
      "transparent"
    );
    dynamicTexture.hasAlpha = true;

    const plane = BABYLON.MeshBuilder.CreatePlane(
      "textPlane",
      { size: 20 },
      scene
    );
    plane.position.x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
    plane.position.z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
    plane.position.y = 0;

    const material = new BABYLON.StandardMaterial(
      "TextPlaneMaterial",
      scene
    );
    material.diffuseTexture = dynamicTexture;
    material.useAlphaFromDiffuseTexture = true;
    plane.material = material;

    return plane;
  }

  scene.registerBeforeRender(function () {
    const time = performance.now();

    for (let i = 0, l = planes.length; i < l; i++) {
      const plane = planes[i];
      const ix = i % AMOUNTX,
        iy = Math.floor(i / AMOUNTX);

      plane.position.y =
        Math.sin((ix + count) * 0.3) * 50 +
        Math.sin((iy + count) * 0.5) * 50;
      plane.rotation.z = Math.sin((ix + count) * 0.3) * Math.PI * 0.2;
    }

    count += 0.1;
  });

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
}
export {initializeBottomFaceAnimation};
import {
  Engine,
  WebGPUEngine,
  Scene,
  Vector3,
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  Color4,
  Color3,
  MeshBuilder,
  StandardMaterial,
  PBRMaterial,
  Texture,
  DefaultRenderingPipeline,
  DepthOfFieldEffectBlurLevel,
  FxaaPostProcess,
  CubeTexture,
} from '@babylonjs/core';

export interface EngineResult {
  engine: Engine | WebGPUEngine;
  scene: Scene;
  shadowGenerator: ShadowGenerator;
  canvas: HTMLCanvasElement;
}

export async function createEngine(canvas: HTMLCanvasElement): Promise<EngineResult> {
  let engine: Engine | WebGPUEngine;
  let isWebGPU = false;

  // Try WebGPU first for max performance
  if (await WebGPUEngine.IsSupportedAsync) {
    try {
      const webgpuEngine = new WebGPUEngine(canvas, {
        antialias: true,
        adaptToDeviceRatio: true,
      });
      await webgpuEngine.initAsync();
      engine = webgpuEngine;
      isWebGPU = true;
      console.log('[Engine] WebGPU initialized — maximum GPU performance');
    } catch (e) {
      console.warn('[Engine] WebGPU failed, falling back to WebGL2:', e);
      engine = new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true,
        adaptToDeviceRatio: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      });
    }
  } else {
    engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
      adaptToDeviceRatio: true,
      powerPreference: 'high-performance',
    });
    console.log('[Engine] WebGL2 initialized');
  }

  // Use all CPU cores: enable worker pool
  engine.enableOfflineSupport = false;

  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.02, 0.02, 0.05, 1.0);
  scene.ambientColor = new Color3(0.1, 0.1, 0.15);

  // Hemisphere light for ambient
  const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
  hemi.intensity = 0.4;
  hemi.diffuse = new Color3(0.5, 0.6, 0.8);
  hemi.groundColor = new Color3(0.1, 0.08, 0.05);

  // Main directional light with shadows
  const sun = new DirectionalLight('sun', new Vector3(-0.5, -1, -0.5), scene);
  sun.position = new Vector3(50, 100, 50);
  sun.intensity = 1.8;
  sun.diffuse = new Color3(1.0, 0.95, 0.8);
  sun.specular = new Color3(0.5, 0.5, 0.4);

  // High-quality shadow generator
  const shadowGenerator = new ShadowGenerator(2048, sun);
  shadowGenerator.useExponentialShadowMap = true;
  shadowGenerator.usePoissonSampling = true;
  shadowGenerator.bias = 0.001;
  shadowGenerator.normalBias = 0.01;

  // Secondary fill light (dramatic)
  const fillLight = new DirectionalLight('fill', new Vector3(0.5, -0.3, 1), scene);
  fillLight.intensity = 0.3;
  fillLight.diffuse = new Color3(0.3, 0.4, 0.8);

  // Post-processing pipeline
  setupPostProcessing(scene, isWebGPU);

  // Optimize scene
  scene.autoClear = false;
  scene.autoClearDepthAndStencil = false;
  scene.skipPointerMovePicking = true;
  scene.blockMaterialDirtyMechanism = false;
  scene.useGeometryIdsMap = true;
  scene.useMaterialMeshMap = true;
  scene.useClonedMeshMap = true;

  return { engine, scene, shadowGenerator, canvas };
}

function setupPostProcessing(scene: Scene, highQuality: boolean): void {
  const pipeline = new DefaultRenderingPipeline('pipeline', true, scene);

  // Bloom
  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.8;
  pipeline.bloomWeight = 0.3;
  pipeline.bloomKernel = highQuality ? 64 : 32;
  pipeline.bloomScale = 0.5;

  // Chromatic aberration
  pipeline.chromaticAberrationEnabled = true;
  pipeline.chromaticAberration.aberrationAmount = 30;

  // Sharpening
  pipeline.sharpenEnabled = true;
  pipeline.sharpen.edgeAmount = 0.2;

  // Image processing
  pipeline.imageProcessingEnabled = true;
  pipeline.imageProcessing.contrast = 1.3;
  pipeline.imageProcessing.exposure = 1.1;
  pipeline.imageProcessing.toneMappingEnabled = true;
  pipeline.imageProcessing.vignetteEnabled = true;
  pipeline.imageProcessing.vignetteWeight = 2.5;

  // FXAA
  pipeline.fxaaEnabled = true;

  // Depth of field (only high quality)
  if (highQuality) {
    pipeline.depthOfFieldEnabled = false; // off by default, can toggle
    pipeline.depthOfField.focalLength = 150;
    pipeline.depthOfField.fStop = 1.4;
    pipeline.depthOfField.focusDistance = 2000;
    pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low;
  }

  // Grain
  pipeline.grainEnabled = true;
  pipeline.grain.intensity = 8;
  pipeline.grain.animated = true;
}

export function buildArena(scene: Scene, shadowGenerator: ShadowGenerator): void {
  // Ground
  const ground = MeshBuilder.CreateGround('ground', { width: 200, height: 200, subdivisions: 4 }, scene);
  const groundMat = new PBRMaterial('groundMat', scene);
  groundMat.albedoColor = new Color3(0.15, 0.12, 0.08);
  groundMat.roughness = 0.9;
  groundMat.metallic = 0.0;
  ground.material = groundMat;
  ground.receiveShadows = true;

  // Tower (what we defend) at center
  const towerBase = MeshBuilder.CreateCylinder('towerBase', { height: 20, diameter: 8, tessellation: 8 }, scene);
  towerBase.position = new Vector3(0, 10, 0);
  const towerMat = new PBRMaterial('towerMat', scene);
  towerMat.albedoColor = new Color3(0.4, 0.35, 0.25);
  towerMat.roughness = 0.8;
  towerMat.metallic = 0.1;
  towerBase.material = towerMat;
  towerBase.receiveShadows = true;
  shadowGenerator.addShadowCaster(towerBase);

  const towerTop = MeshBuilder.CreateBox('towerTop', { width: 10, height: 4, depth: 10 }, scene);
  towerTop.position = new Vector3(0, 22, 0);
  towerTop.material = towerMat;
  towerTop.receiveShadows = true;
  shadowGenerator.addShadowCaster(towerTop);

  // Battlements
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const battlement = MeshBuilder.CreateBox(`battlement_${i}`, { width: 1.5, height: 2, depth: 1.5 }, scene);
    battlement.position = new Vector3(
      Math.cos(angle) * 4.5,
      25,
      Math.sin(angle) * 4.5
    );
    battlement.material = towerMat;
    shadowGenerator.addShadowCaster(battlement);
  }

  // Walls around arena (enemy path markers)
  const wallMat = new PBRMaterial('wallMat', scene);
  wallMat.albedoColor = new Color3(0.3, 0.28, 0.22);
  wallMat.roughness = 0.85;
  wallMat.metallic = 0.05;

  // 4 entry gates (where enemies come from)
  const gatePositions = [
    new Vector3(0, 0, 80),
    new Vector3(80, 0, 0),
    new Vector3(0, 0, -80),
    new Vector3(-80, 0, 0),
  ];

  gatePositions.forEach((pos, i) => {
    const gate = MeshBuilder.CreateBox(`gate_${i}`, { width: 6, height: 8, depth: 2 }, scene);
    gate.position = pos.clone();
    gate.position.y = 4;
    gate.material = wallMat;
    gate.receiveShadows = true;
    shadowGenerator.addShadowCaster(gate);
  });

  // Atmospheric fog
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogColor = new Color3(0.02, 0.02, 0.05);
  scene.fogDensity = 0.005;

  // Decorative rocks / cover
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 50;
    const rock = MeshBuilder.CreateSphere(`rock_${i}`, {
      diameter: 1 + Math.random() * 3,
      segments: 4
    }, scene);
    rock.position = new Vector3(
      Math.cos(angle) * dist,
      0.5 + Math.random(),
      Math.sin(angle) * dist
    );
    const rockMat = new PBRMaterial(`rockMat_${i}`, scene);
    rockMat.albedoColor = new Color3(0.2 + Math.random() * 0.1, 0.18, 0.15);
    rockMat.roughness = 0.95;
    rockMat.metallic = 0;
    rock.material = rockMat;
    rock.receiveShadows = true;
    shadowGenerator.addShadowCaster(rock);
  }
}

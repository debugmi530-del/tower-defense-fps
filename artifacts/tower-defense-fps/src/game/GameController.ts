import {
  Scene, UniversalCamera, Vector3, KeyboardEventTypes,
  MeshBuilder, PBRMaterial, Color3, PointerEventTypes,
  ParticleSystem, Texture, Color4, Mesh, Ray,
} from '@babylonjs/core';
import { createEngine, buildArena, EngineResult } from './engine';
import { pollGamepad, BTN } from './gamepad';
import { useGameStore } from '../store/gameStore';
import { initEntityManager, syncEnemyMeshes, syncUnitMeshes, moveEnemies, moveBoss } from './systems/entityManager';
import { updateCombat, playerShoot, useSpecialAbility } from './systems/combatSystem';
import { updateWaveManager, startWave, spawnBoss } from './systems/waveManager';
import { UNITS } from './data/units';

const SHOOT_COOLDOWN = 0.12; // seconds between shots
const RELOAD_TIME = 1.8;
const SPECIAL_COOLDOWN_BASE = 60;

export class GameController {
  private engineResult: EngineResult | null = null;
  private camera: UniversalCamera | null = null;
  private running = false;
  private lastTime = 0;
  private shootCooldown = 0;
  private reloadTimer = 0;
  private specialCooldown = 0;

  // Input state
  private isShooting = false;
  private prevStart = false;
  private prevB = false;
  private prevA = false;
  private prevX = false;
  private prevY = false;
  private prevLB = false;
  private prevRB = false;
  private prevDUp = false;
  private prevDDown = false;
  private prevDLeft = false;
  private prevDRight = false;
  private prevSelect = false;

  private unitPlaceCooldown = 0;

  async init(canvas: HTMLCanvasElement): Promise<void> {
    this.engineResult = await createEngine(canvas);
    const { engine, scene, shadowGenerator } = this.engineResult;

    buildArena(scene, shadowGenerator);
    initEntityManager(scene);
    this.setupCamera(scene);

    // Engine render loop
    engine.runRenderLoop(() => {
      const now = performance.now() / 1000;
      const dt = Math.min(now - this.lastTime, 0.05);
      this.lastTime = now;

      const store = useGameStore.getState();
      if (store.phase === 'playing') {
        this.tick(dt, scene);
      }

      scene.render();
    });

    // Handle resize
    window.addEventListener('resize', () => engine.resize());
  }

  private setupCamera(scene: Scene): void {
    const cam = new UniversalCamera('fpsCam', new Vector3(0, 1.7, -15), scene);
    cam.setTarget(new Vector3(0, 1.7, 0));
    cam.minZ = 0.1;
    cam.maxZ = 500;
    cam.fov = 1.1; // ~63 degrees FOV
    cam.speed = 0;
    cam.inertia = 0;
    this.camera = cam;
    scene.activeCamera = cam;
  }

  startGame(): void {
    if (!this.engineResult) return;
    this.running = true;
    this.lastTime = performance.now() / 1000;
    useGameStore.getState().setPhase('waveAnnounce');

    setTimeout(() => {
      useGameStore.getState().setPhase('playing');
      startWave(1);
    }, 3000);
  }

  private tick(dt: number, scene: Scene): void {
    if (!this.camera) return;
    const store = useGameStore.getState();

    // 1. Poll gamepad
    const gp = pollGamepad();

    // 2. Move player
    this.handlePlayerMovement(dt, gp, store.player.speed);

    // 3. Rotate camera with right stick
    if (gp.connected) {
      const LOOK_SPEED = 2.5;
      this.camera.rotation.y += gp.rightX * LOOK_SPEED * dt;
      this.camera.rotation.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, this.camera.rotation.x + gp.rightY * LOOK_SPEED * dt)
      );
    }

    // Update player position in store
    store.setPlayer({
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
      yaw: this.camera.rotation.y,
      pitch: this.camera.rotation.x,
    });

    // 4. Shooting (RT)
    const isFiring = gp.connected ? gp.rightTrigger > 0.3 : false;
    this.shootCooldown = Math.max(0, this.shootCooldown - dt);
    this.specialCooldown = Math.max(0, this.specialCooldown - dt);

    if (isFiring && !store.player.isReloading && store.player.ammo > 0 && this.shootCooldown <= 0) {
      this.shootCooldown = SHOOT_COOLDOWN;
      playerShoot(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z,
        this.camera.rotation.y,
        store.player.damage
      );
      const newAmmo = store.player.ammo - 1;
      store.setPlayer({ ammo: newAmmo });
      if (newAmmo <= 0) {
        store.setPlayer({ isReloading: true, reloadProgress: 0 });
      }
    }

    // Reload (X button or auto)
    if (store.player.isReloading) {
      this.reloadTimer += dt;
      const prog = Math.min(this.reloadTimer / RELOAD_TIME, 1);
      store.setPlayer({ reloadProgress: prog });
      if (prog >= 1) {
        this.reloadTimer = 0;
        store.setPlayer({ isReloading: false, reloadProgress: 0, ammo: store.player.maxAmmo });
      }
    } else {
      // Manual reload with X
      const xPressed = gp.connected && gp.buttons[BTN.X] && !this.prevX;
      if (xPressed) {
        this.reloadTimer = 0;
        store.setPlayer({ isReloading: true });
      }
    }
    this.prevX = gp.connected ? gp.buttons[BTN.X] : false;

    // 5. Special ability (hold X for 0.5s)
    const specialCooldownStore = store.upgrades.levels[9];
    const cooldownMax = Math.max(10, SPECIAL_COOLDOWN_BASE - specialCooldownStore * 10);
    if (this.specialCooldown <= 0) {
      const aPressed = gp.connected && gp.justPressed[BTN.Y];
      if (aPressed) {
        const dmg = 1000 + store.upgrades.levels[9] * 1000;
        const radius = 15 + store.upgrades.levels[9] * 5;
        useSpecialAbility(this.camera.position.x, this.camera.position.z, radius, dmg);
        this.specialCooldown = cooldownMax;
        store.setPlayer({ specialCooldown: cooldownMax, specialMaxCooldown: cooldownMax });
      }
    }
    store.setPlayer({ specialCooldown: this.specialCooldown, specialMaxCooldown: cooldownMax });

    // 6. Unit placement (A button)
    this.unitPlaceCooldown = Math.max(0, this.unitPlaceCooldown - dt);
    const aUnit = gp.connected && gp.buttons[BTN.A] && !this.prevA;
    if (aUnit && this.unitPlaceCooldown <= 0) {
      this.deployUnit(store);
      this.unitPlaceCooldown = 0.5;
    }
    this.prevA = gp.connected ? gp.buttons[BTN.A] : false;

    // 7. Cycle units (LB/RB)
    const lbPressed = gp.connected && gp.buttons[BTN.LB] && !this.prevLB;
    const rbPressed = gp.connected && gp.buttons[BTN.RB] && !this.prevRB;
    if (lbPressed || rbPressed) {
      const dir = lbPressed ? -1 : 1;
      const newId = Math.max(0, Math.min(39, store.selectedUnitDefId + dir));
      store.setSelectedUnit(newId);
    }
    this.prevLB = gp.connected ? gp.buttons[BTN.LB] : false;
    this.prevRB = gp.connected ? gp.buttons[BTN.RB] : false;

    // D-pad era cycling
    const dUp = gp.connected && gp.buttons[BTN.DPAD_UP] && !this.prevDUp;
    const dDown = gp.connected && gp.buttons[BTN.DPAD_DOWN] && !this.prevDDown;
    if (dUp) store.setSelectedEra(Math.max(0, store.selectedEra - 1));
    if (dDown) store.setSelectedEra(Math.min(5, store.selectedEra + 1));
    this.prevDUp = gp.connected ? gp.buttons[BTN.DPAD_UP] : false;
    this.prevDDown = gp.connected ? gp.buttons[BTN.DPAD_DOWN] : false;

    // 8. Pause (Start)
    const startPressed = gp.connected && gp.buttons[BTN.START] && !this.prevStart;
    if (startPressed) {
      store.setPhase('paused');
    }
    this.prevStart = gp.connected ? gp.buttons[BTN.START] : false;

    // 9. Upgrade menu (B)
    const bPressed = gp.connected && gp.buttons[BTN.B] && !this.prevB;
    if (bPressed) {
      store.setPhase(store.phase === 'upgrading' ? 'playing' : 'upgrading');
    }
    this.prevB = gp.connected ? gp.buttons[BTN.B] : false;

    // 10. Update game systems
    updateWaveManager(dt);
    moveEnemies(dt);
    moveBoss(dt);
    updateCombat(dt);

    // 11. Sync meshes
    const freshStore = useGameStore.getState();
    syncEnemyMeshes(freshStore.activeEnemies);
    syncUnitMeshes(freshStore.activeUnits);

    // 12. Tower HP regen
    if (store.tower.regen > 0) {
      const newHp = Math.min(store.tower.maxHp, store.tower.hp + store.tower.regen * dt);
      store.setTower({ hp: newHp });
    }

    // 13. Wave boss spawn check
    const wave = freshStore.wave;
    if (wave.isBossWave && !freshStore.activeBoss && wave.enemiesLeft <= 5) {
      const bossId = Math.floor(wave.current / 5) - 1;
      if (bossId >= 0 && bossId <= 19) {
        spawnBoss(bossId);
      }
    }
  }

  private handlePlayerMovement(dt: number, gp: ReturnType<typeof pollGamepad>, speed: number): void {
    if (!this.camera) return;
    if (!gp.connected || (gp.leftX === 0 && gp.leftY === 0)) return;

    const yaw = this.camera.rotation.y;
    const fwdX = Math.sin(yaw);
    const fwdZ = Math.cos(yaw);
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);

    const isSprinting = gp.buttons[BTN.L3];
    const actualSpeed = speed * (isSprinting ? 1.8 : 1.0);

    this.camera.position.x += (fwdX * (-gp.leftY) + rightX * gp.leftX) * actualSpeed * dt;
    this.camera.position.z += (fwdZ * (-gp.leftY) + rightZ * gp.leftX) * actualSpeed * dt;

    // Clamp to arena
    const MAX_DIST = 90;
    const dist = Math.sqrt(this.camera.position.x ** 2 + this.camera.position.z ** 2);
    if (dist > MAX_DIST) {
      this.camera.position.x *= MAX_DIST / dist;
      this.camera.position.z *= MAX_DIST / dist;
    }
  }

  private deployUnit(store: ReturnType<typeof useGameStore.getState>): void {
    if (!this.camera) return;
    const activeUnits = store.activeUnits;
    if (activeUnits.length >= store.unitLimit) {
      store.addNotification('Лимит юнитов достигнут!', 'warn');
      return;
    }

    const def = UNITS[store.selectedUnitDefId];
    if (!def) return;

    const cost = Math.floor(def.cost * store.unitCostMultiplier);
    if (!store.spendGold(cost)) {
      store.addNotification(`Недостаточно золота! Нужно ${cost}`, 'warn');
      return;
    }

    // Deploy in front of player
    const fwdX = Math.sin(this.camera.rotation.y);
    const fwdZ = Math.cos(this.camera.rotation.y);
    const deployX = this.camera.position.x + fwdX * 5;
    const deployZ = this.camera.position.z + fwdZ * 5;

    const unit = {
      id: `unit_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      defId: store.selectedUnitDefId,
      x: deployX,
      y: 0,
      z: deployZ,
      hp: Math.floor(def.hp * store.unitHpMultiplier),
      maxHp: Math.floor(def.hp * store.unitHpMultiplier),
    };

    store.setActiveUnits([...activeUnits, unit]);
    store.addNotification(`Развёрнут: ${def.name}`, 'info');
  }

  resumeGame(): void {
    useGameStore.getState().setPhase('playing');
  }

  dispose(): void {
    this.running = false;
    this.engineResult?.engine.dispose();
    this.engineResult = null;
  }
}

export const gameController = new GameController();

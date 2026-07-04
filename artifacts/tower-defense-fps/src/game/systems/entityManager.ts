import { Scene, MeshBuilder, Color3, Mesh, InstancedMesh, PBRMaterial } from '@babylonjs/core';
import { ENEMIES } from '../data/enemies';
import { BOSSES } from '../data/bosses';
import { UNITS } from '../data/units';
import { ActiveEnemy, ActiveBoss, ActiveUnit, useGameStore } from '../../store/gameStore';

// Template meshes for GPU instancing
const enemyTemplates = new Map<number, Mesh>();
const unitTemplates = new Map<number, Mesh>();
const activeEnemyMeshes = new Map<string, InstancedMesh | Mesh>();
const activeUnitMeshes = new Map<string, InstancedMesh | Mesh>();

let scene: Scene;

export function initEntityManager(s: Scene): void {
  scene = s;
  // Pre-build template meshes for all enemy types
  preloadTemplates();
}

function hexToColor3(hex: string): Color3 {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new Color3(r, g, b);
}

function preloadTemplates(): void {
  // Build enemy templates (10 tiers, one template per tier)
  for (let tier = 1; tier <= 10; tier++) {
    const tierEnemy = ENEMIES.find((e) => e.tier === tier);
    if (!tierEnemy) continue;
    const template = buildEnemyMesh(`enemy_template_tier${tier}`, tierEnemy);
    template.setEnabled(false);
    enemyTemplates.set(tier, template);
  }
}

function buildEnemyMesh(name: string, def: { color: string; size: [number, number, number]; isFlying?: boolean }): Mesh {
  const [w, h, d] = def.size;
  const body = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);

  const mat = new PBRMaterial(`${name}_mat`, scene);
  mat.albedoColor = hexToColor3(def.color);
  mat.roughness = 0.7;
  mat.metallic = 0.1;
  mat.emissiveColor = hexToColor3(def.color).scale(0.1);
  body.material = mat;
  body.isPickable = false;
  return body;
}

export function syncEnemyMeshes(enemies: ActiveEnemy[]): void {
  if (!scene) return;
  const seen = new Set<string>();

  for (const enemy of enemies) {
    if (!enemy.isAlive) continue;
    seen.add(enemy.id);

    const def = ENEMIES[enemy.defId];
    if (!def) continue;

    let mesh = activeEnemyMeshes.get(enemy.id);
    if (!mesh) {
      const template = enemyTemplates.get(def.tier);
      if (template) {
        mesh = template.createInstance(`inst_${enemy.id}`);
      } else {
        mesh = buildEnemyMesh(`e_${enemy.id}`, def);
      }
      (mesh as any).enemyId = enemy.id;
      activeEnemyMeshes.set(enemy.id, mesh);
    }

    mesh.position.set(enemy.x, enemy.y + def.size[1] / 2, enemy.z);
    mesh.setEnabled(true);
  }

  // Remove dead enemy meshes
  for (const [id, mesh] of activeEnemyMeshes) {
    if (!seen.has(id)) {
      mesh.dispose();
      activeEnemyMeshes.delete(id);
    }
  }
}

export function syncUnitMeshes(units: ActiveUnit[]): void {
  if (!scene) return;
  const seen = new Set<string>();

  for (const unit of units) {
    seen.add(unit.id);
    const def = UNITS[unit.defId];
    if (!def) continue;

    let mesh = activeUnitMeshes.get(unit.id);
    if (!mesh) {
      mesh = buildEnemyMesh(`u_${unit.id}`, def);
      activeUnitMeshes.set(unit.id, mesh);
    }

    mesh.position.set(unit.x, unit.y + def.size[1] / 2, unit.z);
    mesh.setEnabled(true);
  }

  // Remove removed unit meshes
  for (const [id, mesh] of activeUnitMeshes) {
    if (!seen.has(id)) {
      mesh.dispose();
      activeUnitMeshes.delete(id);
    }
  }
}

// Path from spawn to tower (simple radial path)
const TWO_PI = Math.PI * 2;

export function moveEnemies(dt: number): void {
  const store = useGameStore.getState();
  const enemies = store.activeEnemies;
  if (enemies.length === 0) return;

  const speedMult = 1.0;
  let changed = false;

  const updated = enemies.map((enemy) => {
    if (!enemy.isAlive) return enemy;
    const def = ENEMIES[enemy.defId];
    if (!def) return enemy;

    const speed = def.speed * speedMult;

    // Move toward tower (0, 0, 0)
    const dx = 0 - enemy.x;
    const dz = 0 - enemy.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 5) {
      // Reached tower — deal damage
      const store2 = useGameStore.getState();
      const newHp = Math.max(0, store2.tower.hp - def.damage);
      store2.setTower({ hp: newHp });
      store2.recordDamageTaken(def.damage);
      if (newHp <= 0) {
        store2.setPhase('gameover');
      }
      changed = true;
      return { ...enemy, isAlive: false };
    }

    const nx = dx / dist;
    const nz = dz / dist;
    changed = true;
    return {
      ...enemy,
      x: enemy.x + nx * speed * dt,
      z: enemy.z + nz * speed * dt,
      progress: 1 - dist / 80,
    };
  });

  if (changed) {
    store.setActiveEnemies(updated);
  }
}

export function moveBoss(dt: number): void {
  const store = useGameStore.getState();
  const boss = store.activeBoss;
  if (!boss || !boss.isAlive) return;

  const def = BOSSES[boss.bossDefId];
  if (!def) return;

  const dx = 0 - boss.x;
  const dz = 0 - boss.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist < 8) {
    const store2 = useGameStore.getState();
    const newHp = Math.max(0, store2.tower.hp - def.damage * dt);
    store2.setTower({ hp: newHp });
    if (newHp <= 0) store2.setPhase('gameover');
    return;
  }

  const nx = dx / dist;
  const nz = dz / dist;
  const updatedBoss: ActiveBoss = {
    ...boss,
    x: boss.x + nx * def.speed * dt,
    z: boss.z + nz * def.speed * dt,
  };
  store.setActiveBoss(updatedBoss);

  // Update boss mesh
  const mesh = activeEnemyMeshes.get(boss.id);
  if (!mesh) {
    // Create boss mesh if not exists
    const [w, h, d] = [def.size[0], def.size[1], def.size[2]];
    const bossMesh = MeshBuilder.CreateBox(`boss_mesh_${boss.id}`, { width: w, height: h, depth: d }, scene);
    const mat = new PBRMaterial(`boss_mat_${boss.id}`, scene);
    mat.albedoColor = hexToColor3(def.color);
    mat.roughness = 0.5;
    mat.metallic = 0.3;
    mat.emissiveColor = hexToColor3(def.color).scale(0.3);
    bossMesh.material = mat;
    bossMesh.isPickable = false;
    bossMesh.position.set(updatedBoss.x, updatedBoss.y + def.size[1] / 2, updatedBoss.z);
    activeEnemyMeshes.set(boss.id, bossMesh);
  } else {
    mesh.position.set(updatedBoss.x, updatedBoss.y + def.size[1] / 2, updatedBoss.z);
  }
}

export function cleanupEntityManager(): void {
  for (const mesh of activeEnemyMeshes.values()) mesh.dispose();
  for (const mesh of activeUnitMeshes.values()) mesh.dispose();
  for (const mesh of enemyTemplates.values()) mesh.dispose();
  for (const mesh of unitTemplates.values()) mesh.dispose();
  activeEnemyMeshes.clear();
  activeUnitMeshes.clear();
}

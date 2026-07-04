import { useGameStore, ActiveEnemy, ActiveUnit, ActiveBoss } from '../../store/gameStore';
import { UNITS } from '../data/units';
import { ENEMIES } from '../data/enemies';
import { BOSSES } from '../data/bosses';

interface UnitCombatState {
  unitId: string;
  cooldown: number;
}

const unitCooldowns = new Map<string, number>();

export function updateCombat(dt: number): void {
  const store = useGameStore.getState();
  const { activeUnits, activeEnemies, activeBoss, unitDamageMultiplier, unitAttackSpeedMultiplier } = store;

  const aliveEnemies = activeEnemies.filter((e) => e.isAlive);

  if (activeUnits.length === 0) return;
  if (aliveEnemies.length === 0 && !activeBoss) return;

  const updatedEnemies = [...activeEnemies];
  let updatedBoss = activeBoss;
  const killedIds: string[] = [];
  let bossKilled = false;
  let totalReward = 0;

  for (const unit of activeUnits) {
    const def = UNITS[unit.defId];
    if (!def) continue;

    // Tick cooldown
    const prev = unitCooldowns.get(unit.id) ?? 0;
    const cooldown = Math.max(0, prev - dt);
    unitCooldowns.set(unit.id, cooldown);
    if (cooldown > 0) continue;

    const attackSpeed = def.attackSpeed * unitAttackSpeedMultiplier;
    const damage = def.damage * unitDamageMultiplier;
    const rangeSq = def.range * def.range;

    // Find nearest STILL-alive target (re-check updatedEnemies to avoid duplicate kills)
    let bestTarget: ActiveEnemy | null = null;
    let bestDistSq = Infinity;

    for (const enemy of updatedEnemies) {
      if (!enemy.isAlive) continue;
      const dx = enemy.x - unit.x;
      const dz = enemy.z - unit.z;
      const distSq = dx * dx + dz * dz;
      if (distSq < rangeSq && distSq < bestDistSq) {
        bestDistSq = distSq;
        bestTarget = enemy;
      }
    }

    // Also target boss
    if (activeBoss?.isAlive) {
      const dx = activeBoss.x - unit.x;
      const dz = activeBoss.z - unit.z;
      const distSq = dx * dx + dz * dz;
      if (distSq < rangeSq * 4) { // Boss range extended
        // Attack boss
        unitCooldowns.set(unit.id, 1 / attackSpeed);
        const newBossHp = (updatedBoss?.hp ?? 0) - damage;
        store.recordDamageDealt(damage);
        if (newBossHp <= 0 && updatedBoss) {
          const bossDef = BOSSES[updatedBoss.bossDefId];
          bossKilled = true;
          totalReward += bossDef?.reward ?? 1000;
          updatedBoss = { ...updatedBoss, hp: 0, isAlive: false };
        } else if (updatedBoss) {
          updatedBoss = { ...updatedBoss, hp: newBossHp };
        }
        continue;
      }
    }

    if (!bestTarget) continue;

    unitCooldowns.set(unit.id, 1 / attackSpeed);

    if (def.isAoE && def.aoeRadius) {
      // AoE attack
      const r2 = def.aoeRadius * def.aoeRadius;
      for (let i = 0; i < updatedEnemies.length; i++) {
        const e = updatedEnemies[i];
        if (!e.isAlive) continue;
        const dx = e.x - bestTarget.x;
        const dz = e.z - bestTarget.z;
        if (dx * dx + dz * dz <= r2) {
          const newHp = e.hp - damage;
          store.recordDamageDealt(damage);
          if (newHp <= 0) {
            killedIds.push(e.id);
            const eDef = ENEMIES[e.defId];
            totalReward += eDef?.reward ?? 5;
            updatedEnemies[i] = { ...e, hp: 0, isAlive: false };
          } else {
            updatedEnemies[i] = { ...e, hp: newHp };
          }
        }
      }
    } else {
      // Single target
      const idx = updatedEnemies.findIndex((e) => e.id === bestTarget!.id);
      if (idx >= 0) {
        const newHp = updatedEnemies[idx].hp - damage;
        store.recordDamageDealt(damage);
        if (newHp <= 0) {
          killedIds.push(updatedEnemies[idx].id);
          const eDef = ENEMIES[updatedEnemies[idx].defId];
          totalReward += eDef?.reward ?? 5;
          updatedEnemies[idx] = { ...updatedEnemies[idx], hp: 0, isAlive: false };
        } else {
          updatedEnemies[idx] = { ...updatedEnemies[idx], hp: newHp };
        }
      }
    }
  }

  // Always flush enemy HP changes (even non-lethal damage)
  const enemiesChanged = updatedEnemies.some((e, i) => e.hp !== activeEnemies[i]?.hp || e.isAlive !== activeEnemies[i]?.isAlive);
  if (enemiesChanged) {
    store.setActiveEnemies(updatedEnemies);
  }

  if (bossKilled) {
    store.setActiveBoss(null);
  } else if (updatedBoss !== activeBoss) {
    store.setActiveBoss(updatedBoss);
  }

  if (killedIds.length > 0 || bossKilled) {
    for (const _id of killedIds) {
      store.addKill(0, false);
    }
    if (bossKilled) store.addKill(0, true);
    if (totalReward > 0) store.addGold(totalReward);

    const deadCount = killedIds.length + (bossKilled ? 1 : 0);
    const current = useGameStore.getState().wave;
    store.setWave({ enemiesLeft: Math.max(0, current.enemiesLeft - deadCount) });
  }
}

// Player fires a ray (simplified — hits nearest enemy in front)
export function playerShoot(px: number, py: number, pz: number, yaw: number, damage: number): void {
  const store = useGameStore.getState();
  const { activeEnemies, activeBoss } = store;

  const fwdX = Math.sin(yaw);
  const fwdZ = Math.cos(yaw);

  // Cone check — ±30 degrees
  const COS_CONE = Math.cos((30 * Math.PI) / 180);
  let bestEnemy: ActiveEnemy | null = null;
  let bestDist = Infinity;

  for (const enemy of activeEnemies) {
    if (!enemy.isAlive) continue;
    const dx = enemy.x - px;
    const dz = enemy.z - pz;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 60) continue;
    const dot = (fwdX * dx + fwdZ * dz) / dist;
    if (dot >= COS_CONE && dist < bestDist) {
      bestDist = dist;
      bestEnemy = enemy;
    }
  }

  // Check boss too
  if (activeBoss?.isAlive) {
    const dx = activeBoss.x - px;
    const dz = activeBoss.z - pz;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 80) {
      const dot = (fwdX * dx + fwdZ * dz) / dist;
      if (dot >= COS_CONE) {
        const bossDef = BOSSES[activeBoss.bossDefId];
        const newHp = activeBoss.hp - damage;
        store.recordDamageDealt(damage);
        if (newHp <= 0) {
          store.setActiveBoss(null);
          store.addKill(bossDef?.reward ?? 1000, true);
          store.addNotification(`💀 БОСС УБИТ! +${bossDef?.reward ?? 1000} золота`, 'success');
        } else {
          store.setActiveBoss({ ...activeBoss, hp: newHp });
        }
        return;
      }
    }
  }

  if (!bestEnemy) return;

  const def = ENEMIES[bestEnemy.defId];
  const newHp = bestEnemy.hp - damage;
  store.recordDamageDealt(damage);

  const updated = store.activeEnemies.map((e) => {
    if (e.id !== bestEnemy!.id) return e;
    if (newHp <= 0) {
      return { ...e, hp: 0, isAlive: false };
    }
    return { ...e, hp: newHp };
  });
  store.setActiveEnemies(updated);

  if (newHp <= 0) {
    store.addKill(def?.reward ?? 5, false);
    store.setWave({ enemiesLeft: Math.max(0, store.wave.enemiesLeft - 1) });
  }
}

// Special ability: large AoE nuke
export function useSpecialAbility(px: number, pz: number, radius: number, damage: number): void {
  const store = useGameStore.getState();
  const r2 = radius * radius;
  let reward = 0;
  let kills = 0;

  const updated = store.activeEnemies.map((e) => {
    if (!e.isAlive) return e;
    const dx = e.x - px;
    const dz = e.z - pz;
    if (dx * dx + dz * dz <= r2) {
      kills++;
      const def = ENEMIES[e.defId];
      reward += def?.reward ?? 5;
      return { ...e, hp: 0, isAlive: false };
    }
    return e;
  });

  store.setActiveEnemies(updated);
  if (kills > 0) {
    store.addGold(reward);
    store.addScore(kills * 100);
    store.setWave({ enemiesLeft: Math.max(0, store.wave.enemiesLeft - kills) });
    store.addNotification(`💥 Суперудар: уничтожено ${kills} врагов!`, 'success');
  }

  // Boss damage
  if (store.activeBoss?.isAlive) {
    const dx = store.activeBoss.x - px;
    const dz = store.activeBoss.z - pz;
    if (dx * dx + dz * dz <= r2 * 4) {
      const newHp = store.activeBoss.hp - damage;
      if (newHp <= 0) {
        const bossDef = BOSSES[store.activeBoss.bossDefId];
        store.setActiveBoss(null);
        store.addKill(bossDef?.reward ?? 1000, true);
      } else {
        store.setActiveBoss({ ...store.activeBoss, hp: newHp });
      }
    }
  }
}

import { ENEMIES, EnemyDef } from '../data/enemies';
import { BOSSES, BossDef } from '../data/bosses';
import { useGameStore, ActiveEnemy, ActiveBoss } from '../../store/gameStore';

export interface WaveConfig {
  wave: number;
  enemies: Array<{ defId: number; count: number; spawnDelay: number }>;
  bossDefId?: number;
  spawnRate: number; // enemies per second
  reward: number; // bonus gold
}

// Spawn points: 4 gates around the arena
const SPAWN_POINTS = [
  { x: 0, z: 80 },
  { x: 80, z: 0 },
  { x: 0, z: -80 },
  { x: -80, z: 0 },
];

let spawnQueue: Array<{ defId: number; delay: number }> = [];
let spawnTimer = 0;
let waveActive = false;
let enemyIdCounter = 0;

export function buildWaveConfig(wave: number): WaveConfig {
  const tier = Math.min(Math.ceil(wave / 10), 10);
  const tierEnemyStart = (tier - 1) * 10;
  const isBossWave = wave % 5 === 0;

  // Scale difficulty
  const baseCount = 8 + wave * 2;
  const spawnRate = 0.8 + wave * 0.05;

  const enemies: WaveConfig['enemies'] = [];

  // Primary enemies from current tier
  const primaryCount = Math.floor(baseCount * 0.6);
  const primaryId = tierEnemyStart + Math.floor(Math.random() * Math.min(wave, 10));
  enemies.push({ defId: Math.min(primaryId, 99), count: primaryCount, spawnDelay: 0 });

  // Secondary enemies (slightly weaker)
  if (wave > 3) {
    const secondaryCount = Math.floor(baseCount * 0.3);
    const secondaryId = Math.max(0, tierEnemyStart - 3 + Math.floor(Math.random() * 4));
    enemies.push({ defId: Math.min(secondaryId, 99), count: secondaryCount, spawnDelay: 2 });
  }

  // Elite enemies in later waves
  if (wave > 10) {
    const eliteCount = Math.floor(baseCount * 0.1);
    const eliteId = Math.min(tierEnemyStart + 8, 99);
    enemies.push({ defId: eliteId, count: eliteCount, spawnDelay: 5 });
  }

  // Boss wave
  let bossDefId: number | undefined;
  if (isBossWave) {
    const bossIdx = Math.floor(wave / 5) - 1;
    bossDefId = Math.min(bossIdx, 19);
  }

  return {
    wave,
    enemies,
    bossDefId,
    spawnRate,
    reward: 50 + wave * 25,
  };
}

export function startWave(wave: number): void {
  const store = useGameStore.getState();
  const config = buildWaveConfig(wave);

  spawnQueue = [];
  let totalDelay = 0;

  for (const group of config.enemies) {
    for (let i = 0; i < group.count; i++) {
      spawnQueue.push({
        defId: group.defId,
        delay: totalDelay + group.spawnDelay + i * (1 / config.spawnRate),
      });
    }
  }

  const totalEnemies = spawnQueue.length + (config.bossDefId !== undefined ? 1 : 0);

  store.setWave({
    current: wave,
    enemiesLeft: totalEnemies,
    enemiesTotal: totalEnemies,
    isBossWave: config.bossDefId !== undefined,
    timeToNext: 0,
  });

  spawnTimer = 0;
  waveActive = true;

  store.addNotification(`Волна ${wave} началась!`, wave % 5 === 0 ? 'danger' : 'warn');
  if (config.bossDefId !== undefined) {
    const boss = BOSSES[config.bossDefId];
    store.addNotification(`⚠️ БОСС: ${boss.name}`, 'danger');
  }
}

export function updateWaveManager(dt: number): void {
  if (!waveActive) return;

  const store = useGameStore.getState();
  spawnTimer += dt;

  // Spawn queued enemies
  const toSpawn = spawnQueue.filter((s) => s.delay <= spawnTimer);
  spawnQueue = spawnQueue.filter((s) => s.delay > spawnTimer);

  if (toSpawn.length > 0) {
    const currentEnemies = store.activeEnemies;
    const newEnemies: ActiveEnemy[] = toSpawn.map((s) => {
      const spawnPoint = SPAWN_POINTS[Math.floor(Math.random() * SPAWN_POINTS.length)];
      const def = ENEMIES[s.defId] ?? ENEMIES[0];
      const id = `enemy_${++enemyIdCounter}`;
      return {
        id,
        defId: s.defId,
        x: spawnPoint.x + (Math.random() - 0.5) * 4,
        y: def.isFlying ? 5 + Math.random() * 3 : 0,
        z: spawnPoint.z + (Math.random() - 0.5) * 4,
        hp: def.hp,
        maxHp: def.hp,
        progress: 0,
        isAlive: true,
      };
    });
    store.setActiveEnemies([...currentEnemies, ...newEnemies]);
  }

  // Check if wave is complete — re-read store for fresh snapshot after spawn
  const freshState = useGameStore.getState();
  if (spawnQueue.length === 0 && freshState.activeEnemies.filter((e) => e.isAlive).length === 0 && !freshState.activeBoss) {
    completeWave();
  }
}

function completeWave(): void {
  waveActive = false;
  const store = useGameStore.getState();
  const config = buildWaveConfig(store.wave.current);
  store.addGold(config.reward);
  store.addScore(1000 * store.wave.current);
  store.setWave({ timeToNext: 15, enemiesLeft: 0 });
  store.addNotification(`✅ Волна ${store.wave.current} завершена! +${config.reward} золота`, 'success');

  // Record stat
  useGameStore.setState((s) => ({
    stats: { ...s.stats, wavesCompleted: s.stats.wavesCompleted + 1 },
  }));

  // Trigger upgrade menu after every 5 waves
  if (store.wave.current % 5 === 0) {
    setTimeout(() => {
      useGameStore.getState().setPhase('upgrading');
    }, 1000);
  }

  // Schedule next wave — starts automatically after inter-wave delay
  const currentWaveNum = store.wave.current;
  const nextWave = currentWaveNum + 1;
  if (nextWave > 100) {
    setTimeout(() => useGameStore.getState().setPhase('victory'), 2000);
  } else {
    const delay = store.wave.current % 5 === 0 ? 20000 : 12000; // longer pause after boss/upgrade
    setTimeout(() => {
      const s = useGameStore.getState();
      if (s.phase === 'playing' || s.phase === 'upgrading') {
        s.setWave({ current: nextWave, enemiesLeft: 0, enemiesTotal: 0, isBossWave: nextWave % 5 === 0, timeToNext: 0 });
        startWave(nextWave);
        s.setPhase('playing');
      }
    }, delay);
  }
}

export function spawnBoss(bossDefId: number): void {
  const def = BOSSES[bossDefId];
  if (!def) return;
  const spawnPoint = SPAWN_POINTS[0];
  const boss: ActiveBoss = {
    id: `boss_${bossDefId}`,
    defId: 99, // use a large enemy as visual
    bossDefId,
    x: spawnPoint.x,
    y: def.isFlying ? 8 : 0,
    z: spawnPoint.z,
    hp: def.hp,
    maxHp: def.hp,
    progress: 0,
    isAlive: true,
    phase: 1,
    abilities: def.abilities,
  };
  useGameStore.getState().setActiveBoss(boss);
}

import { create } from 'zustand';
import { UnitDef } from '../game/data/units';
import { EnemyDef } from '../game/data/enemies';
import { BossDef } from '../game/data/bosses';

export type GamePhase = 'menu' | 'playing' | 'paused' | 'upgrading' | 'waveAnnounce' | 'gameover' | 'victory';

export interface ActiveUnit {
  id: string;
  defId: number;
  x: number;
  y: number;
  z: number;
  hp: number;
  maxHp: number;
  targetId?: string;
}

export interface ActiveEnemy {
  id: string;
  defId: number;
  x: number;
  y: number;
  z: number;
  hp: number;
  maxHp: number;
  progress: number; // 0-1 path progress
  isAlive: boolean;
}

export interface ActiveBoss extends ActiveEnemy {
  bossDefId: number;
  phase: number;
  abilities: string[];
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  speed: number;
  damage: number;
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  reloadProgress: number;
  specialCooldown: number;
  specialMaxCooldown: number;
}

export interface TowerState {
  hp: number;
  maxHp: number;
  regen: number;
}

export interface UpgradesState {
  levels: number[]; // one per upgrade id (0-9)
}

export interface WaveState {
  current: number;
  total: number;
  enemiesLeft: number;
  enemiesTotal: number;
  isBossWave: boolean;
  timeToNext: number; // seconds countdown
}

export interface GameStats {
  kills: number;
  bossKills: number;
  goldEarned: number;
  wavesCompleted: number;
  damageDealt: number;
  damageTaken: number;
}

export interface GameStore {
  phase: GamePhase;
  player: PlayerState;
  tower: TowerState;
  upgrades: UpgradesState;
  wave: WaveState;
  gold: number;
  score: number;
  stats: GameStats;
  activeUnits: ActiveUnit[];
  activeEnemies: ActiveEnemy[];
  activeBoss: ActiveBoss | null;
  selectedUnitDefId: number;
  selectedEra: number; // 0-5
  unitLimit: number;
  goldMultiplier: number;
  unitDamageMultiplier: number;
  unitAttackSpeedMultiplier: number;
  unitHpMultiplier: number;
  unitSpeedMultiplier: number;
  unitCostMultiplier: number;
  notifications: Notification[];

  // Actions
  setPhase: (phase: GamePhase) => void;
  setPlayer: (p: Partial<PlayerState>) => void;
  setTower: (t: Partial<TowerState>) => void;
  setWave: (w: Partial<WaveState>) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addScore: (amount: number) => void;
  setSelectedUnit: (defId: number) => void;
  setSelectedEra: (era: number) => void;
  setActiveUnits: (units: ActiveUnit[]) => void;
  setActiveEnemies: (enemies: ActiveEnemy[]) => void;
  setActiveBoss: (boss: ActiveBoss | null) => void;
  applyUpgrade: (upgradeId: number) => void;
  addKill: (reward: number, isBoss: boolean) => void;
  addNotification: (text: string, type?: 'info' | 'warn' | 'danger' | 'success') => void;
  removeNotification: (id: string) => void;
  resetGame: () => void;
  recordDamageDealt: (dmg: number) => void;
  recordDamageTaken: (dmg: number) => void;
}

export interface Notification {
  id: string;
  text: string;
  type: 'info' | 'warn' | 'danger' | 'success';
  createdAt: number;
}

const defaultPlayer: PlayerState = {
  hp: 100, maxHp: 100,
  x: 0, y: 1.7, z: -5,
  yaw: 0, pitch: 0,
  speed: 5.0,
  damage: 25,
  ammo: 30, maxAmmo: 30,
  isReloading: false, reloadProgress: 0,
  specialCooldown: 0, specialMaxCooldown: 60,
};

const defaultTower: TowerState = {
  hp: 2000, maxHp: 2000, regen: 0,
};

const defaultWave: WaveState = {
  current: 0, total: 100,
  enemiesLeft: 0, enemiesTotal: 0,
  isBossWave: false, timeToNext: 5,
};

const defaultStats: GameStats = {
  kills: 0, bossKills: 0, goldEarned: 0,
  wavesCompleted: 0, damageDealt: 0, damageTaken: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'menu',
  player: defaultPlayer,
  tower: defaultTower,
  upgrades: { levels: new Array(10).fill(0) },
  wave: defaultWave,
  gold: 200,
  score: 0,
  stats: defaultStats,
  activeUnits: [],
  activeEnemies: [],
  activeBoss: null,
  selectedUnitDefId: 1,
  selectedEra: 0,
  unitLimit: 10,
  goldMultiplier: 1.0,
  unitDamageMultiplier: 1.0,
  unitAttackSpeedMultiplier: 1.0,
  unitHpMultiplier: 1.0,
  unitSpeedMultiplier: 1.0,
  unitCostMultiplier: 1.0,
  notifications: [],

  setPhase: (phase) => set({ phase }),
  setPlayer: (p) => set((s) => ({ player: { ...s.player, ...p } })),
  setTower: (t) => set((s) => ({ tower: { ...s.tower, ...t } })),
  setWave: (w) => set((s) => ({ wave: { ...s.wave, ...w } })),

  addGold: (amount) => set((s) => {
    const earned = Math.floor(amount * s.goldMultiplier);
    return { gold: s.gold + earned, stats: { ...s.stats, goldEarned: s.stats.goldEarned + earned } };
  }),
  spendGold: (amount) => {
    const s = get();
    if (s.gold < amount) return false;
    set({ gold: s.gold - amount });
    return true;
  },
  addScore: (amount) => set((s) => ({ score: s.score + amount })),

  setSelectedUnit: (defId) => set({ selectedUnitDefId: defId }),
  setSelectedEra: (era) => set({ selectedEra: era }),
  setActiveUnits: (activeUnits) => set({ activeUnits }),
  setActiveEnemies: (activeEnemies) => set({ activeEnemies }),
  setActiveBoss: (activeBoss) => set({ activeBoss }),

  applyUpgrade: (upgradeId) => {
    const s = get();
    const levels = [...s.upgrades.levels];
    levels[upgradeId]++;
    const newState: Partial<GameStore> = { upgrades: { levels } };
    // Apply effects
    if (upgradeId === 0) newState.player = { ...s.player, speed: defaultPlayer.speed + levels[0] * 0.5 };
    if (upgradeId === 1) newState.player = { ...s.player, maxHp: defaultPlayer.maxHp + levels[1] * 25 };
    if (upgradeId === 2) newState.player = { ...s.player, damage: defaultPlayer.damage + levels[2] * 15 };
    if (upgradeId === 3) newState.tower = { ...s.tower, maxHp: defaultTower.maxHp + levels[3] * 500, regen: levels[3] * 5 };
    if (upgradeId === 4) newState.unitLimit = 10 + levels[4] * 2;
    if (upgradeId === 5) newState.goldMultiplier = 1.0 + levels[5] * 0.1;
    if (upgradeId === 6) {
      newState.unitDamageMultiplier = 1.0 + levels[6] * 0.08;
      newState.unitAttackSpeedMultiplier = 1.0 + levels[6] * 0.06;
    }
    if (upgradeId === 7) newState.unitHpMultiplier = 1.0 + levels[7] * 0.12;
    if (upgradeId === 8) {
      newState.unitSpeedMultiplier = 1.0 + levels[8] * 0.1;
      newState.unitCostMultiplier = 1.0 - levels[8] * 0.05;
    }
    set(newState);
  },

  addKill: (reward, isBoss) => {
    set((s) => ({
      stats: {
        ...s.stats,
        kills: s.stats.kills + 1,
        bossKills: s.stats.bossKills + (isBoss ? 1 : 0),
      },
      score: s.score + reward * 10,
    }));
    get().addGold(reward);
  },

  addNotification: (text, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({
      notifications: [...s.notifications.slice(-4), { id, text, type, createdAt: Date.now() }],
    }));
    setTimeout(() => get().removeNotification(id), 3000);
  },
  removeNotification: (id) => set((s) => ({
    notifications: s.notifications.filter((n) => n.id !== id),
  })),

  recordDamageDealt: (dmg) => set((s) => ({ stats: { ...s.stats, damageDealt: s.stats.damageDealt + dmg } })),
  recordDamageTaken: (dmg) => set((s) => ({ stats: { ...s.stats, damageTaken: s.stats.damageTaken + dmg } })),

  resetGame: () => set({
    phase: 'menu',
    player: defaultPlayer,
    tower: defaultTower,
    upgrades: { levels: new Array(10).fill(0) },
    wave: defaultWave,
    gold: 200,
    score: 0,
    stats: defaultStats,
    activeUnits: [],
    activeEnemies: [],
    activeBoss: null,
    selectedUnitDefId: 1,
    selectedEra: 0,
    unitLimit: 10,
    goldMultiplier: 1.0,
    unitDamageMultiplier: 1.0,
    unitAttackSpeedMultiplier: 1.0,
    unitHpMultiplier: 1.0,
    unitSpeedMultiplier: 1.0,
    unitCostMultiplier: 1.0,
    notifications: [],
  }),
}));

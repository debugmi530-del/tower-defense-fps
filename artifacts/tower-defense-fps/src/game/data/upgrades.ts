export interface UpgradeDef {
  id: number;
  name: string;
  icon: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  effects: UpgradeEffect[];
}

export interface UpgradeEffect {
  stat: string;
  valuePerLevel: number;
  type: 'additive' | 'multiplicative' | 'absolute';
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: 0,
    name: 'Скорость героя',
    icon: '⚡',
    description: 'Увеличивает скорость передвижения героя',
    maxLevel: 10,
    baseCost: 100,
    costMultiplier: 1.5,
    effects: [{ stat: 'playerSpeed', valuePerLevel: 0.5, type: 'additive' }],
  },
  {
    id: 1,
    name: 'Здоровье героя',
    icon: '❤️',
    description: 'Увеличивает максимальное HP героя',
    maxLevel: 10,
    baseCost: 120,
    costMultiplier: 1.6,
    effects: [{ stat: 'playerMaxHp', valuePerLevel: 25, type: 'additive' }],
  },
  {
    id: 2,
    name: 'Урон оружия',
    icon: '🔫',
    description: 'Личное оружие героя наносит больше урона',
    maxLevel: 10,
    baseCost: 150,
    costMultiplier: 1.7,
    effects: [{ stat: 'playerDamage', valuePerLevel: 15, type: 'additive' }],
  },
  {
    id: 3,
    name: 'Крепость башни',
    icon: '🏰',
    description: 'Башня становится прочнее и регенерирует HP',
    maxLevel: 8,
    baseCost: 200,
    costMultiplier: 2.0,
    effects: [
      { stat: 'towerMaxHp', valuePerLevel: 500, type: 'additive' },
      { stat: 'towerRegen', valuePerLevel: 5, type: 'additive' },
    ],
  },
  {
    id: 4,
    name: 'Командный лимит',
    icon: '⚔️',
    description: 'Можно развернуть больше боевых единиц',
    maxLevel: 10,
    baseCost: 250,
    costMultiplier: 2.0,
    effects: [{ stat: 'unitLimit', valuePerLevel: 2, type: 'additive' }],
  },
  {
    id: 5,
    name: 'Золотая жила',
    icon: '💰',
    description: 'Получать больше золота за каждого убитого врага',
    maxLevel: 10,
    baseCost: 180,
    costMultiplier: 1.8,
    effects: [{ stat: 'goldMultiplier', valuePerLevel: 0.1, type: 'additive' }],
  },
  {
    id: 6,
    name: 'Боевой дух',
    icon: '🗡️',
    description: 'Все юниты атакуют быстрее и наносят больше урона',
    maxLevel: 8,
    baseCost: 300,
    costMultiplier: 2.2,
    effects: [
      { stat: 'unitDamageMultiplier', valuePerLevel: 0.08, type: 'additive' },
      { stat: 'unitAttackSpeedMultiplier', valuePerLevel: 0.06, type: 'additive' },
    ],
  },
  {
    id: 7,
    name: 'Броня армии',
    icon: '🛡️',
    description: 'Все юниты получают больше HP и устойчивее к урону',
    maxLevel: 8,
    baseCost: 280,
    costMultiplier: 2.1,
    effects: [{ stat: 'unitHpMultiplier', valuePerLevel: 0.12, type: 'additive' }],
  },
  {
    id: 8,
    name: 'Логистика',
    icon: '🚀',
    description: 'Юниты двигаются быстрее, стоят дешевле',
    maxLevel: 8,
    baseCost: 220,
    costMultiplier: 1.9,
    effects: [
      { stat: 'unitSpeedMultiplier', valuePerLevel: 0.1, type: 'additive' },
      { stat: 'unitCostMultiplier', valuePerLevel: -0.05, type: 'additive' },
    ],
  },
  {
    id: 9,
    name: 'Специальная способность',
    icon: '💥',
    description: 'Разблокирует и усиливает тактическую суперспособность: нанесение огромного AoE-урона',
    maxLevel: 5,
    baseCost: 500,
    costMultiplier: 3.0,
    effects: [
      { stat: 'specialDamage', valuePerLevel: 1000, type: 'additive' },
      { stat: 'specialRadius', valuePerLevel: 5, type: 'additive' },
      { stat: 'specialCooldown', valuePerLevel: -10, type: 'additive' },
    ],
  },
];

export function getUpgradeCost(upgrade: UpgradeDef, currentLevel: number): number {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
}

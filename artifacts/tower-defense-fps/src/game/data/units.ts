export type Era = 'medieval' | 'renaissance' | 'industrial' | 'ww2' | 'modern' | 'scifi';

export interface UnitDef {
  id: number;
  name: string;
  era: Era;
  cost: number;
  damage: number;
  range: number;
  hp: number;
  speed: number;
  attackSpeed: number; // attacks per second
  color: string; // hex color for material
  size: [number, number, number]; // w, h, d
  isAoE: boolean;
  aoeRadius?: number;
  isFlying?: boolean;
  isSupport?: boolean;
  description: string;
}

export const UNITS: UnitDef[] = [
  // MEDIEVAL (0-7)
  { id: 0, name: 'Крестьянин', era: 'medieval', cost: 25, damage: 8, range: 2, hp: 60, speed: 2.0, attackSpeed: 1.2, color: '#8B6914', size: [0.6, 1.2, 0.6], isAoE: false, description: 'Дешёвый ближний бой' },
  { id: 1, name: 'Мечник', era: 'medieval', cost: 60, damage: 22, range: 2.5, hp: 120, speed: 2.5, attackSpeed: 1.5, color: '#C0C0C0', size: [0.7, 1.4, 0.7], isAoE: false, description: 'Сбалансированный ближний бой' },
  { id: 2, name: 'Рыцарь', era: 'medieval', cost: 150, damage: 45, range: 2.5, hp: 280, speed: 1.8, attackSpeed: 0.9, color: '#708090', size: [0.8, 1.6, 0.8], isAoE: false, description: 'Тяжёлый броненосец' },
  { id: 3, name: 'Лучник', era: 'medieval', cost: 50, damage: 18, range: 14, hp: 80, speed: 2.2, attackSpeed: 1.8, color: '#556B2F', size: [0.6, 1.3, 0.6], isAoE: false, description: 'Дальний лёгкий урон' },
  { id: 4, name: 'Арбалетчик', era: 'medieval', cost: 90, damage: 35, range: 16, hp: 100, speed: 2.0, attackSpeed: 1.0, color: '#4A412A', size: [0.6, 1.3, 0.6], isAoE: false, description: 'Средний дальний урон' },
  { id: 5, name: 'Баллиста', era: 'medieval', cost: 200, damage: 120, range: 30, hp: 200, speed: 0.5, attackSpeed: 0.4, color: '#654321', size: [1.4, 1.0, 2.0], isAoE: false, description: 'Осадное орудие, высокий урон' },
  { id: 6, name: 'Требушет', era: 'medieval', cost: 280, damage: 200, range: 35, hp: 180, speed: 0.3, attackSpeed: 0.25, color: '#8B4513', size: [1.8, 2.0, 2.4], isAoE: true, aoeRadius: 4, description: 'Осадное AoE-орудие' },
  { id: 7, name: 'Паладин', era: 'medieval', cost: 220, damage: 35, range: 3.0, hp: 350, speed: 2.0, attackSpeed: 1.0, color: '#FFD700', size: [0.8, 1.7, 0.8], isAoE: false, isSupport: true, description: 'Усиливает союзников' },

  // RENAISSANCE (8-13)
  { id: 8, name: 'Пикинёр', era: 'renaissance', cost: 70, damage: 28, range: 3.5, hp: 130, speed: 2.3, attackSpeed: 1.3, color: '#8B0000', size: [0.65, 1.4, 0.65], isAoE: false, description: 'Против кавалерии' },
  { id: 9, name: 'Мушкетёр', era: 'renaissance', cost: 110, damage: 50, range: 20, hp: 110, speed: 2.4, attackSpeed: 0.8, color: '#191970', size: [0.65, 1.4, 0.65], isAoE: false, description: 'Ранний огнестрел' },
  { id: 10, name: 'Гренадёр', era: 'renaissance', cost: 160, damage: 85, range: 12, hp: 130, speed: 2.1, attackSpeed: 0.6, color: '#B22222', size: [0.7, 1.5, 0.7], isAoE: true, aoeRadius: 3.5, description: 'Метает гранаты' },
  { id: 11, name: 'Пушка', era: 'renaissance', cost: 320, damage: 250, range: 40, hp: 250, speed: 0.4, attackSpeed: 0.3, color: '#2F4F4F', size: [1.6, 1.0, 2.2], isAoE: true, aoeRadius: 5, description: 'Тяжёлая артиллерия' },
  { id: 12, name: 'Гусар', era: 'renaissance', cost: 180, damage: 40, range: 3, hp: 200, speed: 5.0, attackSpeed: 2.0, color: '#800080', size: [0.8, 1.6, 1.4], isAoE: false, description: 'Быстрая кавалерия' },
  { id: 13, name: 'Бомбарда', era: 'renaissance', cost: 400, damage: 350, range: 45, hp: 300, speed: 0.2, attackSpeed: 0.2, color: '#363636', size: [2.0, 1.2, 2.6], isAoE: true, aoeRadius: 6, description: 'Сверхтяжёлая осадная пушка' },

  // INDUSTRIAL (14-19)
  { id: 14, name: 'Стрелок', era: 'industrial', cost: 100, damage: 45, range: 22, hp: 120, speed: 2.8, attackSpeed: 2.0, color: '#556B2F', size: [0.65, 1.4, 0.65], isAoE: false, description: 'Быстрый дальний урон' },
  { id: 15, name: 'Пулемётчик', era: 'industrial', cost: 250, damage: 30, range: 18, hp: 160, speed: 1.5, attackSpeed: 5.0, color: '#4682B4', size: [0.8, 1.5, 0.8], isAoE: false, description: 'Очень быстрая стрельба' },
  { id: 16, name: 'Артиллерия', era: 'industrial', cost: 380, damage: 300, range: 50, hp: 220, speed: 0.6, attackSpeed: 0.35, color: '#6B6B6B', size: [1.8, 1.2, 2.4], isAoE: true, aoeRadius: 6, description: 'Дальнобойная AoE' },
  { id: 17, name: 'Огнемётчик', era: 'industrial', cost: 200, damage: 60, range: 8, hp: 140, speed: 2.0, attackSpeed: 6.0, color: '#FF4500', size: [0.7, 1.4, 0.7], isAoE: true, aoeRadius: 2.5, description: 'Ближний AoE огонь' },
  { id: 18, name: 'Снайпер', era: 'industrial', cost: 300, damage: 400, range: 80, hp: 100, speed: 2.0, attackSpeed: 0.3, color: '#2E4A1E', size: [0.6, 1.4, 0.6], isAoE: false, description: 'Экстремальная дальность' },
  { id: 19, name: 'Сапёр', era: 'industrial', cost: 180, damage: 200, range: 5, hp: 90, speed: 2.5, attackSpeed: 0.2, color: '#DAA520', size: [0.65, 1.3, 0.65], isAoE: true, aoeRadius: 4, description: 'Устанавливает мины' },

  // WW2 (20-24)
  { id: 20, name: 'Пулемётный расчёт', era: 'ww2', cost: 200, damage: 25, range: 25, hp: 180, speed: 1.2, attackSpeed: 8.0, color: '#556B2F', size: [1.2, 1.0, 1.0], isAoE: false, description: 'Подавляющий огонь' },
  { id: 21, name: 'Танк', era: 'ww2', cost: 600, damage: 180, range: 30, hp: 800, speed: 3.0, attackSpeed: 0.6, color: '#4F5E30', size: [2.0, 1.2, 3.0], isAoE: true, aoeRadius: 3, description: 'Бронированный монстр' },
  { id: 22, name: 'Биплан', era: 'ww2', cost: 450, damage: 80, range: 35, hp: 250, speed: 8.0, attackSpeed: 3.0, color: '#8B7355', size: [2.4, 0.8, 1.6], isAoE: false, isFlying: true, description: 'Воздушная атака' },
  { id: 23, name: 'Миномёт', era: 'ww2', cost: 280, damage: 160, range: 35, hp: 120, speed: 0.8, attackSpeed: 0.7, color: '#696969', size: [0.9, 1.0, 0.9], isAoE: true, aoeRadius: 5, description: 'Навесной AoE огонь' },
  { id: 24, name: 'Коммандос', era: 'ww2', cost: 350, damage: 90, range: 15, hp: 160, speed: 4.0, attackSpeed: 3.0, color: '#2F4F4F', size: [0.65, 1.4, 0.65], isAoE: false, description: 'Быстрый и смертоносный' },

  // MODERN (25-31)
  { id: 25, name: 'Штурмовик', era: 'modern', cost: 250, damage: 70, range: 28, hp: 200, speed: 3.2, attackSpeed: 4.0, color: '#708090', size: [0.7, 1.5, 0.7], isAoE: false, description: 'Современный солдат' },
  { id: 26, name: 'РПГ-расчёт', era: 'modern', cost: 320, damage: 350, range: 30, hp: 160, speed: 2.5, attackSpeed: 0.5, color: '#6B8E23', size: [0.8, 1.5, 0.8], isAoE: true, aoeRadius: 4, description: 'Противотанковые ракеты' },
  { id: 27, name: 'Боевой танк', era: 'modern', cost: 900, damage: 280, range: 40, hp: 1500, speed: 3.5, attackSpeed: 0.8, color: '#4A5240', size: [2.4, 1.4, 3.5], isAoE: true, aoeRadius: 4, description: 'Тяжёлый основной танк' },
  { id: 28, name: 'Вертолёт', era: 'modern', cost: 750, damage: 120, range: 45, hp: 500, speed: 10.0, attackSpeed: 5.0, color: '#3C3C3C', size: [2.8, 1.0, 2.0], isAoE: false, isFlying: true, description: 'Ударный вертолёт' },
  { id: 29, name: 'Рой дронов', era: 'modern', cost: 400, damage: 40, range: 20, hp: 80, speed: 6.0, attackSpeed: 8.0, color: '#1C1C1C', size: [0.4, 0.4, 0.4], isAoE: false, isFlying: true, description: '5 атакующих дронов' },
  { id: 30, name: 'Ракетная батарея', era: 'modern', cost: 1200, damage: 500, range: 70, hp: 400, speed: 0.5, attackSpeed: 0.4, color: '#2F4F4F', size: [2.2, 2.0, 2.6], isAoE: true, aoeRadius: 8, description: 'Дальнобойные ракеты' },
  { id: 31, name: 'ЭМИ-специалист', era: 'modern', cost: 500, damage: 15, range: 25, hp: 150, speed: 2.5, attackSpeed: 1.0, color: '#4169E1', size: [0.7, 1.5, 0.7], isAoE: true, aoeRadius: 10, isSupport: true, description: 'Оглушает врагов' },

  // SCI-FI (32-39)
  { id: 32, name: 'Энергетический стрелок', era: 'scifi', cost: 350, damage: 90, range: 32, hp: 220, speed: 3.5, attackSpeed: 6.0, color: '#00BFFF', size: [0.7, 1.5, 0.7], isAoE: false, description: 'Быстрый энергетический огонь' },
  { id: 33, name: 'Экзоскелет', era: 'scifi', cost: 700, damage: 150, range: 5, hp: 800, speed: 3.0, attackSpeed: 2.5, color: '#7B68EE', size: [0.9, 1.8, 0.9], isAoE: false, description: 'Тяжёлая силовая броня' },
  { id: 34, name: 'Лазерная турель', era: 'scifi', cost: 500, damage: 200, range: 50, hp: 300, speed: 0, attackSpeed: 2.0, color: '#FF0000', size: [1.0, 1.5, 1.0], isAoE: false, description: 'Стационарная турель' },
  { id: 35, name: 'Шагающий мех', era: 'scifi', cost: 1500, damage: 350, range: 35, hp: 2000, speed: 4.0, attackSpeed: 1.5, color: '#8A2BE2', size: [1.6, 3.0, 1.6], isAoE: true, aoeRadius: 5, description: 'Мобильная боевая платформа' },
  { id: 36, name: 'Щитовой генератор', era: 'scifi', cost: 800, damage: 0, range: 15, hp: 400, speed: 2.0, attackSpeed: 0, color: '#00FF7F', size: [0.8, 1.6, 0.8], isAoE: false, isSupport: true, description: 'Щит для союзников' },
  { id: 37, name: 'Плазменная пушка', era: 'scifi', cost: 1100, damage: 600, range: 40, hp: 350, speed: 0.8, attackSpeed: 0.5, color: '#FF00FF', size: [1.4, 1.0, 2.0], isAoE: true, aoeRadius: 6, description: 'Сверхмощное плазменное орудие' },
  { id: 38, name: 'Нано-рой', era: 'scifi', cost: 900, damage: 50, range: 20, hp: 150, speed: 8.0, attackSpeed: 20.0, color: '#00FFFF', size: [0.3, 0.3, 0.3], isAoE: false, description: 'Самовосстанавливающийся рой' },
  { id: 39, name: 'Орбитальный удар', era: 'scifi', cost: 2500, damage: 5000, range: 100, hp: 500, speed: 0, attackSpeed: 0.05, color: '#FFFFFF', size: [1.0, 1.0, 1.0], isAoE: true, aoeRadius: 15, description: 'Вызывает удар с орбиты' },
];

export const ERA_NAMES: Record<Era, string> = {
  medieval: 'Средневековье',
  renaissance: 'Ренессанс',
  industrial: 'Индустриальная',
  ww2: 'Мировые войны',
  modern: 'Современность',
  scifi: 'Sci-Fi',
};

export const ERA_COLORS: Record<Era, string> = {
  medieval: '#8B6914',
  renaissance: '#8B0000',
  industrial: '#4682B4',
  ww2: '#556B2F',
  modern: '#708090',
  scifi: '#7B68EE',
};

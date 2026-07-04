export interface BossDef {
  id: number;
  name: string;
  wave: number; // appears at this wave
  hp: number;
  speed: number;
  damage: number;
  reward: number;
  color: string;
  size: [number, number, number];
  abilities: string[];
  isFlying?: boolean;
  description: string;
  lore: string;
}

export const BOSSES: BossDef[] = [
  {
    id: 0, name: 'КОРОЛЬ НЕЖИТИ', wave: 5,
    hp: 3000, speed: 1.5, damage: 80, reward: 300,
    color: '#8B008B', size: [1.4, 2.2, 1.4],
    abilities: ['resurrect', 'death_wave'],
    description: 'Поднимает павших врагов',
    lore: 'Правит тёмным королевством уже тысячу лет.'
  },
  {
    id: 1, name: 'ОГНЕДЫШАЩИЙ ДРАКОН', wave: 10,
    hp: 6000, speed: 3.0, damage: 150, reward: 600,
    color: '#8B0000', size: [3.0, 2.0, 4.0],
    abilities: ['fire_breath', 'fly_charge'],
    isFlying: true,
    description: 'Летает и сжигает всё вокруг',
    lore: 'Древнейший дракон, уснувший на тысячелетие.'
  },
  {
    id: 2, name: 'КАМЕННЫЙ КОЛОСС', wave: 15,
    hp: 12000, speed: 0.8, damage: 200, reward: 900,
    color: '#696969', size: [2.5, 4.0, 2.5],
    abilities: ['earthquake', 'boulder_throw', 'ground_slam'],
    description: 'Живая скала. Почти неуязвим.',
    lore: 'Создан богами как страж подземного мира.'
  },
  {
    id: 3, name: 'ВЕЛИКИЙ ЛИЧ', wave: 20,
    hp: 8000, speed: 2.0, damage: 180, reward: 800,
    color: '#4B0082', size: [1.2, 2.5, 1.2],
    isFlying: true,
    abilities: ['soul_drain', 'army_of_dead', 'bone_prison'],
    description: 'Некромант с армией мертвецов',
    lore: 'Когда-то был великим магом. Теперь ищет лишь смерть.'
  },
  {
    id: 4, name: 'ЖЕЛЕЗНЫЙ ГОЛЕМ', wave: 25,
    hp: 18000, speed: 1.0, damage: 300, reward: 1200,
    color: '#2F4F4F', size: [2.8, 4.5, 2.8],
    abilities: ['laser_beam', 'rocket_fist', 'magnetic_pull'],
    description: 'Промышленный механический монстр',
    lore: 'Построен безумным инженером для одной цели — разрушения.'
  },
  {
    id: 5, name: 'МОРСКОЙ ЛЕВИАФАН', wave: 30,
    hp: 25000, speed: 2.5, damage: 250, reward: 1500,
    color: '#006994', size: [4.0, 2.5, 6.0],
    abilities: ['tsunami', 'swallow_whole', 'poison_mist'],
    description: 'Чудовище из глубин появилось на суше',
    lore: 'Всплыл из бездны, привлечённый запахом крови.'
  },
  {
    id: 6, name: 'АРХИДЕМОН МОЛОХА', wave: 35,
    hp: 20000, speed: 3.0, damage: 350, reward: 2000,
    color: '#B22222', size: [2.0, 3.5, 2.0],
    isFlying: true,
    abilities: ['hellfire_rain', 'possession', 'inferno_aura'],
    description: 'Командующий армиями Ада',
    lore: 'Вырвался из Преисподней после тысячи лет заточения.'
  },
  {
    id: 7, name: 'ВОЕННАЯ МАШИНА', wave: 40,
    hp: 35000, speed: 2.0, damage: 400, reward: 2500,
    color: '#4A5240', size: [4.0, 3.5, 5.0],
    abilities: ['artillery_barrage', 'emp_burst', 'spawn_drones', 'shield_module'],
    description: 'Автономный боевой комплекс',
    lore: 'ИИ решил, что человечество — ошибка.'
  },
  {
    id: 8, name: 'НЕЙРО-УЛЬЕЙ', wave: 45,
    hp: 28000, speed: 1.5, damage: 300, reward: 2200,
    color: '#8B4513', size: [3.5, 3.0, 4.5],
    abilities: ['spawn_swarm', 'psychic_blast', 'assimilate'],
    description: 'Коллективный разум тысяч насекомых',
    lore: 'Единый организм, работающий как суперкомпьютер.'
  },
  {
    id: 9, name: 'ЯДЕРНЫЙ КОЛОСС', wave: 50,
    hp: 50000, speed: 1.5, damage: 500, reward: 3500,
    color: '#006400', size: [3.5, 5.0, 3.5],
    abilities: ['nuclear_blast', 'radiation_field', 'self_repair', 'missile_storm'],
    description: 'Ходячая ядерная бомба',
    lore: 'Реактор разрушен, контроль утерян. Теперь просто идёт вперёд.'
  },
  {
    id: 10, name: 'ПРИШЕЛЕЦ-ЗАХВАТЧИК', wave: 55,
    hp: 40000, speed: 3.5, damage: 450, reward: 3000,
    color: '#7FFF00', size: [2.5, 3.0, 3.0],
    isFlying: true,
    abilities: ['abduct', 'plasma_cannon', 'mind_control', 'teleport'],
    description: 'Командующий флотом вторжения',
    lore: 'Прилетел из другой галактики. Земля — лишь первая остановка.'
  },
  {
    id: 11, name: 'БИОМЕХА-ТИТАН', wave: 60,
    hp: 60000, speed: 2.5, damage: 600, reward: 4000,
    color: '#556B2F', size: [4.0, 5.5, 4.0],
    abilities: ['bio_cannon', 'regenerate', 'spawn_biomechs', 'acid_spray'],
    description: 'Слияние органики и машины в невероятном масштабе',
    lore: 'Создан инопланетной расой как биологическое оружие.'
  },
  {
    id: 12, name: 'КВАНТОВЫЙ РАЗРУШИТЕЛЬ', wave: 65,
    hp: 45000, speed: 5.0, damage: 550, reward: 3800,
    color: '#00FFFF', size: [2.0, 2.0, 2.0],
    isFlying: true,
    abilities: ['quantum_phase', 'time_slow', 'duplicate', 'quantum_explosion'],
    description: 'Существо из другого измерения',
    lore: 'Разрушает законы физики одним своим присутствием.'
  },
  {
    id: 13, name: 'КОСМИЧЕСКИЙ КИТ', wave: 70,
    hp: 80000, speed: 1.8, damage: 700, reward: 5000,
    color: '#191970', size: [6.0, 3.0, 10.0],
    isFlying: true,
    abilities: ['gravity_crush', 'cosmic_ray', 'void_aura', 'spawn_parasites'],
    description: 'Живое существо размером с космический корабль',
    lore: 'Путешествует между звёздами, пожирая планеты.'
  },
  {
    id: 14, name: 'ПОВЕЛИТЕЛЬ ХАОСА', wave: 75,
    hp: 70000, speed: 4.0, damage: 800, reward: 6000,
    color: '#FF00FF', size: [3.0, 4.0, 3.0],
    isFlying: true,
    abilities: ['chaos_storm', 'reality_warp', 'summon_avatars', 'entropy_blast'],
    description: 'Воплощение чистого хаоса вселенной',
    lore: 'Не существо — это сам Хаос, принявший форму.'
  },
  {
    id: 15, name: 'ТЁМНАЯ ЗВЕЗДА', wave: 80,
    hp: 100000, speed: 2.0, damage: 1000, reward: 8000,
    color: '#000000', size: [5.0, 5.0, 5.0],
    isFlying: true,
    abilities: ['stellar_collapse', 'gravity_well', 'dark_matter_burst', 'absorb_attacks'],
    description: 'Живой фрагмент умирающей звезды',
    lore: 'Когда звезда умирает, она рождает монстра.'
  },
  {
    id: 16, name: 'МАТЬ РОЯ', wave: 85,
    hp: 90000, speed: 1.0, damage: 800, reward: 7000,
    color: '#8B0000', size: [5.0, 4.0, 6.0],
    abilities: ['endless_spawn', 'acid_flood', 'cocoon_allies', 'telepathic_control'],
    description: 'Матка, порождающая армии',
    lore: 'Её потомки заполнили уже сто планет.'
  },
  {
    id: 17, name: 'ХРОНО-ТИРАН', wave: 90,
    hp: 120000, speed: 3.5, damage: 1200, reward: 10000,
    color: '#FFD700', size: [3.5, 4.5, 3.5],
    abilities: ['time_rewind', 'age_attack', 'temporal_clone', 'freeze_zone'],
    description: 'Повелитель времени — видит прошлое и будущее',
    lore: 'Пришёл из конца времён, чтобы предотвратить своё рождение.'
  },
  {
    id: 18, name: 'НЕЙРО-БОГ', wave: 95,
    hp: 200000, speed: 2.0, damage: 1500, reward: 15000,
    color: '#7B68EE', size: [6.0, 6.0, 6.0],
    isFlying: true,
    abilities: ['mind_shatter', 'avatar_army', 'neural_storm', 'godlike_shield', 'reality_delete'],
    description: 'Объединённый разум миллиарда существ',
    lore: 'Планета, ставшая сознательной и злой.'
  },
  {
    id: 19, name: 'ΟΜΕGA — КОНЕЦ ВСЕГО', wave: 100,
    hp: 500000, speed: 3.0, damage: 3000, reward: 50000,
    color: '#FF0000', size: [8.0, 8.0, 8.0],
    isFlying: true,
    abilities: ['apocalypse_wave', 'dimensional_tear', 'absorb_all', 'respawn_once', 'final_countdown', 'stellar_annihilation'],
    description: 'ФИНАЛЬНЫЙ БОСС. Конец существования.',
    lore: 'Оно существовало до Вселенной и переживёт её конец.'
  },
];

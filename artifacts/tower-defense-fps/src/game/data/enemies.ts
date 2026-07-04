export interface EnemyDef {
  id: number;
  name: string;
  tier: number; // 1-10
  hp: number;
  speed: number;
  damage: number; // damage to tower per hit
  reward: number; // gold on kill
  color: string;
  size: [number, number, number];
  isFlying?: boolean;
  isBoss?: boolean;
  isArmored?: boolean;
  abilities?: string[];
  description: string;
}

export const ENEMIES: EnemyDef[] = [
  // TIER 1 — Нежить (Wave 1-5)
  { id: 0, name: 'Скелет', tier: 1, hp: 40, speed: 2.0, damage: 5, reward: 3, color: '#D2D2D2', size: [0.5, 1.2, 0.5], description: 'Базовый нежить' },
  { id: 1, name: 'Зомби', tier: 1, hp: 70, speed: 1.2, damage: 8, reward: 5, color: '#556B2F', size: [0.6, 1.3, 0.6], description: 'Медленный, но живучий' },
  { id: 2, name: 'Призрак', tier: 1, hp: 30, speed: 3.5, damage: 6, reward: 6, color: '#B0C4DE', size: [0.5, 1.4, 0.5], isFlying: true, description: 'Летающий быстрый' },
  { id: 3, name: 'Вурдалак', tier: 1, hp: 90, speed: 2.5, damage: 10, reward: 8, color: '#8B0000', size: [0.6, 1.4, 0.6], description: 'Восстанавливает HP' },
  { id: 4, name: 'Личич', tier: 1, hp: 120, speed: 1.8, damage: 15, reward: 12, color: '#4B0082', size: [0.65, 1.5, 0.65], description: 'Бросает заклятья' },
  { id: 5, name: 'Костяной голем', tier: 1, hp: 200, speed: 1.0, damage: 20, reward: 18, color: '#FFFACD', size: [1.0, 1.8, 1.0], isArmored: true, description: 'Медленный бронированный' },
  { id: 6, name: 'Баньши', tier: 1, hp: 50, speed: 4.0, damage: 8, reward: 10, color: '#E0E0FF', size: [0.5, 1.3, 0.5], isFlying: true, description: 'Быстрый летун' },
  { id: 7, name: 'Нежить-воин', tier: 1, hp: 150, speed: 2.2, damage: 12, reward: 15, color: '#808080', size: [0.7, 1.5, 0.7], isArmored: true, description: 'Тяжёлая броня' },
  { id: 8, name: 'Теневой волк', tier: 1, hp: 80, speed: 4.5, damage: 9, reward: 8, color: '#2F2F2F', size: [0.8, 0.7, 1.2], description: 'Очень быстрый зверь' },
  { id: 9, name: 'Зомби-орда', tier: 1, hp: 35, speed: 2.0, damage: 4, reward: 2, color: '#6B8E23', size: [0.5, 1.1, 0.5], description: 'Появляется группами' },

  // TIER 2 — Гоблины (Wave 6-10)
  { id: 10, name: 'Гоблин-бегун', tier: 2, hp: 80, speed: 4.8, damage: 8, reward: 7, color: '#228B22', size: [0.4, 0.9, 0.4], description: 'Очень быстрый маленький' },
  { id: 11, name: 'Гоблин-воин', tier: 2, hp: 140, speed: 3.0, damage: 15, reward: 12, color: '#32CD32', size: [0.55, 1.1, 0.55], description: 'Сбалансированный' },
  { id: 12, name: 'Гоблин-шаман', tier: 2, hp: 100, speed: 2.5, damage: 12, reward: 15, color: '#9ACD32', size: [0.5, 1.2, 0.5], description: 'Лечит союзников' },
  { id: 13, name: 'Гоблин-метатель', tier: 2, hp: 90, speed: 3.5, damage: 18, reward: 14, color: '#6B8E23', size: [0.5, 1.0, 0.5], description: 'Кидает бомбы' },
  { id: 14, name: 'Хобгоблин', tier: 2, hp: 250, speed: 2.2, damage: 25, reward: 22, color: '#006400', size: [0.8, 1.5, 0.8], isArmored: true, description: 'Большой и злой' },
  { id: 15, name: 'Гоблин-берсерк', tier: 2, hp: 120, speed: 5.0, damage: 20, reward: 18, color: '#DC143C', size: [0.5, 1.1, 0.5], description: 'Ускоряется при ранении' },
  { id: 16, name: 'Гоблин-лучник', tier: 2, hp: 70, speed: 3.0, damage: 10, reward: 10, color: '#2E8B57', size: [0.45, 0.95, 0.45], description: 'Атакует на ходу' },
  { id: 17, name: 'Гоблин-тролль', tier: 2, hp: 350, speed: 1.5, damage: 30, reward: 30, color: '#3CB371', size: [1.0, 1.8, 1.0], isArmored: true, description: 'Регенерирует HP' },
  { id: 18, name: 'Волчий всадник', tier: 2, hp: 180, speed: 5.5, damage: 18, reward: 20, color: '#8FBC8F', size: [0.9, 1.2, 1.4], description: 'Скорость и урон' },
  { id: 19, name: 'Гоблин-сапёр', tier: 2, hp: 100, speed: 2.8, damage: 50, reward: 25, color: '#808000', size: [0.5, 1.0, 0.5], description: 'Взрывается при смерти' },

  // TIER 3 — Орки (Wave 11-15)
  { id: 20, name: 'Орк-пехота', tier: 3, hp: 300, speed: 2.5, damage: 25, reward: 20, color: '#228B22', size: [0.8, 1.6, 0.8], description: 'Крепкий боец' },
  { id: 21, name: 'Орк-вождь', tier: 3, hp: 500, speed: 2.0, damage: 40, reward: 40, color: '#006400', size: [1.0, 1.8, 1.0], isArmored: true, description: 'Усиливает орков рядом' },
  { id: 22, name: 'Орк-шаман', tier: 3, hp: 220, speed: 2.2, damage: 20, reward: 30, color: '#8B4513', size: [0.75, 1.5, 0.75], description: 'Призывает дополнительных' },
  { id: 23, name: 'Орк-берсерк', tier: 3, hp: 280, speed: 4.0, damage: 35, reward: 35, color: '#8B0000', size: [0.9, 1.7, 0.9], description: 'Ярость — двойной урон' },
  { id: 24, name: 'Огр', tier: 3, hp: 800, speed: 1.2, damage: 60, reward: 60, color: '#556B2F', size: [1.4, 2.2, 1.4], isArmored: true, description: 'Огромный медленный танк' },
  { id: 25, name: 'Орк-лучник', tier: 3, hp: 200, speed: 2.8, damage: 22, reward: 25, color: '#2E8B57', size: [0.7, 1.5, 0.7], description: 'Точная стрельба' },
  { id: 26, name: 'Орк-кавалерия', tier: 3, hp: 350, speed: 5.5, damage: 30, reward: 38, color: '#4B5320', size: [1.0, 1.5, 1.6], description: 'Быстрый всадник' },
  { id: 27, name: 'Орк-метатель топоров', tier: 3, hp: 260, speed: 3.0, damage: 28, reward: 28, color: '#808000', size: [0.8, 1.6, 0.8], description: 'Дальняя атака' },
  { id: 28, name: 'Орк-брут', tier: 3, hp: 600, speed: 1.8, damage: 50, reward: 50, color: '#2F4F2F', size: [1.2, 2.0, 1.2], isArmored: true, description: 'Тяжёлая пехота' },
  { id: 29, name: 'Орк-дракончик', tier: 3, hp: 200, speed: 4.5, damage: 25, reward: 35, color: '#6B8E23', size: [0.8, 0.9, 1.4], isFlying: true, description: 'Летающий наездник' },

  // TIER 4 — Тёмные эльфы (Wave 16-20)
  { id: 30, name: 'Тёмный лазутчик', tier: 4, hp: 250, speed: 5.0, damage: 30, reward: 35, color: '#4B0082', size: [0.55, 1.4, 0.55], description: 'Невидимость' },
  { id: 31, name: 'Тёмный воин', tier: 4, hp: 420, speed: 3.5, damage: 40, reward: 40, color: '#6A0DAD', size: [0.7, 1.5, 0.7], isArmored: true, description: 'Магический щит' },
  { id: 32, name: 'Жрица тьмы', tier: 4, hp: 300, speed: 2.8, damage: 35, reward: 50, color: '#800080', size: [0.6, 1.5, 0.6], description: 'Контроль разума' },
  { id: 33, name: 'Тёмный маг', tier: 4, hp: 280, speed: 2.5, damage: 45, reward: 55, color: '#9400D3', size: [0.65, 1.6, 0.65], description: 'AoE магия' },
  { id: 34, name: 'Тёмный рыцарь', tier: 4, hp: 700, speed: 3.0, damage: 55, reward: 65, color: '#483D8B', size: [0.85, 1.7, 0.85], isArmored: true, description: 'Элитная тяжёлая пехота' },
  { id: 35, name: 'Химера', tier: 4, hp: 450, speed: 4.0, damage: 40, reward: 60, color: '#8B008B', size: [1.2, 1.2, 1.8], isFlying: true, description: 'Летающий монстр' },
  { id: 36, name: 'Арахнид', tier: 4, hp: 350, speed: 3.8, damage: 30, reward: 40, color: '#2F2F2F', size: [1.0, 0.7, 1.2], description: 'Яд замедляет' },
  { id: 37, name: 'Тёмный дракон', tier: 4, hp: 900, speed: 3.5, damage: 70, reward: 80, color: '#1C1C1C', size: [1.6, 1.2, 2.4], isFlying: true, description: 'Дышит огнём' },
  { id: 38, name: 'Теневой убийца', tier: 4, hp: 200, speed: 7.0, damage: 35, reward: 45, color: '#36454F', size: [0.5, 1.3, 0.5], description: 'Критические удары' },
  { id: 39, name: 'Гидра', tier: 4, hp: 1200, speed: 1.5, damage: 80, reward: 100, color: '#355E3B', size: [1.8, 1.6, 2.0], description: 'Три головы — три атаки' },

  // TIER 5 — Демоны (Wave 21-30)
  { id: 40, name: 'Имп', tier: 5, hp: 300, speed: 5.5, damage: 30, reward: 40, color: '#8B0000', size: [0.45, 0.9, 0.45], isFlying: true, description: 'Юркий летун' },
  { id: 41, name: 'Демон-воин', tier: 5, hp: 600, speed: 3.2, damage: 55, reward: 55, color: '#B22222', size: [0.9, 1.8, 0.9], isArmored: true, description: 'Адская броня' },
  { id: 42, name: 'Суккуб', tier: 5, hp: 400, speed: 4.5, damage: 45, reward: 60, color: '#C71585', size: [0.6, 1.5, 0.6], isFlying: true, description: 'Очаровывает юниты' },
  { id: 43, name: 'Бес огня', tier: 5, hp: 350, speed: 3.8, damage: 60, reward: 65, color: '#FF4500', size: [0.7, 1.4, 0.7], description: 'AoE огонь' },
  { id: 44, name: 'Балрог', tier: 5, hp: 1500, speed: 2.5, damage: 100, reward: 120, color: '#8B1A1A', size: [1.4, 2.5, 1.4], isArmored: true, description: 'Огненный гигант' },
  { id: 45, name: 'Инкуб', tier: 5, hp: 500, speed: 4.0, damage: 50, reward: 70, color: '#9B1B30', size: [0.7, 1.6, 0.7], description: 'Телепортируется' },
  { id: 46, name: 'Демон хаоса', tier: 5, hp: 800, speed: 3.0, damage: 80, reward: 90, color: '#4A0404', size: [1.0, 2.0, 1.0], description: 'Хаотичные атаки' },
  { id: 47, name: 'Адский пёс', tier: 5, hp: 400, speed: 7.0, damage: 45, reward: 60, color: '#2C0A0A', size: [0.9, 0.9, 1.4], description: 'Быстрейший наземный' },
  { id: 48, name: 'Архидемон', tier: 5, hp: 2000, speed: 2.0, damage: 120, reward: 150, color: '#6B0000', size: [1.2, 2.2, 1.2], isArmored: true, isFlying: true, description: 'Летающий командир' },
  { id: 49, name: 'Тени хаоса', tier: 5, hp: 250, speed: 6.0, damage: 25, reward: 35, color: '#1A0000', size: [0.5, 1.2, 0.5], description: 'Рой теней' },

  // TIER 6 — Машины (Wave 31-40)
  { id: 50, name: 'Боевой дрон', tier: 6, hp: 400, speed: 5.0, damage: 40, reward: 50, color: '#708090', size: [0.6, 0.4, 0.6], isFlying: true, description: 'Быстрый механический' },
  { id: 51, name: 'Шагающий танк', tier: 6, hp: 1000, speed: 2.5, damage: 80, reward: 90, color: '#4F5E30', size: [1.4, 1.6, 1.8], isArmored: true, description: 'Механический гигант' },
  { id: 52, name: 'Турель-паразит', tier: 6, hp: 600, speed: 3.0, damage: 60, reward: 70, color: '#2F4F4F', size: [0.8, 1.0, 0.8], description: 'Стреляет на ходу' },
  { id: 53, name: 'Наземный дрон', tier: 6, hp: 350, speed: 4.8, damage: 35, reward: 45, color: '#696969', size: [0.7, 0.5, 0.9], description: 'Юркий механизм' },
  { id: 54, name: 'Механический страж', tier: 6, hp: 1800, speed: 1.5, damage: 120, reward: 140, color: '#36454F', size: [1.6, 2.4, 1.6], isArmored: true, description: 'Сверхбронированный' },
  { id: 55, name: 'Ракетный дрон', tier: 6, hp: 300, speed: 6.0, damage: 70, reward: 75, color: '#778899', size: [0.5, 0.5, 0.8], isFlying: true, description: 'Ракетная атака' },
  { id: 56, name: 'Электро-паук', tier: 6, hp: 500, speed: 3.5, damage: 55, reward: 60, color: '#4682B4', size: [1.0, 0.7, 1.2], description: 'Парализует ЭМИ' },
  { id: 57, name: 'Тяжёлый экзо-мех', tier: 6, hp: 2500, speed: 1.8, damage: 150, reward: 180, color: '#2E4A1E', size: [2.0, 2.8, 2.0], isArmored: true, description: 'Мобильная крепость' },
  { id: 58, name: 'Сварочный бот', tier: 6, hp: 700, speed: 2.8, damage: 65, reward: 80, color: '#FF4500', size: [0.9, 1.4, 0.9], description: 'Плазменная горелка' },
  { id: 59, name: 'Квадрокоптер-убийца', tier: 6, hp: 450, speed: 7.0, damage: 45, reward: 65, color: '#1C1C1C', size: [0.7, 0.3, 0.7], isFlying: true, description: 'Воздушный терминатор' },

  // TIER 7 — Киборги (Wave 41-50)
  { id: 60, name: 'Аугментированный солдат', tier: 7, hp: 700, speed: 4.0, damage: 70, reward: 80, color: '#4169E1', size: [0.75, 1.6, 0.75], description: 'Киборг-спецназ' },
  { id: 61, name: 'Нейро-снайпер', tier: 7, hp: 500, speed: 3.0, damage: 200, reward: 100, color: '#6495ED', size: [0.7, 1.5, 0.7], description: 'Инстакил одного' },
  { id: 62, name: 'Киборг-танк', tier: 7, hp: 2000, speed: 2.2, damage: 130, reward: 150, color: '#191970', size: [1.2, 1.8, 1.4], isArmored: true, description: 'Живой танк' },
  { id: 63, name: 'Берсерк-киборг', tier: 7, hp: 900, speed: 5.5, damage: 100, reward: 120, color: '#DC143C', size: [0.9, 1.7, 0.9], description: 'Ярость до смерти' },
  { id: 64, name: 'Нано-киборг', tier: 7, hp: 600, speed: 4.5, damage: 80, reward: 90, color: '#00BFFF', size: [0.7, 1.5, 0.7], description: 'Нанорегенерация' },
  { id: 65, name: 'Психо-контроллер', tier: 7, hp: 800, speed: 3.0, damage: 60, reward: 110, color: '#9370DB', size: [0.75, 1.6, 0.75], description: 'Захватывает юниты' },
  { id: 66, name: 'Плазма-воин', tier: 7, hp: 1100, speed: 3.5, damage: 110, reward: 130, color: '#FF00FF', size: [0.85, 1.7, 0.85], description: 'Плазменное оружие' },
  { id: 67, name: 'Прыгающий бот', tier: 7, hp: 750, speed: 6.0, damage: 85, reward: 100, color: '#00FF7F', size: [0.8, 1.4, 0.8], description: 'Прыгает через препятствия' },
  { id: 68, name: 'Кибер-командир', tier: 7, hp: 1500, speed: 2.8, damage: 120, reward: 160, color: '#7B68EE', size: [0.9, 1.8, 0.9], isArmored: true, description: 'Усиливает всех' },
  { id: 69, name: 'Инфекционный нано', tier: 7, hp: 400, speed: 5.0, damage: 40, reward: 70, color: '#00FFFF', size: [0.4, 0.4, 0.4], description: 'Заражает юниты' },

  // TIER 8 — Пришельцы-разведчики (Wave 51-70)
  { id: 70, name: 'Серый разведчик', tier: 8, hp: 900, speed: 5.5, damage: 90, reward: 110, color: '#B0C4DE', size: [0.6, 1.3, 0.6], description: 'Невидимость и телепорт' },
  { id: 71, name: 'Инсектоид', tier: 8, hp: 700, speed: 6.0, damage: 80, reward: 100, color: '#6B8E23', size: [0.8, 0.8, 1.2], description: 'Роевой интеллект' },
  { id: 72, name: 'Скользкий щупалец', tier: 8, hp: 1200, speed: 3.5, damage: 100, reward: 130, color: '#2E8B57', size: [1.0, 1.6, 1.2], description: 'Атакует несколько целей' },
  { id: 73, name: 'Плазмоид', tier: 8, hp: 600, speed: 7.0, damage: 85, reward: 110, color: '#7FFF00', size: [0.7, 0.7, 0.7], isFlying: true, description: 'Шар плазмы' },
  { id: 74, name: 'Кристаллин', tier: 8, hp: 1800, speed: 2.0, damage: 140, reward: 160, color: '#00CED1', size: [1.1, 1.7, 1.1], isArmored: true, description: 'Отражает лазеры' },
  { id: 75, name: 'Пожиратель', tier: 8, hp: 1000, speed: 3.0, damage: 120, reward: 140, color: '#8B008B', size: [1.3, 1.0, 1.6], description: 'Поглощает HP' },
  { id: 76, name: 'Телепат-пришелец', tier: 8, hp: 800, speed: 3.5, damage: 90, reward: 120, color: '#DDA0DD', size: [0.7, 1.4, 0.7], description: 'Парализует телепатией' },
  { id: 77, name: 'Зонд-атакующий', tier: 8, hp: 500, speed: 8.0, damage: 70, reward: 90, color: '#C0C0C0', size: [0.5, 0.5, 0.5], isFlying: true, description: 'Стремительный' },
  { id: 78, name: 'Биомеханоид', tier: 8, hp: 2200, speed: 2.5, damage: 160, reward: 200, color: '#556B2F', size: [1.5, 2.0, 1.5], isArmored: true, description: 'Органика и металл' },
  { id: 79, name: 'Ксеноморф', tier: 8, hp: 1400, speed: 5.0, damage: 130, reward: 170, color: '#1A1A2E', size: [0.9, 1.8, 1.2], description: 'Кислотная кровь' },

  // TIER 9 — Пришельцы-воины (Wave 71-85)
  { id: 80, name: 'Тяжёлый захватчик', tier: 9, hp: 3000, speed: 2.5, damage: 200, reward: 250, color: '#4169E1', size: [1.6, 2.2, 1.6], isArmored: true, description: 'Элитный боец' },
  { id: 81, name: 'Рой микробов', tier: 9, hp: 200, speed: 8.0, damage: 15, reward: 20, color: '#FF1493', size: [0.2, 0.2, 0.2], description: 'Сотни одновременно' },
  { id: 82, name: 'Мозговой слизень', tier: 9, hp: 2000, speed: 1.8, damage: 250, reward: 300, color: '#FF69B4', size: [1.8, 1.2, 2.2], description: 'Захват разума' },
  { id: 83, name: 'Квантовый воин', tier: 9, hp: 1500, speed: 6.0, damage: 180, reward: 250, color: '#00FFFF', size: [0.8, 1.7, 0.8], description: 'Квантовый туннель' },
  { id: 84, name: 'Гравитон', tier: 9, hp: 2500, speed: 2.0, damage: 220, reward: 280, color: '#800000', size: [1.4, 1.4, 1.4], isFlying: true, description: 'Гравитационные волны' },
  { id: 85, name: 'Звёздный пожиратель', tier: 9, hp: 4000, speed: 1.5, damage: 300, reward: 400, color: '#0D0D0D', size: [2.0, 2.0, 2.0], description: 'Поглощает всё' },
  { id: 86, name: 'Тахионный клинок', tier: 9, hp: 1200, speed: 10.0, damage: 160, reward: 220, color: '#FFFF00', size: [0.6, 1.5, 0.6], description: 'Быстрее скорости звука' },
  { id: 87, name: 'Плазменный лорд', tier: 9, hp: 3500, speed: 2.8, damage: 280, reward: 380, color: '#FF4500', size: [1.6, 2.4, 1.6], isArmored: true, isFlying: true, description: 'Огненная стихия' },
  { id: 88, name: 'Нейтронная тень', tier: 9, hp: 1800, speed: 5.5, damage: 200, reward: 300, color: '#2F2F4F', size: [0.7, 1.8, 0.7], description: 'Проходит сквозь стены' },
  { id: 89, name: 'Мегаколония', tier: 9, hp: 1000, speed: 4.0, damage: 100, reward: 150, color: '#556B2F', size: [1.2, 0.8, 1.6], description: 'Разделяется при уроне' },

  // TIER 10 — Космические ужасы (Wave 86-100+)
  { id: 90, name: 'Космический Дракон', tier: 10, hp: 6000, speed: 4.0, damage: 400, reward: 600, color: '#1A0000', size: [2.5, 2.0, 4.0], isFlying: true, description: 'Межзвёздный монстр' },
  { id: 91, name: 'Осколок Хаоса', tier: 10, hp: 4000, speed: 5.0, damage: 350, reward: 500, color: '#FF00FF', size: [1.0, 3.0, 1.0], description: 'Чистая энтропия' },
  { id: 92, name: 'Ктулху-порождение', tier: 10, hp: 8000, speed: 2.0, damage: 500, reward: 800, color: '#0D4F1E', size: [3.0, 3.0, 3.5], description: 'Древний ужас' },
  { id: 93, name: 'Звёздный Лич', tier: 10, hp: 5000, speed: 3.0, damage: 450, reward: 700, color: '#4B0082', size: [1.5, 2.5, 1.5], isFlying: true, description: 'Некромант галактик' },
  { id: 94, name: 'Сингулярность', tier: 10, hp: 3000, speed: 6.0, damage: 300, reward: 500, color: '#000000', size: [1.0, 1.0, 1.0], isFlying: true, description: 'Чёрная дыра' },
  { id: 95, name: 'Вирус-матка', tier: 10, hp: 7000, speed: 1.5, damage: 600, reward: 900, color: '#8B0000', size: [2.8, 2.0, 3.2], description: 'Порождает бесконечно' },
  { id: 96, name: 'Временной разрушитель', tier: 10, hp: 5500, speed: 4.0, damage: 480, reward: 750, color: '#00FFFF', size: [1.8, 2.2, 1.8], isArmored: true, description: 'Обращает время вспять' },
  { id: 97, name: 'Нейронная сеть', tier: 10, hp: 4500, speed: 3.5, damage: 420, reward: 680, color: '#7B68EE', size: [2.0, 1.5, 2.0], description: 'Адаптируется к атакам' },
  { id: 98, name: 'Тёмная материя', tier: 10, hp: 9000, speed: 2.0, damage: 700, reward: 1000, color: '#0A0A0A', size: [2.5, 2.5, 2.5], isFlying: true, description: 'Непробиваемый' },
  { id: 99, name: 'АПОКАЛИПСИС', tier: 10, hp: 15000, speed: 2.5, damage: 1000, reward: 2000, color: '#FF0000', size: [4.0, 4.0, 4.0], isArmored: true, isFlying: true, description: 'Конец всего сущего' },
];

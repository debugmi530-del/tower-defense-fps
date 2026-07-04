import { useGameStore } from '../store/gameStore';
import { UPGRADES, getUpgradeCost } from '../game/data/upgrades';

interface Props { onClose: () => void; }

export default function UpgradeMenu({ onClose }: Props) {
  const gold = useGameStore((s) => s.gold);
  const upgradeLevels = useGameStore((s) => s.upgrades.levels);
  const applyUpgrade = useGameStore((s) => s.applyUpgrade);
  const spendGold = useGameStore((s) => s.spendGold);
  const addNotification = useGameStore((s) => s.addNotification);

  function handleBuy(id: number) {
    const upg = UPGRADES[id];
    const level = upgradeLevels[id];
    if (level >= upg.maxLevel) { addNotification('Максимальный уровень!', 'warn'); return; }
    const cost = getUpgradeCost(upg, level);
    if (!spendGold(cost)) { addNotification('Недостаточно золота!', 'warn'); return; }
    applyUpgrade(id);
    addNotification(`${upg.icon} ${upg.name} → ур. ${level + 1}`, 'success');
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, pointerEvents: 'auto',
    }}>
      <div style={{
        background: 'rgba(15,15,25,0.98)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '2rem', maxWidth: 900, width: '92%',
        boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>⬆ Апгрейды</h2>
            <div style={{ color: '#FFD700', fontSize: '1rem', marginTop: 4 }}>💰 {gold.toLocaleString()} золота</div>
          </div>
          <button onClick={onClose} style={{
            padding: '8px 20px', background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
            color: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
          }}>
            B — Закрыть
          </button>
        </div>

        {/* Upgrades grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {UPGRADES.map((upg) => {
            const level = upgradeLevels[upg.id];
            const cost = getUpgradeCost(upg, level);
            const isMaxed = level >= upg.maxLevel;
            const canAfford = gold >= cost;

            return (
              <div key={upg.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${isMaxed ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 12, padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem' }}>{upg.icon}</div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginTop: 4 }}>{upg.name}</div>
                    <div style={{ color: '#666', fontSize: '0.75rem', marginTop: 2 }}>{upg.description}</div>
                  </div>
                  <LevelPips current={level} max={upg.maxLevel} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: isMaxed ? '#FFD700' : '#888', fontSize: '0.8rem', fontWeight: 600 }}>
                    {isMaxed ? '★ МАКСИМУМ' : `Ур. ${level} / ${upg.maxLevel}`}
                  </div>
                  <button
                    onClick={() => handleBuy(upg.id)}
                    disabled={isMaxed || !canAfford}
                    style={{
                      padding: '6px 16px',
                      background: isMaxed ? 'rgba(255,215,0,0.15)' : canAfford ? 'rgba(124,58,237,0.8)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isMaxed ? 'rgba(255,215,0,0.4)' : canAfford ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 8, color: isMaxed ? '#FFD700' : canAfford ? '#fff' : '#444',
                      fontSize: '0.85rem', fontWeight: 700, cursor: isMaxed || !canAfford ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isMaxed ? '★' : `💰 ${cost.toLocaleString()}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LevelPips({ current, max }: { current: number; max: number }) {
  const show = Math.min(max, 10);
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: 80, justifyContent: 'flex-end' }}>
      {Array.from({ length: show }).map((_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: 2,
          background: i < current ? '#7C3AED' : 'rgba(255,255,255,0.1)',
        }} />
      ))}
    </div>
  );
}

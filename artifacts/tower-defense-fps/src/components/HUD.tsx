import { useGameStore } from '../store/gameStore';
import { UNITS, ERA_NAMES, ERA_COLORS } from '../game/data/units';
import { UPGRADES } from '../game/data/upgrades';

export default function HUD() {
  const player = useGameStore((s) => s.player);
  const tower = useGameStore((s) => s.tower);
  const wave = useGameStore((s) => s.wave);
  const gold = useGameStore((s) => s.gold);
  const score = useGameStore((s) => s.score);
  const activeUnits = useGameStore((s) => s.activeUnits);
  const unitLimit = useGameStore((s) => s.unitLimit);
  const selectedUnitDefId = useGameStore((s) => s.selectedUnitDefId);
  const selectedEra = useGameStore((s) => s.selectedEra);
  const activeBoss = useGameStore((s) => s.activeBoss);
  const notifications = useGameStore((s) => s.notifications);
  const unitCostMultiplier = useGameStore((s) => s.unitCostMultiplier);
  const phase = useGameStore((s) => s.phase);

  const selectedUnit = UNITS[selectedUnitDefId];
  const unitCost = selectedUnit ? Math.floor(selectedUnit.cost * unitCostMultiplier) : 0;

  // Era units for selector (8 per era max shown)
  const eraNames = ['Средневековье', 'Ренессанс', 'Индустриальная', 'ВМВ', 'Современность', 'Sci-Fi'];
  const eraStartIds = [0, 8, 14, 20, 25, 32];
  const eraUnitIds = Array.from({ length: 8 }, (_, i) => eraStartIds[selectedEra] + i).filter(id => id < 40);

  const playerHpPct = (player.hp / player.maxHp) * 100;
  const towerHpPct = (tower.hp / tower.maxHp) * 100;
  const specialPct = player.specialCooldown > 0 ? ((player.specialMaxCooldown - player.specialCooldown) / player.specialMaxCooldown) * 100 : 100;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── TOP BAR ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
      }}>
        {/* Wave info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <div style={{ color: '#aaa', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Волна</div>
          <div style={{ color: wave.isBossWave ? '#FF4444' : '#FFFFFF', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
            {wave.current} <span style={{ fontSize: 14, color: '#666' }}>/ 100</span>
          </div>
          <EnemyBar left={wave.enemiesLeft} total={wave.enemiesTotal} />
        </div>

        {/* Score + Gold */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ color: '#FFD700', fontSize: 20, fontWeight: 800 }}>💰 {gold.toLocaleString()}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Очки: {score.toLocaleString()}</div>
        </div>

        {/* Units count */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ color: '#aaa', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Юниты</div>
          <div style={{ color: activeUnits.length >= unitLimit ? '#FF4444' : '#fff', fontSize: 22, fontWeight: 700 }}>
            {activeUnits.length} / {unitLimit}
          </div>
        </div>
      </div>

      {/* ── BOSS HP BAR ── */}
      {activeBoss && (
        <div style={{
          position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)',
          width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <div style={{ color: '#FF4444', fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', textShadow: '0 0 10px #FF0000' }}>
            ⚠️ БОСС
          </div>
          <div style={{ width: '100%', height: 16, background: 'rgba(0,0,0,0.7)', borderRadius: 8, border: '1px solid rgba(255,68,68,0.5)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 8,
              width: `${(activeBoss.hp / activeBoss.maxHp) * 100}%`,
              background: 'linear-gradient(to right, #8B0000, #FF4444)',
              transition: 'width 0.1s',
            }} />
          </div>
          <div style={{ color: '#FF8888', fontSize: 12 }}>
            {Math.floor(activeBoss.hp).toLocaleString()} / {activeBoss.maxHp.toLocaleString()}
          </div>
        </div>
      )}

      {/* ── CROSSHAIR ── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 20, height: 20, pointerEvents: 'none',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.8)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.8)', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 4, height: 4, borderRadius: '50%', background: '#4ADE80', border: '1px solid rgba(0,0,0,0.5)' }} />
      </div>

      {/* ── BOTTOM LEFT — Player status ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        padding: '16px 20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
        minWidth: 240,
      }}>
        {/* HP */}
        <StatBar label="HP ГЕРОЯ" value={player.hp} max={player.maxHp} color="#EF4444" />
        <div style={{ marginTop: 10 }} />
        <StatBar label="HP БАШНИ" value={tower.hp} max={tower.maxHp} color="#3B82F6" />

        {/* Ammo */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ color: '#aaa', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', width: 70 }}>Патроны</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: player.maxAmmo }).map((_, i) => (
              <div key={i} style={{
                width: 4, height: 12, borderRadius: 2,
                background: i < player.ammo ? '#FACC15' : 'rgba(255,255,255,0.15)',
              }} />
            ))}
          </div>
          {player.isReloading && (
            <div style={{ color: '#F59E0B', fontSize: 11, fontWeight: 700 }}>
              ПЕРЕЗАРЯДКА {Math.floor(player.reloadProgress * 100)}%
            </div>
          )}
        </div>

        {/* Special ability */}
        <div style={{ marginTop: 10 }}>
          <div style={{ color: '#aaa', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            Y — Суперудар {specialPct < 100 ? `(${Math.floor(specialPct)}%)` : '✅ ГОТОВ'}
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', width: 180 }}>
            <div style={{ height: '100%', width: `${specialPct}%`, background: specialPct >= 100 ? '#A855F7' : '#7C3AED', borderRadius: 3, transition: 'width 0.2s' }} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM RIGHT — Unit selector ── */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        padding: '16px 20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
        minWidth: 300,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
      }}>
        {/* Era selector */}
        <div style={{ display: 'flex', gap: 6 }}>
          {eraNames.map((name, i) => (
            <div key={i} style={{
              padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
              background: selectedEra === i ? ERA_COLORS[Object.keys(ERA_COLORS)[i] as any] + '66' : 'rgba(255,255,255,0.05)',
              color: selectedEra === i ? '#fff' : '#666',
              border: `1px solid ${selectedEra === i ? ERA_COLORS[Object.keys(ERA_COLORS)[i] as any] : 'transparent'}`,
              letterSpacing: '0.05em',
            }}>
              {name.slice(0, 4)}
            </div>
          ))}
        </div>

        {/* Unit carousel */}
        <div style={{ display: 'flex', gap: 8 }}>
          {eraUnitIds.map((id) => {
            const unit = UNITS[id];
            if (!unit) return null;
            const isSelected = id === selectedUnitDefId;
            const cost = Math.floor(unit.cost * unitCostMultiplier);
            const canAfford = gold >= cost;
            return (
              <div key={id} style={{
                width: 56, padding: '6px 4px',
                background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.5)',
                border: `2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 8, textAlign: 'center',
                opacity: canAfford ? 1 : 0.5,
                transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>⚔️</div>
                <div style={{ color: '#fff', fontSize: 8, fontWeight: 600, lineHeight: 1.2, marginBottom: 2 }}>{unit.name.slice(0, 10)}</div>
                <div style={{ color: '#FFD700', fontSize: 10, fontWeight: 700 }}>💰{cost}</div>
              </div>
            );
          })}
        </div>

        {/* Selected unit info */}
        {selectedUnit && (
          <div style={{ display: 'flex', gap: 16, color: '#aaa', fontSize: 11 }}>
            <span>🗡 {selectedUnit.damage}</span>
            <span>📏 {selectedUnit.range}м</span>
            <span>❤️ {selectedUnit.hp}</span>
            <span style={{ color: '#4ADE80', fontWeight: 700 }}>A — Разместить</span>
          </div>
        )}
      </div>

      {/* ── NOTIFICATIONS ── */}
      <div style={{
        position: 'absolute', top: '50%', right: 20,
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 8,
        pointerEvents: 'none', maxWidth: 300,
      }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: n.type === 'danger' ? 'rgba(220,38,38,0.9)'
              : n.type === 'success' ? 'rgba(22,163,74,0.9)'
              : n.type === 'warn' ? 'rgba(217,119,6,0.9)'
              : 'rgba(30,30,40,0.9)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(4px)',
            animation: 'slideIn 0.2s ease',
          }}>
            {n.text}
          </div>
        ))}
      </div>

      {/* ── CONTROLS HINT ── */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 16, color: 'rgba(255,255,255,0.3)', fontSize: 11,
      }}>
        <span>RT — Огонь</span>
        <span>A — Юнит</span>
        <span>B — Апгрейды</span>
        <span>LB/RB — Выбор</span>
        <span>Start — Пауза</span>
      </div>
    </div>
  );
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: '#aaa', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>{Math.floor(value)} / {max}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', width: 200 }}>
        <div style={{
          height: '100%', borderRadius: 4, width: `${pct}%`,
          background: pct > 50 ? color : pct > 25 ? '#F59E0B' : '#EF4444',
          transition: 'width 0.15s',
        }} />
      </div>
    </div>
  );
}

function EnemyBar({ left, total }: { left: number; total: number }) {
  if (total === 0) return null;
  const pct = ((total - left) / total) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
      <div style={{ height: 4, width: 120, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#4ADE80', borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
      <span style={{ color: '#888', fontSize: 10 }}>{left} врагов</span>
    </div>
  );
}

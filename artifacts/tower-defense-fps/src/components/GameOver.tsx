import { useGameStore } from '../store/gameStore';

interface Props { onRestart: () => void; }

export default function GameOver({ onRestart }: Props) {
  const stats = useGameStore((s) => s.stats);
  const wave = useGameStore((s) => s.wave);
  const score = useGameStore((s) => s.score);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at center, rgba(100,0,0,0.4) 0%, rgba(0,0,0,0.97) 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)', pointerEvents: 'auto',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        {/* Title */}
        <div style={{ fontSize: '0.85rem', color: '#FF4444', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          БАШНЯ ПАЛА
        </div>
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900, margin: '0 0 2rem',
          background: 'linear-gradient(180deg, #ff6666 0%, #880000 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          GAME OVER
        </h1>

        {/* Stats */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '1.5rem', marginBottom: '2rem',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem',
        }}>
          {[
            { label: 'Волна', value: wave.current, icon: '🌊' },
            { label: 'Очки', value: score.toLocaleString(), icon: '⭐' },
            { label: 'Убито врагов', value: stats.kills, icon: '💀' },
            { label: 'Боссов убито', value: stats.bossKills, icon: '👹' },
            { label: 'Золото заработано', value: stats.goldEarned.toLocaleString(), icon: '💰' },
            { label: 'Волн завершено', value: stats.wavesCompleted, icon: '✅' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>{s.value}</div>
              <div style={{ color: '#555', fontSize: '0.75rem', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onRestart}
          style={{
            padding: '1rem 3rem',
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            boxShadow: '0 0 30px rgba(124,58,237,0.4)',
          }}
        >
          ↺ Играть снова
        </button>
      </div>
    </div>
  );
}

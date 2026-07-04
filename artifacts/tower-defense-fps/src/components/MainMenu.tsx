interface Props { onStart: () => void; }

export default function MainMenu({ onStart }: Props) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 40% 50%, rgba(30,20,60,0.98) 0%, rgba(5,5,15,0.99) 60%)',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
      padding: '0 8vw',
      userSelect: 'none',
    }}>
      {/* Background grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(100,100,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(100,100,255,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute', right: '15%', top: '50%', transform: 'translateY(-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ color: 'rgba(139,92,246,0.8)', fontSize: '0.9rem', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
          BABYLON.JS · WEBGPU · ГЕЙМПАД
        </div>
        <h1 style={{
          fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #fff 0%, #a78bfa 50%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: '0 0 0.25rem',
        }}>
          TOWER
        </h1>
        <h1 style={{
          fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: '0 0 2rem',
        }}>
          DEFENSE FPS
        </h1>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {[
            { icon: '⚔️', label: '40 юнитов', sub: 'Средневековье → Sci-Fi' },
            { icon: '💀', label: '100 врагов', sub: '10 уровней сложности' },
            { icon: '👹', label: '20 боссов', sub: 'Каждые 5 волн' },
            { icon: '🔧', label: '10 апгрейдов', sub: 'Герой и армия' },
          ].map((item) => (
            <div key={item.label} style={{
              padding: '12px 18px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{item.icon}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{item.label}</div>
              <div style={{ color: '#666', fontSize: '0.75rem', marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          style={{
            padding: '1.1rem 3.5rem',
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: '1.15rem', fontWeight: 800, cursor: 'pointer',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            boxShadow: '0 0 40px rgba(139,92,246,0.4)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            pointerEvents: 'auto',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = 'scale(1.04)';
            (e.target as HTMLElement).style.boxShadow = '0 0 60px rgba(139,92,246,0.6)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = 'scale(1)';
            (e.target as HTMLElement).style.boxShadow = '0 0 40px rgba(139,92,246,0.4)';
          }}
        >
          ▶ НАЧАТЬ ИГРУ
        </button>

        {/* Gamepad hint */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: 24, color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
          <span>🎮 Левый стик — движение</span>
          <span>🎮 Правый стик — прицел</span>
          <span>🎮 RT — огонь</span>
          <span>🎮 A — поставить юнит</span>
        </div>
      </div>
    </div>
  );
}

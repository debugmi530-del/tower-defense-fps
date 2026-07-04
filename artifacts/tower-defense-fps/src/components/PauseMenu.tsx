interface Props {
  onResume: () => void;
  onRestart: () => void;
}

export default function PauseMenu({ onResume, onRestart }: Props) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(8px)',
    }}>
      <h2 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>ПАУЗА</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '240px' }}>
        <button onClick={onResume} style={btnStyle('#2563EB')}>▶ Продолжить (Start)</button>
        <button onClick={onRestart} style={btnStyle('#DC2626')}>↺ Начать заново</button>
      </div>
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    padding: '0.9rem 1.5rem', background: bg, color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em',
    transition: 'opacity 0.15s',
  };
}

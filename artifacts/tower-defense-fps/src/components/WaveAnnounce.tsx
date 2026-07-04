import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BOSSES } from '../game/data/bosses';

export default function WaveAnnounce() {
  const wave = useGameStore((s) => s.wave);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
    const t = setTimeout(() => setOpacity(0), 2500);
    return () => clearTimeout(t);
  }, [wave.current]);

  const isBoss = wave.isBossWave;
  const boss = isBoss ? BOSSES[Math.floor(wave.current / 5) - 1] : null;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      transition: 'opacity 0.5s',
      opacity,
    }}>
      {isBoss ? (
        <>
          <div style={{
            fontSize: '1rem', color: '#FF4444', letterSpacing: '0.3em',
            fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem',
            textShadow: '0 0 20px #FF0000',
          }}>
            ⚠️ ВОЛНА БОССА ⚠️
          </div>
          <div style={{
            fontSize: '3.5rem', fontWeight: 900, color: '#FF2222',
            textShadow: '0 0 60px #FF0000, 0 0 20px #FF0000',
            letterSpacing: '0.05em',
          }}>
            {boss?.name ?? 'БОСС'}
          </div>
          <div style={{ fontSize: '1rem', color: '#FF8888', marginTop: '0.5rem', maxWidth: '400px', textAlign: 'center' }}>
            {boss?.lore}
          </div>
        </>
      ) : (
        <>
          <div style={{
            fontSize: '1rem', color: '#aaa', letterSpacing: '0.3em',
            fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem',
          }}>
            Начинается
          </div>
          <div style={{
            fontSize: '4rem', fontWeight: 900,
            color: '#FFFFFF', textShadow: '0 0 40px rgba(255,255,255,0.5)',
          }}>
            Волна {wave.current}
          </div>
          <div style={{ fontSize: '1.1rem', color: '#888', marginTop: '0.5rem' }}>
            {wave.enemiesTotal} врагов
          </div>
        </>
      )}
    </div>
  );
}

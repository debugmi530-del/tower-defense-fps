import { useEffect, useRef, useCallback } from 'react';
import { gameController } from '../game/GameController';
import { useGameStore } from '../store/gameStore';
import HUD from '../components/HUD';
import MainMenu from '../components/MainMenu';
import UpgradeMenu from '../components/UpgradeMenu';
import WaveAnnounce from '../components/WaveAnnounce';
import GameOver from '../components/GameOver';
import PauseMenu from '../components/PauseMenu';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    if (!canvasRef.current || initialized.current) return;
    initialized.current = true;

    gameController.init(canvasRef.current).then(() => {
      console.log('[GamePage] Engine initialized');
    });

    return () => {
      // Don't dispose on unmount in dev (StrictMode double-init)
    };
  }, []);

  const handleStartGame = useCallback(() => {
    gameController.startGame();
  }, []);

  const handleResume = useCallback(() => {
    useGameStore.getState().setPhase('playing');
  }, []);

  const handleRestart = useCallback(() => {
    useGameStore.getState().resetGame();
    setTimeout(() => gameController.startGame(), 100);
  }, []);

  const showHUD = phase === 'playing' || phase === 'upgrading' || phase === 'paused';

  return (
    <div className="game-root" style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
      {/* Babylon.js canvas — always mounted */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          outline: 'none',
          touchAction: 'none',
        }}
      />

      {/* React UI overlay */}
      {phase === 'menu' && <MainMenu onStart={handleStartGame} />}
      {phase === 'waveAnnounce' && <WaveAnnounce />}
      {showHUD && <HUD />}
      {phase === 'upgrading' && <UpgradeMenu onClose={handleResume} />}
      {phase === 'paused' && <PauseMenu onResume={handleResume} onRestart={handleRestart} />}
      {phase === 'gameover' && <GameOver onRestart={handleRestart} />}
      {phase === 'victory' && (
        <div className="victory-screen" style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.3) 0%, rgba(0,0,0,0.95) 70%)',
        }}>
          <h1 style={{ fontSize: '4rem', color: '#FFD700', textShadow: '0 0 40px #FFD700', fontWeight: 900 }}>
            ПОБЕДА!
          </h1>
          <p style={{ color: '#ccc', fontSize: '1.5rem', marginTop: '1rem' }}>
            Все 100 волн пройдены. Вы — легенда.
          </p>
          <button onClick={handleRestart} style={{
            marginTop: '2rem', padding: '1rem 3rem',
            background: '#FFD700', color: '#000', fontWeight: 700,
            fontSize: '1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
          }}>
            Играть снова
          </button>
        </div>
      )}
    </div>
  );
}

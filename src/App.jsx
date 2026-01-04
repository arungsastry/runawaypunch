import { createSignal, onMount } from 'solid-js';
import { GameCanvas } from './ui/components/GameCanvas';
import { GameControls } from './ui/components/GameControls';
import './styles/app.css';

function App() {
  let gameInstance;
  const [canHit, setCanHit] = createSignal(false);
  const [gameOver, setGameOver] = createSignal(false);

  const handleGameReady = (game) => {
    gameInstance = game;
  };

  const handleHit = () => {
    if (gameInstance?.engine?.currentScene) {
      gameInstance.engine.currentScene.handleHitButton();
    }
  };

  const handleRestart = () => {
    if (gameInstance?.engine?.currentScene) {
      gameInstance.engine.currentScene.restart(gameInstance.engine);
      setGameOver(false);
    }
  };

  onMount(() => {
    const interval = setInterval(() => {
      if (gameInstance?.engine?.currentScene) {
        setCanHit(gameInstance.engine.currentScene.canHitMonster || false);
        setGameOver(gameInstance.engine.currentScene.gameOver || false);
      }
    }, 100);

    const handleKeyDown = (event) => {
      if (event.code === 'Space' && canHit()) {
        event.preventDefault();
        handleHit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div class="app">
      <header class="header">
        <h1>Runaway Punch</h1>
        <p>Dodge the Monster & Strike Back!</p>
      </header>
      <main class="main">
        <div class="game-container">
          <GameCanvas onGameReady={handleGameReady} />
          <GameControls canHit={canHit()} onHit={handleHit} gameOver={gameOver()} onRestart={handleRestart} />
        </div>
      </main>
      <footer class="footer">
        <p>Use arrow buttons or keyboard to dodge • Press HIT or SPACE when monster is dizzy!</p>
      </footer>
    </div>
  );
}

export default App;

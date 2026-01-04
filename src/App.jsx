import { createSignal, onMount } from 'solid-js';
import { GameCanvas } from './ui/components/GameCanvas';
import { GameControls } from './ui/components/GameControls';
import './styles/app.css';

function App() {
  let gameInstance;
  const [canHit, setCanHit] = createSignal(false);

  const handleGameReady = (game) => {
    gameInstance = game;
  };

  const handleHit = () => {
    if (gameInstance?.engine?.currentScene) {
      gameInstance.engine.currentScene.handleHitButton();
    }
  };

  onMount(() => {
    const interval = setInterval(() => {
      if (gameInstance?.engine?.currentScene) {
        setCanHit(gameInstance.engine.currentScene.canHitMonster || false);
      }
    }, 100);

    return () => clearInterval(interval);
  });

  return (
    <div class="app">
      <header class="header">
        <h1>Runaway Punch</h1>
        <p>Dodge the Monster & Strike Back!</p>
      </header>
      <main class="main">
        <div class="game-container">
          <GameCanvas width={800} height={600} onGameReady={handleGameReady} />
          <GameControls canHit={canHit()} onHit={handleHit} />
        </div>
      </main>
      <footer class="footer">
        <p>Use arrow buttons or keyboard to dodge • Press HIT when monster is dizzy!</p>
      </footer>
    </div>
  );
}

export default App;

import { onMount, onCleanup } from 'solid-js';
import { Game } from '../../game/Game.js';

export function GameCanvas(props) {
  let canvasRef;
  let game;

  onMount(() => {
    if (canvasRef) {
      canvasRef.width = props.width || 800;
      canvasRef.height = props.height || 600;

      game = new Game(canvasRef);
      game.start();

      if (props.onGameReady) {
        props.onGameReady(game);
      }
    }
  });

  onCleanup(() => {
    if (game) {
      game.stop();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: '2px solid #333',
        'background-color': '#000',
        display: 'block',
        margin: '0 auto',
      }}
    />
  );
}

import { onMount, onCleanup } from 'solid-js';
import { Game } from '../../game/Game.js';

export function GameCanvas(props) {
  let canvasRef;
  let game;

  const resizeCanvas = () => {
    if (!canvasRef) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const isMobile = windowWidth <= 768;
    const isSmallMobile = windowWidth <= 480;

    const headerFooterSpace = isSmallMobile ? 140 : (isMobile ? 160 : 300);

    let canvasWidth, canvasHeight;

    if (isMobile) {
      const maxWidth = windowWidth - 16;
      const maxHeight = windowHeight - headerFooterSpace;

      canvasWidth = maxWidth;
      canvasHeight = maxHeight;
    } else {
      const baseWidth = 800;
      const baseHeight = 600;
      const aspectRatio = baseWidth / baseHeight;

      const maxWidth = Math.min(windowWidth - 40, baseWidth);
      const maxHeight = windowHeight - headerFooterSpace;

      canvasWidth = maxWidth;
      canvasHeight = canvasWidth / aspectRatio;

      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = canvasHeight * aspectRatio;
      }
    }

    canvasRef.width = canvasWidth;
    canvasRef.height = canvasHeight;

    if (game) {
      game.engine.canvas.width = canvasWidth;
      game.engine.canvas.height = canvasHeight;

      const scene = game.engine.currentScene;
      if (scene && scene.onResize) {
        scene.onResize(canvasWidth, canvasHeight);
      }
    }
  };

  onMount(() => {
    if (canvasRef) {
      resizeCanvas();

      game = new Game(canvasRef);
      game.start();

      window.addEventListener('resize', resizeCanvas);

      if (props.onGameReady) {
        props.onGameReady(game);
      }
    }
  });

  onCleanup(() => {
    if (game) {
      game.stop();
    }
    window.removeEventListener('resize', resizeCanvas);
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: '2px solid #333',
        'background-color': '#000',
        display: 'block',
        margin: '0 auto',
        'max-width': '100%',
        height: 'auto',
      }}
    />
  );
}

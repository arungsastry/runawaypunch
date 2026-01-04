import { createSignal, onCleanup } from 'solid-js';
import './GameControls.css';

export function GameControls(props) {
  const [leftPressed, setLeftPressed] = createSignal(false);
  const [rightPressed, setRightPressed] = createSignal(false);
  const [hitPressed, setHitPressed] = createSignal(false);

  const handleLeftDown = () => {
    setLeftPressed(true);
    const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    window.dispatchEvent(event);
  };

  const handleLeftUp = () => {
    setLeftPressed(false);
    const event = new KeyboardEvent('keyup', { code: 'ArrowLeft' });
    window.dispatchEvent(event);
  };

  const handleRightDown = () => {
    setRightPressed(true);
    const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
    window.dispatchEvent(event);
  };

  const handleRightUp = () => {
    setRightPressed(false);
    const event = new KeyboardEvent('keyup', { code: 'ArrowRight' });
    window.dispatchEvent(event);
  };

  const handleHit = () => {
    setHitPressed(true);
    props.onHit?.();
    setTimeout(() => setHitPressed(false), 150);
  };

  return (
    <div class="game-controls">
      <button
        class={`control-btn arrow-btn ${leftPressed() ? 'pressed' : ''}`}
        onMouseDown={handleLeftDown}
        onMouseUp={handleLeftUp}
        onMouseLeave={handleLeftUp}
        onTouchStart={handleLeftDown}
        onTouchEnd={handleLeftUp}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M25 10 L15 20 L25 30" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <button
        class={`control-btn hit-btn ${hitPressed() ? 'pressed' : ''} ${props.canHit ? 'active' : ''}`}
        onClick={handleHit}
        disabled={!props.canHit}
      >
        HIT!
      </button>

      <button
        class={`control-btn arrow-btn ${rightPressed() ? 'pressed' : ''}`}
        onMouseDown={handleRightDown}
        onMouseUp={handleRightUp}
        onMouseLeave={handleRightUp}
        onTouchStart={handleRightDown}
        onTouchEnd={handleRightUp}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M15 10 L25 20 L15 30" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

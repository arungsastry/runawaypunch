import { Player } from '../entities/Player.js';
import { Monster } from '../entities/Monster.js';

export class GameScene {
  constructor() {
    this.name = 'game';
    this.score = 0;
    this.gameOver = false;
    this.gameWon = false;
    this.monsterHealth = 5;
  }

  onEnter(engine) {
    this.engine = engine;
    const inputSystem = engine.systems.find(s => s.constructor.name === 'InputSystem');

    const playerY = engine.canvas.height - 80;
    const player = new Player(
      100,
      playerY,
      inputSystem,
      engine.canvas.width
    );

    const monster = new Monster(
      engine.canvas.width - 150,
      150,
      engine.canvas.width,
      engine.canvas.height
    );

    engine.addEntity(player);
    engine.addEntity(monster);
    this.player = player;
    this.monster = monster;
    this.inputSystem = inputSystem;
    this.canHitMonster = false;
  }

  handleHitButton() {
    if (this.gameOver || this.gameWon) return false;

    if (this.monster.state === 'dizzy') {
      if (this.monster.takeDamage()) {
        this.monsterHealth--;
        this.score += 100;

        if (this.monsterHealth <= 0) {
          this.gameWon = true;
        }
        return true;
      }
    }
    return false;
  }

  onExit() {
    if (this.player) {
      this.engine.removeEntity(this.player);
    }
    if (this.monster) {
      this.engine.removeEntity(this.monster);
    }
  }

  update(dt, engine) {
    if (this.gameOver || this.gameWon) return;

    if (this.monster.checkHit(this.player)) {
      this.gameOver = true;
    }

    this.canHitMonster = this.monster.state === 'dizzy';
  }

  render(ctx, engine) {
    ctx.fillStyle = '#0A0E27';
    ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);

    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, engine.canvas.height - 100, engine.canvas.width, 100);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${this.score}`, 20, 40);
    ctx.fillText(`Monster HP: ${this.monsterHealth}`, 20, 70);
    ctx.fillText(`Misses: ${this.monster.missCount}/3`, 20, 100);

    if (this.monster.state === 'dizzy') {
      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('MONSTER IS DIZZY! CLICK HIT!', engine.canvas.width / 2, 150);
      ctx.textAlign = 'left';
    }

    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);

      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER!', engine.canvas.width / 2, engine.canvas.height / 2);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '24px Arial';
      ctx.fillText('The monster got you!', engine.canvas.width / 2, engine.canvas.height / 2 + 50);
      ctx.fillText(`Final Score: ${this.score}`, engine.canvas.width / 2, engine.canvas.height / 2 + 90);
      ctx.textAlign = 'left';
    }

    if (this.gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('YOU WIN!', engine.canvas.width / 2, engine.canvas.height / 2);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '24px Arial';
      ctx.fillText('You defeated the monster!', engine.canvas.width / 2, engine.canvas.height / 2 + 50);
      ctx.fillText(`Final Score: ${this.score}`, engine.canvas.width / 2, engine.canvas.height / 2 + 90);
      ctx.textAlign = 'left';
    }
  }
}


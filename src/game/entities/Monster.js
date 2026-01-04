import { Entity } from './Entity.js';
import { createTransformComponent, createSpriteComponent } from '../systems/RenderSystem.js';
import { createColliderComponent } from '../systems/PhysicsSystem.js';

export class Monster extends Entity {
  constructor(x, y, canvasWidth, canvasHeight) {
    super();
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.width = 120;
    this.height = 180;

    const minGap = 45;
    const playerHeight = 60;
    const playerTopY = canvasHeight - 80 - (playerHeight / 2);
    this.restingHeight = Math.min(150, playerTopY - minGap - (this.height / 2));
    this.smashHeight = canvasHeight - 100;

    this.state = 'hovering';
    this.moveSpeed = 150;
    this.smashSpeed = 800;
    this.missCount = 0;
    this.maxMisses = 3;
    this.dizzyTimer = 0;
    this.dizzyDuration = 3;
    this.explosionTimer = 0;
    this.explosionDuration = 1.5;
    this.respawnTimer = 0;
    this.respawnDuration = 1;
    this.explosionPieces = [];

    this.targetX = x;
    this.hoverTimer = 0;
    this.hoverDelay = 2;

    this.addComponent(createTransformComponent(x, y));
    this.addComponent(createSpriteComponent({
      width: this.width,
      height: this.height,
      color: '#ff0000'
    }));
    this.addComponent(createColliderComponent(60));
  }

  update(dt) {
    const transform = this.components.transform;

    switch (this.state) {
      case 'hovering':
        this.updateHovering(dt, transform);
        break;
      case 'smashing':
        this.updateSmashing(dt, transform);
        break;
      case 'returning':
        this.updateReturning(dt, transform);
        break;
      case 'dizzy':
        this.updateDizzy(dt, transform);
        break;
      case 'exploding':
        this.updateExploding(dt, transform);
        break;
      case 'respawning':
        this.updateRespawning(dt, transform);
        break;
    }
  }

  updateHovering(dt, transform) {
    if (Math.abs(transform.x - this.targetX) > 5) {
      const direction = this.targetX > transform.x ? 1 : -1;
      transform.x += direction * this.moveSpeed * dt;
    } else {
      transform.x = this.targetX;
    }

    this.hoverTimer += dt;
    if (this.hoverTimer >= this.hoverDelay) {
      this.hoverTimer = 0;
      this.state = 'smashing';
    }
  }

  updateSmashing(dt, transform) {
    transform.y += this.smashSpeed * dt;

    if (transform.y >= this.smashHeight) {
      transform.y = this.smashHeight;
      this.onSmashLand();
      this.state = 'returning';
    }
  }

  updateReturning(dt, transform) {
    transform.y -= this.smashSpeed * dt;

    if (transform.y <= this.restingHeight) {
      transform.y = this.restingHeight;

      if (this.missCount >= this.maxMisses) {
        this.state = 'dizzy';
        this.dizzyTimer = 0;
      } else {
        this.state = 'hovering';
        this.pickNewTarget();
      }
    }
  }

  updateDizzy(dt, transform) {
    this.dizzyTimer += dt;

    if (this.dizzyTimer >= this.dizzyDuration) {
      this.missCount = 0;
      this.state = 'hovering';
      this.pickNewTarget();
    }
  }

  updateExploding(dt, transform) {
    this.explosionTimer += dt;

    this.explosionPieces.forEach(piece => {
      piece.x += piece.velocityX * dt;
      piece.y += piece.velocityY * dt;
      piece.velocityY += 400 * dt;
      piece.rotation += piece.rotationSpeed * dt;
    });

    if (this.explosionTimer >= this.explosionDuration) {
      this.state = 'respawning';
      this.respawnTimer = 0;
      this.explosionPieces = [];
    }
  }

  updateRespawning(dt, transform) {
    this.respawnTimer += dt;

    if (this.respawnTimer >= this.respawnDuration) {
      this.missCount = 0;
      this.explosionTimer = 0;
      this.state = 'hovering';
      this.pickNewTarget();
      transform.y = this.restingHeight;
    }
  }

  pickNewTarget() {
    const minX = this.width / 2;
    const maxX = this.canvasWidth - this.width / 2;
    this.targetX = minX + Math.random() * (maxX - minX);
  }

  updateCanvasDimensions(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.smashHeight = height - 100;

    const minGap = 45;
    const playerHeight = 60;
    const playerTopY = height - 80 - (playerHeight / 2);
    this.restingHeight = Math.min(150, playerTopY - minGap - (this.height / 2));

    const transform = this.components.transform;
    if (transform.x > width - this.width / 2) {
      transform.x = width - this.width / 2;
    }
    if (this.targetX > width - this.width / 2) {
      this.targetX = width - this.width / 2;
    }

    if (transform.y < this.restingHeight) {
      transform.y = this.restingHeight;
    }
  }

  increaseSpeed() {
    this.moveSpeed = 200;
    this.smashSpeed = 1000;
    this.hoverDelay = 1.6;
  }

  onSmashLand() {
    this.missCount++;
  }

  checkHit(player) {
    const transform = this.components.transform;
    const playerTransform = player.components.transform;

    const dx = Math.abs(transform.x - playerTransform.x);

    if (this.state === 'smashing' && transform.y >= this.smashHeight - 50) {
      if (dx < 80) {
        return true;
      }
    }
    return false;
  }

  takeDamage() {
    if (this.state === 'dizzy') {
      this.state = 'exploding';
      this.explosionTimer = 0;
      this.dizzyTimer = 0;
      this.createExplosionPieces();
      return true;
    }
    return false;
  }

  createExplosionPieces() {
    this.explosionPieces = [];

    const pieces = [
      { type: 'head', x: 0, y: -65, width: 30, height: 30, color: '#FF4500', isCircle: true },
      { type: 'body', x: -20, y: -25, width: 40, height: 50, color: '#8B0000', isCircle: false },
      { type: 'body', x: 20, y: -25, width: 40, height: 50, color: '#8B0000', isCircle: false },
      { type: 'arm', x: -35, y: -15, width: 15, height: 40, color: '#FF0000', isCircle: false },
      { type: 'arm', x: 35, y: -15, width: 15, height: 40, color: '#FF0000', isCircle: false },
      { type: 'eye', x: -10, y: -70, width: 8, height: 8, color: '#000', isCircle: true },
      { type: 'eye', x: 10, y: -70, width: 8, height: 8, color: '#000', isCircle: true },
    ];

    pieces.forEach(piece => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;
      this.explosionPieces.push({
        ...piece,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 100,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    });
  }

  render(ctx) {
    const transform = this.components.transform;

    ctx.save();
    ctx.translate(transform.x, transform.y);

    if (this.state === 'exploding') {
      this.renderExplosion(ctx);
      ctx.restore();
      return;
    }

    if (this.state === 'respawning') {
      const alpha = this.respawnTimer / this.respawnDuration;
      ctx.globalAlpha = alpha;
    }

    if (this.state === 'dizzy') {
      ctx.save();
      ctx.rotate(Math.sin(this.dizzyTimer * 10) * 0.2);
    }

    const bodyWidth = 80;
    const bodyHeight = 100;
    const headRadius = 30;
    const armLength = 40;

    ctx.fillStyle = '#8B0000';
    ctx.fillRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);

    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.arc(0, -bodyHeight / 2 - headRadius, headRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(-bodyWidth / 2 - 15, -bodyHeight / 2 + 10, 15, armLength);
    ctx.fillRect(bodyWidth / 2, -bodyHeight / 2 + 10, 15, armLength);

    ctx.fillStyle = '#000';
    ctx.fillRect(-10, -bodyHeight / 2 - headRadius - 5, 8, 8);
    ctx.fillRect(2, -bodyHeight / 2 - headRadius - 5, 8, 8);

    if (this.state === 'dizzy') {
      ctx.restore();

      ctx.fillStyle = '#FFD700';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      for (let i = 0; i < 3; i++) {
        const angle = (this.dizzyTimer * 3 + i * Math.PI * 2 / 3);
        const x = Math.cos(angle) * 50;
        const y = Math.sin(angle) * 50 - 80;
        ctx.fillText('★', x, y);
      }
    }

    ctx.restore();
  }

  renderExplosion(ctx) {
    const progress = this.explosionTimer / this.explosionDuration;
    const alpha = Math.max(0, 1 - progress * 1.5);

    this.explosionPieces.forEach(piece => {
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.globalAlpha = alpha;

      if (piece.isCircle) {
        ctx.fillStyle = piece.color;
        ctx.beginPath();
        ctx.arc(0, 0, piece.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      }

      ctx.restore();
    });

    if (progress < 0.3) {
      const flashAlpha = (0.3 - progress) / 0.3;
      ctx.fillStyle = `rgba(255, 200, 0, ${flashAlpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

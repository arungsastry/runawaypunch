import { Entity } from './Entity.js';
import { createTransformComponent, createSpriteComponent } from '../systems/RenderSystem.js';
import { createPhysicsComponent, createColliderComponent } from '../systems/PhysicsSystem.js';
import { createAnimationComponent } from '../systems/AnimationSystem.js';

export class Player extends Entity {
  constructor(x, y, inputSystem, canvasWidth) {
    super();
    this.inputSystem = inputSystem;
    this.speed = 1500;
    this.canvasWidth = canvasWidth;
    this.width = 40;
    this.height = 60;

    this.addComponent(createTransformComponent(x, y));
    this.addComponent(createSpriteComponent({
      width: this.width,
      height: this.height,
      color: '#00ff00'
    }));
    this.addComponent(createPhysicsComponent({
      friction: 0.2,
      maxSpeed: 2000
    }));
    this.addComponent(createColliderComponent(20));
  }

  update(dt) {
    const physics = this.components.physics;
    const transform = this.components.transform;

    physics.accelerationX = 1;

    if (this.inputSystem.isKeyPressed('KeyA') || this.inputSystem.isKeyPressed('ArrowLeft')) {
      physics.accelerationX = -this.speed;
    }
    if (this.inputSystem.isKeyPressed('KeyD') || this.inputSystem.isKeyPressed('ArrowRight')) {
      physics.accelerationX = this.speed;
    }

    const padding = this.width / 2;
    if (transform.x < padding) {
      transform.x = padding;
      physics.velocityX = 0;
    }
    if (transform.x > this.canvasWidth - padding) {
      transform.x = this.canvasWidth - padding;
      physics.velocityX = 0;
    }
  }

  updateCanvasDimensions(width, height) {
    this.canvasWidth = width;

    const transform = this.components.transform;
    const padding = this.width / 2;

    if (transform.x > width - padding) {
      transform.x = width - padding;
    }

    transform.y = height - 80;
  }

  render(ctx) {
    const transform = this.components.transform;

    ctx.save();
    ctx.translate(transform.x, transform.y);

    const headRadius = 12;
    const bodyHeight = 25;
    const legHeight = 15;

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, -bodyHeight - headRadius, headRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4169E1';
    ctx.fillRect(-10, -bodyHeight, 20, bodyHeight);

    ctx.fillStyle = '#4169E1';
    ctx.fillRect(-12, -bodyHeight, 8, 3);
    ctx.fillRect(4, -bodyHeight, 8, 3);

    ctx.strokeStyle = '#2E4057';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-8, legHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(8, legHeight);
    ctx.stroke();

    ctx.restore();
  }
}

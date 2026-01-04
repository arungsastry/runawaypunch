export class PhysicsSystem {
  init(engine) {
    this.engine = engine;
  }

  update(dt, entities) {
    entities.forEach(entity => {
      const physics = entity.components?.physics;
      const transform = entity.components?.transform;

      if (!physics || !transform) return;

      physics.velocityX += physics.accelerationX * dt;
      physics.velocityY += physics.accelerationY * dt;

      physics.velocityX *= (1 - physics.friction);
      physics.velocityY *= (1 - physics.friction);

      if (physics.gravity) {
        physics.velocityY += physics.gravity * dt;
      }

      transform.x += physics.velocityX * dt;
      transform.y += physics.velocityY * dt;

      if (physics.maxSpeed) {
        const speed = Math.sqrt(
          physics.velocityX ** 2 + physics.velocityY ** 2
        );
        if (speed > physics.maxSpeed) {
          const scale = physics.maxSpeed / speed;
          physics.velocityX *= scale;
          physics.velocityY *= scale;
        }
      }
    });

    this.checkCollisions(entities);
  }

  checkCollisions(entities) {
    const collidables = entities.filter(e => e.components?.collider);

    for (let i = 0; i < collidables.length; i++) {
      for (let j = i + 1; j < collidables.length; j++) {
        const entityA = collidables[i];
        const entityB = collidables[j];

        if (this.areColliding(entityA, entityB)) {
          entityA.onCollision?.(entityB);
          entityB.onCollision?.(entityA);
        }
      }
    }
  }

  areColliding(entityA, entityB) {
    const transformA = entityA.components.transform;
    const transformB = entityB.components.transform;
    const colliderA = entityA.components.collider;
    const colliderB = entityB.components.collider;

    const dx = transformA.x - transformB.x;
    const dy = transformA.y - transformB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < (colliderA.radius + colliderB.radius);
  }
}

export function createPhysicsComponent(config = {}) {
  return {
    physics: {
      velocityX: config.velocityX || 0,
      velocityY: config.velocityY || 0,
      accelerationX: config.accelerationX || 0,
      accelerationY: config.accelerationY || 0,
      friction: config.friction || 0,
      gravity: config.gravity || 0,
      maxSpeed: config.maxSpeed || null,
    }
  };
}

export function createColliderComponent(radius = 16) {
  return {
    collider: { radius }
  };
}

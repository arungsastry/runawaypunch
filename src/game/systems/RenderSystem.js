export class RenderSystem {
  init(engine) {
    this.engine = engine;
  }

  render(ctx, entities) {
    entities.forEach(entity => {
      const transform = entity.components?.transform;
      const sprite = entity.components?.sprite;
      const animation = entity.components?.animation;

      if (!transform || !sprite) return;

      ctx.save();

      ctx.translate(transform.x, transform.y);
      ctx.rotate(transform.rotation || 0);
      ctx.scale(transform.scaleX || 1, transform.scaleY || 1);

      if (animation && sprite.spriteSheet) {
        const frame = animation.frames[animation.currentFrame];
        if (frame && sprite.spriteSheet.image.complete) {
          ctx.drawImage(
            sprite.spriteSheet.image,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            -sprite.width / 2,
            -sprite.height / 2,
            sprite.width,
            sprite.height
          );
        }
      } else if (sprite.image && sprite.image.complete) {
        ctx.drawImage(
          sprite.image,
          -sprite.width / 2,
          -sprite.height / 2,
          sprite.width,
          sprite.height
        );
      } else {
        ctx.fillStyle = sprite.color || '#ffffff';
        ctx.fillRect(
          -sprite.width / 2,
          -sprite.height / 2,
          sprite.width,
          sprite.height
        );
      }

      ctx.restore();
    });
  }
}

export function createTransformComponent(x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1) {
  return {
    transform: { x, y, rotation, scaleX, scaleY }
  };
}

export function createSpriteComponent(config) {
  return {
    sprite: {
      width: config.width || 32,
      height: config.height || 32,
      image: config.image,
      spriteSheet: config.spriteSheet,
      color: config.color || '#ffffff',
    }
  };
}

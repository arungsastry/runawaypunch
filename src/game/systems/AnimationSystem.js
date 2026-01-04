export class AnimationSystem {
  init(engine) {
    this.engine = engine;
  }

  update(dt, entities) {
    entities.forEach(entity => {
      const animation = entity.components?.animation;
      if (!animation || !animation.playing) return;

      animation.currentTime += dt;

      if (animation.currentTime >= animation.frameTime) {
        animation.currentTime = 0;
        animation.currentFrame++;

        if (animation.currentFrame >= animation.frames.length) {
          if (animation.loop) {
            animation.currentFrame = 0;
          } else {
            animation.currentFrame = animation.frames.length - 1;
            animation.playing = false;
            animation.onComplete?.();
          }
        }
      }
    });
  }
}

export function createAnimationComponent(config) {
  return {
    animation: {
      frames: config.frames || [],
      currentFrame: 0,
      currentTime: 0,
      frameTime: config.frameTime || 0.1,
      playing: config.autoPlay ?? true,
      loop: config.loop ?? true,
      onComplete: config.onComplete,
    }
  };
}

export class SpriteSheet {
  constructor(image, frameWidth, frameHeight) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.columns = Math.floor(image.width / frameWidth);
  }

  getFrame(index) {
    const col = index % this.columns;
    const row = Math.floor(index / this.columns);

    return {
      x: col * this.frameWidth,
      y: row * this.frameHeight,
      width: this.frameWidth,
      height: this.frameHeight,
    };
  }

  createAnimation(startFrame, endFrame, name = 'default') {
    const frames = [];
    for (let i = startFrame; i <= endFrame; i++) {
      frames.push(this.getFrame(i));
    }
    return { name, frames };
  }
}

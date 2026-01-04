export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.running = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.fps = 60;
    this.frameInterval = 1000 / this.fps;

    this.scenes = new Map();
    this.currentScene = null;

    this.systems = [];
    this.entities = [];
  }

  setScene(sceneName) {
    const scene = this.scenes.get(sceneName);
    if (scene) {
      if (this.currentScene) {
        this.currentScene.onExit?.();
      }
      this.currentScene = scene;
      this.currentScene.onEnter?.(this);
    }
  }

  registerScene(name, scene) {
    this.scenes.set(name, scene);
  }

  addSystem(system) {
    this.systems.push(system);
    system.init?.(this);
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  stop() {
    this.running = false;
  }

  gameLoop = (currentTime) => {
    if (!this.running) return;

    requestAnimationFrame(this.gameLoop);

    this.deltaTime = currentTime - this.lastTime;

    if (this.deltaTime >= this.frameInterval) {
      this.lastTime = currentTime - (this.deltaTime % this.frameInterval);

      this.update(this.deltaTime / 1000);
      this.render();
    }
  }

  update(dt) {
    this.systems.forEach(system => system.update?.(dt, this.entities, this));
    this.currentScene?.update?.(dt, this);
    this.entities.forEach(entity => entity.update?.(dt));
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.currentScene?.render?.(this.ctx, this);
    this.systems.forEach(system => system.render?.(this.ctx, this.entities, this));
    this.entities.forEach(entity => entity.render?.(this.ctx));
  }

  getEntitiesWithComponent(componentName) {
    return this.entities.filter(entity => entity.components?.[componentName]);
  }
}

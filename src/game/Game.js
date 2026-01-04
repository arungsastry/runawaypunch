import { GameEngine } from './core/GameEngine.js';
import { AnimationSystem } from './systems/AnimationSystem.js';
import { RenderSystem } from './systems/RenderSystem.js';
import { PhysicsSystem } from './systems/PhysicsSystem.js';
import { InputSystem } from './systems/InputSystem.js';
import { GameScene } from './scenes/GameScene.js';

export class Game {
  constructor(canvas) {
    this.engine = new GameEngine(canvas);
    this.setupSystems();
    this.setupScenes();
  }

  setupSystems() {
    const inputSystem = new InputSystem();
    const physicsSystem = new PhysicsSystem();
    const animationSystem = new AnimationSystem();
    const renderSystem = new RenderSystem();

    this.engine.addSystem(inputSystem);
    this.engine.addSystem(physicsSystem);
    this.engine.addSystem(animationSystem);
    this.engine.addSystem(renderSystem);

    this.inputSystem = inputSystem;
  }

  setupScenes() {
    const gameScene = new GameScene();
    this.engine.registerScene('game', gameScene);
    this.engine.setScene('game');
  }

  start() {
    this.engine.start();
  }

  stop() {
    this.engine.stop();
  }
}

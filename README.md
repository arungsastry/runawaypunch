# Runaway Punch

An animation-based web game built with Solid.js, Vite, and Node.js.

## Project Structure

```
runawaypunch/
├── src/
│   ├── game/                    # Game engine and logic
│   │   ├── core/               # Core game engine
│   │   │   └── GameEngine.js   # Main game loop and entity management
│   │   ├── systems/            # ECS systems
│   │   │   ├── AnimationSystem.js   # Sprite animation
│   │   │   ├── RenderSystem.js      # Rendering sprites
│   │   │   ├── PhysicsSystem.js     # Physics and collisions
│   │   │   └── InputSystem.js       # Keyboard/mouse input
│   │   ├── entities/           # Game entities
│   │   │   ├── Entity.js       # Base entity class
│   │   │   └── Player.js       # Player entity example
│   │   ├── scenes/             # Game scenes
│   │   │   └── GameScene.js    # Main game scene
│   │   ├── components/         # Entity components
│   │   ├── utils/              # Utilities
│   │   │   └── AssetLoader.js  # Asset loading system
│   │   └── Game.js             # Game initialization
│   ├── ui/                     # Solid.js UI components
│   │   ├── components/
│   │   │   └── GameCanvas.jsx  # Canvas wrapper component
│   │   ├── layouts/
│   │   └── screens/
│   ├── styles/                 # CSS styles
│   │   └── app.css
│   ├── App.jsx                 # Main Solid app component
│   └── index.jsx               # App entry point
├── public/                     # Static assets
│   ├── assets/
│   │   ├── sprites/           # Sprite images
│   │   ├── animations/        # Animation spritesheets
│   │   ├── audio/             # Sound effects and music
│   │   └── fonts/             # Custom fonts
│   └── images/
├── server/                     # Node.js backend
│   ├── routes/
│   ├── utils/
│   └── index.js
├── index.html
├── vite.config.js
├── tsconfig.json
└── package.json
```

## Features

### Game Engine
- **Entity Component System (ECS)**: Flexible architecture for game objects
- **Game Loop**: Fixed timestep with requestAnimationFrame
- **Scene Management**: Switch between different game scenes

### Systems
- **Animation System**: Sprite-based frame animation with loops
- **Render System**: Canvas 2D rendering with transform support
- **Physics System**: Basic velocity, acceleration, friction, and collision detection
- **Input System**: Keyboard and mouse input handling

### Asset Management
- **Asset Loader**: Async image and audio loading with caching
- **Spritesheet Support**: Parse and animate from spritesheets

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the frontend dev server:
```bash
npm run dev
```

Run the backend server:
```bash
npm run server
```

Run both concurrently:
```bash
npm run dev:full
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

### Creating Entities

```javascript
import { Entity } from './game/entities/Entity.js';
import { createTransformComponent, createSpriteComponent } from './game/systems/RenderSystem.js';

const entity = new Entity();
entity.addComponent(createTransformComponent(100, 100));
entity.addComponent(createSpriteComponent({
  width: 32,
  height: 32,
  color: '#ff0000'
}));

engine.addEntity(entity);
```

### Adding Animations

```javascript
import { createAnimationComponent } from './game/systems/AnimationSystem.js';

entity.addComponent(createAnimationComponent({
  frames: [/* frame data */],
  frameTime: 0.1,
  loop: true,
  autoPlay: true
}));
```

### Creating Custom Systems

```javascript
export class CustomSystem {
  init(engine) {
    this.engine = engine;
  }

  update(dt, entities) {
    // Update logic
  }

  render(ctx, entities) {
    // Render logic
  }
}
```

### Creating Scenes

```javascript
export class CustomScene {
  onEnter(engine) {
    // Setup scene
  }

  onExit() {
    // Cleanup
  }

  update(dt, engine) {
    // Scene update logic
  }

  render(ctx, engine) {
    // Scene rendering
  }
}
```

## Controls

- **WASD** or **Arrow Keys**: Move the player

## Tech Stack

- **Frontend**: Solid.js + Vite
- **Backend**: Node.js + Express
- **Canvas**: HTML5 Canvas 2D
- **Build Tool**: Vite

## Next Steps

- Add more game entities and enemies
- Implement spritesheet animations
- Add audio system with sound effects
- Create additional game scenes (menu, game over, etc.)
- Implement particle effects
- Add camera system for scrolling
- Implement save/load system
- Add multiplayer support

## License

MIT

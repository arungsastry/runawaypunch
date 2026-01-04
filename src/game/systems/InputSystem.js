export class InputSystem {
  constructor() {
    this.systemType = 'InputSystem';
    this.keys = new Map();
    this.mouse = {
      x: 0,
      y: 0,
      buttons: new Map(),
    };

    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.code, true);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
      this.mouse.buttons.set(e.button, true);
    });

    window.addEventListener('mouseup', (e) => {
      this.mouse.buttons.set(e.button, false);
    });
  }

  isKeyPressed(keyCode) {
    return this.keys.get(keyCode) || false;
  }

  isMouseButtonPressed(button = 0) {
    return this.mouse.buttons.get(button) || false;
  }

  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }

  init(engine) {
    this.engine = engine;
  }
}

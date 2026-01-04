export class Entity {
  constructor() {
    this.components = {};
    this.active = true;
  }

  addComponent(component) {
    Object.assign(this.components, component);
    return this;
  }

  removeComponent(componentName) {
    delete this.components[componentName];
    return this;
  }

  hasComponent(componentName) {
    return componentName in this.components;
  }

  getComponent(componentName) {
    return this.components[componentName];
  }

  update(dt) {}

  render(ctx) {}

  onCollision(other) {}
}

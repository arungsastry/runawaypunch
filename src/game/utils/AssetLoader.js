export class AssetLoader {
  constructor() {
    this.images = new Map();
    this.audio = new Map();
    this.loading = new Map();
  }

  loadImage(name, path) {
    return new Promise((resolve, reject) => {
      if (this.images.has(name)) {
        resolve(this.images.get(name));
        return;
      }

      if (this.loading.has(name)) {
        this.loading.get(name).push({ resolve, reject });
        return;
      }

      this.loading.set(name, []);

      const img = new Image();
      img.onload = () => {
        this.images.set(name, img);
        resolve(img);

        const pending = this.loading.get(name) || [];
        pending.forEach(p => p.resolve(img));
        this.loading.delete(name);
      };

      img.onerror = (error) => {
        reject(error);
        const pending = this.loading.get(name) || [];
        pending.forEach(p => p.reject(error));
        this.loading.delete(name);
      };

      img.src = path;
    });
  }

  loadAudio(name, path) {
    return new Promise((resolve, reject) => {
      if (this.audio.has(name)) {
        resolve(this.audio.get(name));
        return;
      }

      const audio = new Audio(path);
      audio.addEventListener('canplaythrough', () => {
        this.audio.set(name, audio);
        resolve(audio);
      }, { once: true });

      audio.addEventListener('error', reject, { once: true });
      audio.load();
    });
  }

  async loadAssets(manifest) {
    const promises = [];

    for (const [name, config] of Object.entries(manifest)) {
      if (config.type === 'image') {
        promises.push(this.loadImage(name, config.path));
      } else if (config.type === 'audio') {
        promises.push(this.loadAudio(name, config.path));
      }
    }

    return Promise.all(promises);
  }

  getImage(name) {
    return this.images.get(name);
  }

  getAudio(name) {
    const original = this.audio.get(name);
    return original ? original.cloneNode() : null;
  }
}

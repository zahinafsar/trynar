// Model caching system for AR try-on
class ModelCache {
  private cache = new Map<string, any>();
  private loadingPromises = new Map<string, Promise<any>>();

  async loadModel(url: string): Promise<any> {
    // Return cached model if available
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // Return existing loading promise if model is being loaded
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Start loading the model
    const loadingPromise = this.fetchModel(url);
    this.loadingPromises.set(url, loadingPromise);

    try {
      const model = await loadingPromise;
      this.cache.set(url, model);
      this.loadingPromises.delete(url);
      return model;
    } catch (error) {
      this.loadingPromises.delete(url);
      throw error;
    }
  }

  private async fetchModel(url: string): Promise<any> {
    // Simulate model loading - in real implementation, this would load GLB/GLTF files
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url,
          vertices: new Float32Array([/* model data */]),
          indices: new Uint16Array([/* index data */]),
          textures: [],
          materials: [],
          loadedAt: Date.now()
        });
      }, Math.random() * 1000 + 500); // Simulate 0.5-1.5s loading time
    });
  }

  preloadModels(urls: string[]): Promise<any[]> {
    return Promise.all(urls.map(url => this.loadModel(url)));
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCachedUrls(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const modelCache = new ModelCache();

// Preload common models
export const preloadCommonModels = () => {
  const commonModels = [
    '/models/sunglasses.glb',
    '/models/sunglasses-black.glb',
    '/models/sunglasses-sport.glb',
    '/models/hat.glb',
    '/models/mask.glb'
  ];
  
  return modelCache.preloadModels(commonModels);
};
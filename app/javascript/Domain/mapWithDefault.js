// Adapted from https://stackoverflow.com/questions/51319147/map-default-value
export default class MapWithDefault extends Map {
  get(key) {
    if (!this.has(key)) {
      this.set(key, new Set());
    }

    return super.get(key);
  }
}

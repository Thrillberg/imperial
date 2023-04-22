export default class Map {
  #allProvinces;
  #allLandProvinces;
  #allOceanProvinces;

  constructor() {
    this.#allProvinces = new Set();

    this.#allLandProvinces = new Set();
    this.#allOceanProvinces = new Set();
  }

  get allProvinces() {
    return this.#allProvinces;
  }

  get allLandProvinces() {
    return this.#allLandProvinces;
  }
  get allOceanProvinces() {
    return this.#allOceanProvinces;
  }
}

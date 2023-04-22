export default class Map {
  #allProvinces;
  #allLandProvinces;
  #allNavalProvinces;

  constructor() {
    this.#allProvinces = new Set();

    this.#allLandProvinces = new Set();
    this.#allNavalProvinces = new Set();
  }

  get allProvinces() {
    return this.#allProvinces;
  }

  get allLandProvinces() {
    return this.#allLandProvinces;
  }
  get allNavalProvinces() {
    return this.#allNavalProvinces;
  }
}

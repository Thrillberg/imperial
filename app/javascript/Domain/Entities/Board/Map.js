const DuplicateProvinceError = class extends Error {
  constructor(province) {
    super(`${province.Id} already exists in the map`);

    this.name = 'DuplicateProvinceError';
  }
};

export default class Map {
  static get DuplicateProvinceError() {
    return DuplicateProvinceError;
  }

  #provinces;

  constructor() {
    this.#provinces = new Map();
  }

  provinceIdToEntity(provinceId) {
    return this.#provinces.get(provinceId);
  }
  * allProvinces() {
    for (const province of this.#provinces.values()) {
      yield province;
    }
  }

  * allLandProvinces() {
    for (const province of this.allProvinces()) {
      if (province.isLand) {
        yield province;
      }
    }
  }
  * allNavalProvinces() {
    for (const province of this.allProvinces()) {
      if (province.isWater) {
        yield province;
      }
    }
  }

  _addProvince(province) {
    if (this.#provinces.has(province.id)) {
      throw new DuplicateProvinceError(province);
    }

    this.#provinces.set(province.id, province);
  }

  _connect(provinceA, provinceB) {
    provinceA.neighbouringProvinces.add(provinceB);
    provinceB.neighbouringProvinces.add(provinceA);
  }

  _provideCanalAccess(province, to) {
    province.canalAccess.add(to);
  }
}

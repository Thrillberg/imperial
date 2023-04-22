import Entity from '../Entity';

export default class Province extends Entity {
  #neighbouringProvinces;
  #canalAccess;

  constructor(id) {
    super(id);

    this.isLand = false;

    this.ownership = null;
    this.hasArmsFactory = false;
    this.hasNavalFactory = false;
    this.hasRailroad = false;

    // map<nation, uint>
    this.friendlyUnits = new Map();
    this.hostileUnits = new Map();

    this.#neighbouringProvinces = new Set();
    this.#canalAccess = new Set();
  }

  get isOcean() {
    return this.isLand === false;
  }
  set isOcean(value) {
    this.isLand = (value === false);
  }

  get hasFactory() {
    return this.hasArmsFactory || this.hasNavalFactory;
  }
  get isDevoidOfFactory() {
    return this.hasFactory === false;
  }

  get isOccupiedByHostiles() {
    return this.hostileUnits.size > 0;
  }
  get isNotOccupiedByHostiles() {
    return this.isOccupiedByHostiles === false;
  }

  get neighbouringProvinces() {
    return this.#neighbouringProvinces;
  }

  get canalAccess() {
    return this.#canalAccess;
  }
}

export const translateProvinceModel = (id, allProvinces, allUnits, gameBoard) => {
  // temporary until migration is complete
  const oldProvinceModel = allProvinces.get(id);
  const geographicModel = gameBoard.graph.get(id);

  const province = new Province(id);

  province.isLand = !geographicModel.isOcean;
  province.ownership = geographicModel.nation;
  province.hasArmsFactory = oldProvinceModel.factory === 'armaments';
  province.hasNavalFactory = oldProvinceModel.factory === 'shipyard';

  for (const [occupyingNation] of allUnits) {
    const { armies, fleets, friendly } = allUnits
      .get(occupyingNation)
      .get(id);

    if (armies > 0 || fleets > 0) {
      const unitPool = friendly ? province.friendlyUnits : province.hostileUnits;
      unitPool.set(occupyingNation, armies + fleets);
    }
  }

  return province;
};

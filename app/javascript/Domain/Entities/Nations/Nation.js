import Entity from '../Entity';

export default class Nation extends Entity {
  #homelands;
  #ownedForeignTerritories;

  #armyUnits;
  #navyUnits;

  constructor(id) {
    super(id);

    this.residingRondelSlot = null;
    this.treasury = 0;
    this.powerPoints = 0;
    this.taxChartPosition = 0;

    this.#homelands = new Set();
    this.#ownedForeignTerritories = new Set();

    // Map<province, uint>
    this.#armyUnits = new Map();
    this.#navyUnits = new Map();
  }

  get homelands() {
    return this.#homelands;
  }
  get ownedForeignTerritories() {
    return this.#ownedForeignTerritories;
  }

  get armyUnits() {
    return this.#armyUnits;
  }
  get navyUnits() {
    return this.#navyUnits;
  }
  get totalUnitCount() {
    let count = 0;

    for (const unitCount of this.#armyUnits.values()) {
      count += unitCount;
    }
    for (const unitCount of this.#navyUnits.values()) {
      count += unitCount;
    }

    return count;
  }
}

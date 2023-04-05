import Entity from './Entity';

import Rondel from './Rondel';

export default class AbstractImperialGame extends Entity {
  #rondel;
  #availableFreeRondelSlotCount = 3;
  #availablePaidRondelSlotCount = 3;

  #factoryBuildCosts = 5;

  #nations;
  #nationOrder;

  #swissBankers;

  constructor(id, nations, nationOrder) {
    super(id);

    this.#rondel = new Rondel();

    this.#nations = nations;
    this.#nationOrder = nationOrder;

    this.currentNation = this.firstNation;

    this.#swissBankers = new Set();
  }

  get rondel() {
    return this.#rondel;
  }

  get availableFreeRondelSlotCount() {
    return this.#availableFreeRondelSlotCount;
  }
  get availablePaidRondelSlotCount() {
    return this.#availablePaidRondelSlotCount;
  }

  get factoryBuildCosts() {
    return this.#factoryBuildCosts;
  }

  nationIdToEntity(nationId) {
    return this.#nations.get(nationId);
  }
  * allNations() {
    for (const nation of this.#nations.values()) {
      yield nation;
    }
  }
  get nationCount() {
    return this.#nations.size;
  }
  get firstNation() {
    return this.#nationOrder[0];
  }
  get lastNation() {
    return this.#nationOrder[this.#nationOrder.length - 1];
  }
  nationTurnAfter(nation) {
    let nationIndex = this.#nationOrder.indexOf(nation);

    nationIndex += 1;
    nationIndex %= this.#nationOrder.length;

    return this.#nationOrder[nationIndex];
  }

  get swissBankers() {
    return this.#swissBankers;
  }
}

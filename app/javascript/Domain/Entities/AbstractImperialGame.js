import Entity from './Entity';

import Rondel from './Rondel';

export default class AbstractImperialGame extends Entity {
  static get classId() {
    return 'AbstractImperialGame';
  }

  #rondel;
  #availableFreeRondelSlotCount = 3;
  #availablePaidRondelSlotCount = 3;

  #nations;
  #nationOrder;

  constructor(id, nations, nationOrder) {
    super(id);

    this.#rondel = new Rondel();

    this.#nations = nations;
    this.#nationOrder = nationOrder;

    this.currentNation = this.#nationOrder[0];
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

  * nations() {
    for (const nation of this.#nationOrder) {
      yield nation;
    }
  }
  nationIdToEntity(nationId) {
    return this.#nations.get(nationId);
  }
  get firstNation() {
    return this.#nationOrder[0];
  }
  nationTurnAfter(nation) {
    let nationIndex = this.#nationOrder.indexOf(nation);

    nationIndex += 1;
    nationIndex %= this.#nationOrder.length;

    return this.#nationOrder[nationIndex];
  }
}

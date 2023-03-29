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

  nationIdToEntity(nationId) {
    return this.#nations.get(nationId);
  }

  nationTurnAfter(nation) {
    let nationIndex = this.#nationOrder.indexOf(nation);

    nationIndex += 1;
    nationIndex %= this.#nationOrder.length;

    return this.#nationOrder[nationIndex];
  }
}

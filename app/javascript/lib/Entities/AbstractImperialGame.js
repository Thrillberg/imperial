import Entity from './Entity';

import Rondel from './Rondel';

export default class AbstractImperialGame extends Entity {
  static get classId() {
    return 'AbstractImperialGame';
  }

  #rondel;

  constructor(id) {
    super(id);

    this.#rondel = new Rondel();
  }

  get rondel() {
    return this.#rondel;
  }
}

import Entity from '../Entity';

export default class RondelSlot extends Entity {
  static get classId() {
    return 'RondelSlot';
  }

  #residingNations;

  constructor(id) {
    super(id);

    this.#residingNations = new Set();
  }

  get residingNations() {
    return this.#residingNations;
  }
}

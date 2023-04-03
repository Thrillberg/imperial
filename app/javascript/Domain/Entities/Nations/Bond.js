import Entity from '../Entity';

export default class Bond extends Entity {
  #nation;

  #interest;
  #cost;

  constructor(nation, interest, cost) {
    super(nation.id);

    this.#nation = nation;

    this.#interest = interest;
    this.#cost = cost;

    this.bearer = null;
  }

  get nation() {
    return this.#nation;
  }

  get interest() {
    return this.#interest;
  }
  get cost() {
    return this.#cost;
  }
}

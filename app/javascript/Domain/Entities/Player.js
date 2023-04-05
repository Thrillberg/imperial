import Entity from './Entity';

export default class Player extends Entity {
  #bonds;

  constructor(id) {
    super(id);

    this.cash = 0;

    // Todo: rework with Map<nation, bond> for easier querying
    this.#bonds = new Set();
    this.score = 0;
  }

  get bonds() {
    return this.#bonds;
  }

  // temporary only for migration
  get name() {
    return this.id;
  }
  get rawScore() {
    return this.score;
  }
  set rawScore(score) {
    this.score = score;
  }
}

import Entity from './Entity';

export default class Player extends Entity {
  #bonds;

  #governingNations;

  constructor(id) {
    super(id);

    this.cash = 0;

    this.uuid = '';

    // Todo: rework with Map<nation, bond> for easier querying
    this.#bonds = new Set();
    this.score = 0;

    this.#governingNations = new Set();
  }

  get bonds() {
    return this.#bonds;
  }
  * bondsOfNation(nation) {
    for (const bond of this.#bonds) {
      if (bond.nation === nation) {
        yield bond;
      }
    }
  }

  get isSwissBanker() {
    return this.#governingNations.size === 0;
  }
  get governingNations() {
    return this.#governingNations;
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

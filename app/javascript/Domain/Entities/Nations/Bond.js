import Entity from '../Entity';

export default class Bond extends Entity {
  static #bondCostsByInterest;

  static {
    Bond.#bondCostsByInterest = new Map();
    let marginalCost = 2;
    const marginalCostInterestIncreaseThresholds = [4, 6, 8];

    for (const interest of Bond.allInterestValues()) {
      const previousBondCost = interest <= 1 ? 0 : Bond.#bondCostsByInterest.get(interest - 1);

      if (marginalCostInterestIncreaseThresholds.includes(interest)) {
        marginalCost += 1;
      }

      Bond.#bondCostsByInterest.set(interest, previousBondCost + marginalCost);
    }
  }

  static* allInterestValues() {
    for (let interest = 1; interest <= 9; interest += 1) {
      yield interest;
    }
  }
  static bondCostByInterestValue(interestValue) {
    return Bond.#bondCostsByInterest.get(interestValue);
  }

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

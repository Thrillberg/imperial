import Entity from '../Entity';

import Bond from './Bond';

export default class Nation extends Entity {
  #allBonds;

  static get #bondCostsByInterest() {
    const bondCostsByInterest = new Map();

    let marginalCost = 2;
    const marginalCostInterestIncreaseThresholds = [4, 6, 8];

    for (let interest = 1; interest <= 9; interest += 1) {
      const previousBondCost = interest <= 1 ? 0 : bondCostsByInterest.get(interest - 1);

      if (marginalCostInterestIncreaseThresholds.includes(interest)) {
        marginalCost += 1;
      }

      bondCostsByInterest.set(interest, previousBondCost + marginalCost);
    }

    return bondCostsByInterest;
  }

  constructor(id) {
    super(id);

    this.residingRondelSlot = null;
    this.powerPoints = 0;
    this.treasury = 0;

    this.govenor = null;

    this.#allBonds = new Map();
    const bondCostsByInterest = Nation.#bondCostsByInterest;
    for (let interest = 1; interest <= 9; interest += 1) {
      const bond = new Bond(this, interest, bondCostsByInterest.get(interest));
      this.#allBonds.set(bond.interest, bond);
    }
    this.unsoldBonds = new Map(this.#allBonds);
  }

  * allBonds() {
    for (const bond in this.#allBonds.values()) {
      yield bond;
    }
  }
}

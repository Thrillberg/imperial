import Entity from '../Entity';

import Bond from './Bond';

export default class Nation extends Entity {
  #allBondsByInterestValue;
  #allBondsByCost;

  constructor(id) {
    super(id);

    this.residingRondelSlot = null;
    this.powerPoints = 0;
    this.treasury = 0;

    this.governor = null;

    this.#allBondsByInterestValue = new Map();
    this.#allBondsByCost = new Map();
    for (const interest of Bond.allInterestValues()) {
      const bond = new Bond(this, interest, Bond.bondCostByInterestValue(interest));

      this.#allBondsByInterestValue.set(bond.interest, bond);
      this.#allBondsByCost.set(bond.cost, bond);
    }
    this.unsoldBondsByInterestValue = new Map(this.#allBondsByInterestValue);
  }

  * allBonds() {
    for (const bond of this.#allBondsByInterestValue.values()) {
      yield bond;
    }
  }
  bondByInterestValue(interestValue) {
    return this.#allBondsByInterestValue.get(interestValue);
  }
  bondByCost(cost) {
    return this.#allBondsByCost.get(cost);
  }
  * allSoldBonds() {
    for (const interest of Bond.allInterestValues()) {
      if (this.unsoldBondsByInterestValue.has(interest) === false) {
        yield this.bondByInterestValue(interest);
      }
    }
  }
}

import Entity from '../Entity';

import Bond from './Bond';

export default class Nation extends Entity {
  #allBondsByInterestValue;

  constructor(id) {
    super(id);

    this.residingRondelSlot = null;
    this.powerPoints = 0;
    this.treasury = 0;

    this.govenor = null;

    this.#allBondsByInterestValue = new Map();
    for (const interest of Bond.allInterestValues()) {
      const bond = new Bond(this, interest, Bond.bondCostByInterestValue(interest));
      this.#allBondsByInterestValue.set(bond.interest, bond);
    }
    this.unsoldBondsByInterestValue = new Map(this.#allBondsByInterestValue);
  }

  * allBonds() {
    for (const bond in this.#allBondsByInterestValue.values()) {
      yield bond;
    }
  }
  bondByInterestValue(interestValue) {
    return this.#allBondsByInterestValue.get(interestValue);
  }
}

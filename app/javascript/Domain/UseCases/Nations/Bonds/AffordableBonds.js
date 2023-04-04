export default class AffordableBonds {
  static* bondsPurchasableInFull(nation, investor) {
    for (const bond of nation.unsoldBondsByInterestValue.values()) {
      if (investor.cash >= bond.cost) {
        yield bond;
      }
    }
  }
  static* allAffordableBonds(nation, investor) {
    // TODO: refactor player entity to allow quick filtering of bonds by nation
    const sameNationBonds = [];
    for (const bond of investor.bonds) {
      if (bond.nation === nation) {
        sameNationBonds.push(bond);
      }
    }

    for (const bond of nation.unsoldBondsByInterestValue.values()) {
      if (investor.cash >= bond.cost) {
        yield bond;
      } else {
        let canUpgrade = false;

        for (const alreadyOwnedBond of sameNationBonds) {
          if (alreadyOwnedBond.cost < bond.cost && investor.cash + alreadyOwnedBond.cost >= bond.cost) {
            canUpgrade = true;
            break;
          }
        }

        if (canUpgrade) {
          yield bond;
        }
      }
    }
  }
}

export default class AffordableBonds {
  static* bondsPurchasableInFull(nation, cash) {
    for (const bond of nation.unsoldBondsByInterestValue.values()) {
      if (cash >= bond.cost) {
        yield bond;
      }
    }
  }
  static* bondsUpgradableFrom(bond, cash) {
    for (const unsoldBond of bond.nation.unsoldBondsByInterestValue.values()) {
      if (bond.cost < unsoldBond.cost && cash < unsoldBond.cost && bond.cost + cash >= unsoldBond.cost) {
        yield bond;
      }
    }
  }
}

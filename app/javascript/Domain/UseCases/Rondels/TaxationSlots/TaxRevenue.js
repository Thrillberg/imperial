export default class TaxRevenue {
  #taxationSlot;

  constructor(taxationSlot) {
    this.#taxationSlot = taxationSlot;
  }

  static taxableFactoryCount(nation) {
    let taxableFactories = 0;

    for (const homeland in nation.homelands) {
      if (homeland.containsHostiles()) {
        taxableFactories += 1;
      }
    }

    return taxableFactories;
  }

  taxRevenueOf(nation) {
    const factoryRevenue = TaxRevenue.taxableFactoryCount(nation) * this.#taxationSlot.revenuePerFactory;
    const occupiedTerritoriesRevenue = nation.ownedForeignTerritories.size * this.#taxationSlot.revenuePerOccupiedTerritory;

    return Math.max(0, factoryRevenue + occupiedTerritoriesRevenue);
  }
}

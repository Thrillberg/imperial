export default class MaintenanceCosts {
  #taxationSlot;

  constructor(taxationSlot) {
    this.#taxationSlot = taxationSlot;
  }

  maintenanceCostsOf(nation) {
    return Math.max(0, nation.totalUnitCount * this.#taxationSlot.maintenanceCostPerUnit);
  }
}

import RondelSlot from './RondelSlot';

export default class TaxationSlot extends RondelSlot {
  static get classId() {
    return 'taxation';
  }

  #minTaxChartPosition = 5;
  #maxTaxChartPosition = 15;

  constructor(revenuePerFactory, revenuePerOccupiedTerritory, maintenanceCostPerUnit) {
    super(TaxationSlot.classId);

    this.revenuePerFactory = revenuePerFactory;
    this.revenuePerOccupiedTerritory = revenuePerOccupiedTerritory;

    this.maintenanceCostPerUnit = maintenanceCostPerUnit;
  }

  get minTaxChartPosition() {
    return this.#minTaxChartPosition;
  }
  get maxTaxChartPosition() {
    return this.#maxTaxChartPosition;
  }
}

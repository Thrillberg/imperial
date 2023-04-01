import Imperial2030Game from '../../../Entities/Imperial2030Game';
import ImperialAsiaGame from '../../../Entities/ImperialAsiaGame';
import ImperialEuropeGame from '../../../Entities/ImperialEuropeGame';

export default class GovernorBonus {
  #game;

  constructor(game) {
    this.#game = game;
  }

  taxChartPosition(taxRevenue) {
    const { taxationSlot } = this.#game.rondel;

    return Math.max(taxationSlot.minTaxChartPosition, Math.min(taxRevenue, taxationSlot.maxTaxChartPosition));
  }

  bonusBeforeMaintenanceCosts(nation, taxRevenue) {
    let bonus = 0;
    const bonusIncreaseThresholds = [6, 10, 12, 14, 16];

    switch (this.#game.constructor) {
      case ImperialEuropeGame:
        bonus = Math.max(0, this.taxChartPosition(taxRevenue) - nation.taxChartPosition);
        break;

      case Imperial2030Game:
      case ImperialAsiaGame:
      default:
        for (const bonusIncreaseThreshold of bonusIncreaseThresholds) {
          if (taxRevenue >= bonusIncreaseThreshold) {
            bonus += 1;
          }
        }
        break;
    }

    return bonus;
  }

  bonusAfterMaintenanceCosts(nation, taxRevenue, maintenanceCosts) {
    let remainingBonus = this.bonusBeforeMaintenanceCosts(nation, taxRevenue);
    const treasuryAmountAfterMaintenanceCosts = nation.treasury + taxRevenue - maintenanceCosts;

    switch (this.#game.constructor) {
      case ImperialEuropeGame:
        break;

      case Imperial2030Game:
      case ImperialAsiaGame:
      default:
        remainingBonus = Math.max(0, Math.min(remainingBonus, treasuryAmountAfterMaintenanceCosts));
        break;
    }

    return remainingBonus;
  }
}

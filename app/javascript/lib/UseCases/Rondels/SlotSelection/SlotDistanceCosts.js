import Imperial2030Game from '../../../Entities/Imperial2030Game';
import ImperialAsiaGame from '../../../Entities/ImperialAsiaGame';
import ImperialEuropeGame from '../../../Entities/ImperialEuropeGame';

export default class SlotDistanceCosts {
  constructor(game) {
    this.game = game;
  }

  costPerPaidRondelSlot(nation) {
    let costPerPaidDistance = 1;

    switch (this.game.constructor) {
      case ImperialEuropeGame:
        costPerPaidDistance += 1;
        break;

      case Imperial2030Game:
      case ImperialAsiaGame:
      default:
        costPerPaidDistance += Math.floor(nation.powerPoints / 5);
        break;
    }

    return costPerPaidDistance;
  }
}

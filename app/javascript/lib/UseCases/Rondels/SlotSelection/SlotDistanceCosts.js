import Imperial2030Game from "../../../Entities/Imperial2030Game";
import ImperialAsiaGame from "../../../Entities/ImperialAsiaGame";
import ImperialEuropeGame from "../../../Entities/ImperialEuropeGame";

export default class SlotDistanceCosts {
    costPerPaidRondelSlot(game, nation) {
        let costPerPaidDistance = 1;

        switch (game.constructor) {
            case ImperialEuropeGame:
                costPerPaidDistance += 1;
                break;

            case Imperial2030Game:
            case ImperialAsiaGame:
                costPerPaidDistance += Math.floor(nation.powerPoints / 5);
                break;
        }
    
        return costPerPaidDistance;
    }
}
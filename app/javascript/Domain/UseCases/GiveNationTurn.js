export default class GiveNationTurn {
    #game;

    constructor(game) {
        this.#game = game;
    }

    get #atLeastOneNationHasGovernor() {
        for (const nation of this.#game.nations()) {
            if (nation.govenor) {
              return true;
            }
        }

        return false;
    }

    giveTurnToNextGovernedNation() {
        if (this.#atLeastOneNationHasGovernor === false) {
            return;
        }

        while (!this.#game.currentNation.govenor) {
            this.giveTurnToNextNation();
        }
    }
    giveTurnToNextNation() {
        this.forceGiveTurnTo(this.#game.nationTurnAfter(this.#game.currentNation));
    }
    forceGiveTurnTo(nation) {
        this.#game.currentNation = nation;
    }
}
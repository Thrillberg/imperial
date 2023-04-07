export default class GiveTurn {
  #game;

  constructor(game) {
    this.#game = game;
  }

  get #atLeastOneNationHasGovernor() {
    for (const nation of this.#game.allNations()) {
      if (nation.governor) {
        return true;
      }
    }

    return false;
  }

  giveTurnToNextGovernedNation(undoHistory) {
    if (this.#atLeastOneNationHasGovernor === false) {
      return;
    }

    let nextGovernedNation = this.#game.currentNation;
    do {
      nextGovernedNation = this.#game.nationTurnAfter(nextGovernedNation);
    } while (nextGovernedNation.governor === null);

    this.forceGiveTurnTo(nextGovernedNation, undoHistory);
  }
  giveTurnToNextNation(undoHistory) {
    this.forceGiveTurnTo(this.#game.nationTurnAfter(this.#game.currentNation), undoHistory);
  }
  forceGiveTurnTo(nation, undoHistory) {
    if (undoHistory) {
      const previousNation = this.#game.currentNation;
      undoHistory.pushUndoOperation(() => this.forceGiveTurnTo(previousNation));
    }

    this.#game.currentNation = nation;
  }
}

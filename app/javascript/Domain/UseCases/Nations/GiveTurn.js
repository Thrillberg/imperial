const InvalidNationError = class extends Error {
  constructor(nation) {
    super(`Attempting to give turn to invalid nation ${nation}.`);

    this.name = 'InvalidNationError';
  }
};
const NoGovernedNationError = class extends Error {
  constructor() {
    super('Attempting to give turn to a governed nation but none of the nations are governed.');

    this.name = 'NoGovernedNationError';
  }
};

export default class GiveTurn {
  static get InvalidNationError() {
    return InvalidNationError;
  }
  static get NoGovernedNationError() {
    return NoGovernedNationError;
  }

  #game;

  constructor(game) {
    this.#game = game;
  }

  get #nextNation() {
    const nextNationIndex = (this.#game.currentNationIndex + 1) % this.#game.nationOrderCount;
    return this.#game.nationByOrder(nextNationIndex);
  }
  get #nextGovernedNation() {
    for (let i = 0; i < this.#game.nationOrderCount; i += 1) {
      const nextNationIndex = (this.#game.currentNationIndex + i) % this.#game.nationOrderCount;
      const nextNation = this.#game.nationByOrder(nextNationIndex);

      if (nextNation.governor) {
        return nextNation;
      }
    }

    return null;
  }

  giveTurnToNextGovernedNation(undoHistory) {
    const nextGovernedNation = this.#nextGovernedNation;
    if (nextGovernedNation === null) {
      throw new NoGovernedNationError();
    } else {
      this.forceGiveTurnTo(nextGovernedNation, undoHistory);
    }
  }
  giveTurnToNextNation(undoHistory) {
    this.forceGiveTurnTo(this.#nextNation, undoHistory);
  }
  forceGiveTurnTo(nation, undoHistory) {
    for (let i = 0; i < this.#game.nationOrderCount; i += 1) {
      const nextNationIndex = (this.#game.currentNationIndex + i) % this.#game.nationOrderCount;
      const nextNation = this.#game.nationByOrder(nextNationIndex);

      if (nextNation === nation) {
        this.#setCurrentNationIndex(nextNationIndex, undoHistory);
        return;
      }
    }

    throw new InvalidNationError(nation);
  }

  #setCurrentNationIndex(index, undoHistory) {
    if (undoHistory) {
      const previousNationIndex = this.#game.currentNationIndex;
      undoHistory.pushUndoOperation(() => this.#setCurrentNationIndex(previousNationIndex));
    }

    this.#game.currentNationIndex = index;
  }
}

export default class GiveInvestorCard {
  #game;

  constructor(game) {
    this.#game = game;
  }

  giveToNextPlayer(undoHistory) {
    let nextPlayerIndex = 0;
    if (this.#game.investorCardHolderPlayerIndex) {
      nextPlayerIndex = this.#game.investorCardHolderPlayerIndex + 1;
    } else {
      const firstNation = this.#game.nationByOrder(0);
      if (firstNation.governor) {
        for (let i = 0; i < this.#game.playerCount; i += 1) {
          if (this.#game.playerByOrder(i) === firstNation.governor) {
            nextPlayerIndex = i + 1;
            break;
          }
        }
      }
    }
    nextPlayerIndex %= this.#game.playerCount;

    this.#forceGiveCard(nextPlayerIndex, undoHistory);
  }

  #forceGiveCard(playerIndex, undoHistory) {
    if (undoHistory) {
      const previousInvestorCardHolderPlayerIndex = this.#game.investorCardHolderPlayerIndex;
      undoHistory.pushUndoOperation(() => this.#forceGiveCard(previousInvestorCardHolderPlayerIndex));
    }

    this.#game.investorCardHolderPlayerIndex = playerIndex;
  }
}

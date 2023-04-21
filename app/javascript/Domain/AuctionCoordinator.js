import Action from './action';

import AffordableBonds from './UseCases/Nations/Bonds/AffordableBonds';

export default class AuctionCoordinator {
  #gameCoordinator;

  #nationToAuction;
  #participatingPlayersInOrder;

  #auctionPlayerIndex = -1;

  #isComplete = false;

  constructor(gameCoordinator, nationToAuction, participatingPlayersInOrder) {
    this.#gameCoordinator = gameCoordinator;
    this.#nationToAuction = nationToAuction;
    this.#participatingPlayersInOrder = participatingPlayersInOrder;
  }

  get isComplete() {
    return this.#isComplete;
  }

  allowNextPlayerToBuy() {
    this.#auctionPlayerIndex += 1;
    if (this.#auctionPlayerIndex >= this.#participatingPlayersInOrder.length) {
      this.#isComplete = true;
    } else {
      const nextPlayer = this.#participatingPlayersInOrder[this.#auctionPlayerIndex];

      const allPurchasableBonds = new Set();
      for (const fullyPurchasableBond of AffordableBonds.bondsPurchasableInFull(this.#nationToAuction, nextPlayer.cash)) {
        const action = Action.bondPurchase({
          nation: this.#nationToAuction.id,
          player: nextPlayer.id,
          cost: fullyPurchasableBond.cost,
          tradeInValue: 0,
        });
        allPurchasableBonds.add(action);
      }
      for (const ownedBond of nextPlayer.bondsOfNation(this.#nationToAuction)) {
        for (const upgradableBond of AffordableBonds.bondsUpgradableFrom(ownedBond, nextPlayer.cash)) {
          const action = Action.bondPurchase({
            nation: this.#nationToAuction.id,
            player: nextPlayer.id,
            cost: upgradableBond.cost,
            tradeInValue: ownedBond.cost,
          });
          allPurchasableBonds.add(action);
        }
      }

      if (allPurchasableBonds.length === 0) {
        this.allowNextPlayerToBuy();
      } else {
        this.#gameCoordinator.availableActions = allPurchasableBonds;
        this.#gameCoordinator.availableActions.add(Action.skipBondPurchase({
          player: nextPlayer.id,
          nation: this.#nationToAuction.id,
        }));

        this.#gameCoordinator.changeCurrentPlayer(nextPlayer);
      }
    }
  }
}

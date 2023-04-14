import Action from './action';

import ChangeCurrentPlayer from "./UseCases/ChangeCurrentPlayer";

import AffordableBonds from "./UseCases/Nations/Bonds/AffordableBonds";

export default class AuctionCoordinator {
    #gameCoordinator;

    #nationToAuction;
    #participatingPlayersInOrder;

    #changeCurrentPlayer;

    #auctionPlayerIndex;

    #isComplete;

    constructor(gameCoordinator, nationToAuction, participatingPlayersInOrder) {
        this.#gameCoordinator = gameCoordinator;
        this.#nationToAuction = nationToAuction;
        this.#participatingPlayersInOrder = participatingPlayersInOrder;

        this.#changeCurrentPlayer = new ChangeCurrentPlayer(this.#gameCoordinator.game);

        this.#isComplete = false;
    }

    get isComplete() {
        return this.#isComplete;
    }

    beginAuction(undoHistory) {
        this.#auctionPlayerIndex = -1;
        this.#isComplete = false;

        this.allowNextPlayerToBuy(undoHistory);
    }

    allowNextPlayerToBuy(undoHistory) {
        this.#auctionPlayerIndex += 1;
        if (this.#auctionPlayerIndex >= this.#participatingPlayersInOrder.length) {
            this.#isComplete = true;
        } else {
            this.#changeCurrentPlayer.changeTo(this.#participatingPlayersInOrder[this.#auctionPlayerIndex], undoHistory);

            allPurchasableBonds = new Set();
            const currentPlayer = this.#gameCoordinator.game.currentPlayer;
            for (const fullyPurchasableBond of AffordableBonds.bondsPurchasableInFull(this.#nationToAuction, currentPlayer.cash)) {
                const action = Action.bondPurchase({
                    nation: this.#nationToAuction.id,
                    player: currentPlayer.id,
                    cost: fullyPurchasableBond.cost,
                    tradeInValue: 0,
                });
                allPurchasableBonds.add(action);
            }
            for (const ownedBond of currentPlayer.bondsOfNation(this.#nationToAuction)) {
                for (const upgradableBond of AffordableBonds.bondsUpgradableFrom(ownedBond, currentPlayer.cash)) {
                    const action = Action.bondPurchase({
                        nation: this.#nationToAuction.id,
                        player: currentPlayer.id,
                        cost: upgradableBond.cost,
                        tradeInValue: ownedBond.cost,
                    });
                    allPurchasableBonds.add(action);
                }
            }

            if (allPurchasableBonds.length === 0) {
                this.allowNextPlayerToBuy(undoHistory);
            } else {
                this.#gameCoordinator.availableActions = allPurchasableBonds;
                this.#gameCoordinator.availableActions.add(Action.skipBondPurchase({
                    player: currentPlayer.id,
                    nation: this.#nationToAuction.id,
                  }));
            }
        }
    }
}
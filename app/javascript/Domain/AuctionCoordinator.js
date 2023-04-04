import Action from './action';

import AffordableBonds from './UseCases/Nations/Bonds/AffordableBonds';
import PurchaseBonds from './UseCases/Nations/Bonds/PurchaseBond';

import GiveNationTurn from './UseCases/Nations/GiveTurn';

export default class AuctionCoordinator {
  // Todo: inherit from ImperialGameCoordinator

  #gameCoordinator;
  #auctionOrder;
  #initialStartingPlayer;

  #giveNationTurn;

  #nationsAuctioned = 0;
  #currentNationPlayerTurnsOffered = 0;

  #isAuctionInProgress = true;

  constructor(gameCoordinator, auctionOrder) {
    this.#gameCoordinator = gameCoordinator;
    this.#auctionOrder = auctionOrder;
    this.#initialStartingPlayer = this.#auctionOrder[0];

    this.#giveNationTurn = new GiveNationTurn(gameCoordinator.game);
  }

  get isAuctionInProgress() {
    return this.#isAuctionInProgress;
  }

  executeAction(action) {
    switch (action.type) {
      case 'initialize':
        this.#gameCoordinator.currentPlayerName = this.#auctionOrder[0];

        this.#offerPurchaseBondActions();
        this.#offerSkipPurchaseAction();
        break;

      case 'bondPurchase':
        this.#gameCoordinator.undoHistory.addUndoCheckpoint();

        this.#bondPurchase(action);

        this.#gameCoordinator.availableActions = new Set();
        this.#offerUndoAction();
        this.#nextAuctionTurn();
        break;

      case 'skipBondPurchase':
        this.#gameCoordinator.undoHistory.addUndoCheckpoint();

        this.#gameCoordinator.availableActions = new Set();
        this.#offerUndoAction();
        this.#nextAuctionTurn();
        break;

      default:
        break;
    }
  }

  #offerPurchaseBondActions() {
    const nation = this.#gameCoordinator.game.currentNation;
    const playerId = this.#gameCoordinator.currentPlayerName;
    const player = this.#gameCoordinator.players[playerId];

    const purchasableBonds = AffordableBonds.bondsPurchasableInFull(nation, player);
    for (const purchasableBond of purchasableBonds) {
      this.#gameCoordinator.availableActions.add(
        Action.bondPurchase({
          nation: nation.id,
          player: playerId,
          cost: purchasableBond.cost,
          tradeInValue: 0,
        }),
      );
    }
  }
  #offerSkipPurchaseAction() {
    const nation = this.#gameCoordinator.game.currentNation;
    const playerId = this.#gameCoordinator.currentPlayerName;

    this.#gameCoordinator.availableActions.add(
      Action.skipBondPurchase({
        player: playerId,
        nation: nation.id,
      })
    );
  }

  #bondPurchase(action) {
    const nation = this.#gameCoordinator.game.nationIdToEntity(action.payload.nation);
    const playerName = this.#gameCoordinator.currentPlayerName;
    const player = this.#gameCoordinator.players[playerName];

    const bond = nation.bondByCost(action.payload.cost);

    PurchaseBonds.purchase(player, bond, this.#gameCoordinator.undoHistory);
  }

  #offerUndoAction() {
    const playerId = this.#gameCoordinator.currentPlayerName;

    this.#gameCoordinator.availableActions.add(
      Action.undo({ player: playerId, })
    );
  }
  #nextAuctionTurn() {
    let availableNonBondActions = 0;

    do {
      this.#currentNationPlayerTurnsOffered += 1;
      if (this.#currentNationPlayerTurnsOffered >= this.#auctionOrder.length) {
        this.#auctionNextNation();

        if (this.#isAuctionInProgress === false) {
          this.#prepareStartGame();
          return;
        }
      }

      this.#giveTurnToNextPlayer();

      availableNonBondActions = this.#gameCoordinator.availableActions.size;
      this.#offerPurchaseBondActions();
      if (this.#gameCoordinator.availableActions.size !== availableNonBondActions) {
        this.#offerSkipPurchaseAction();
      }
    } while (this.#isAuctionInProgress && this.#gameCoordinator.availableActions.size === availableNonBondActions);
  }

  #auctionNextNation() {
    this.#currentNationPlayerTurnsOffered = 0;
    this.#nationsAuctioned += 1;

    if (this.#nationsAuctioned >= this.#gameCoordinator.game.nationCount) {
      this.#nationsAuctioned = 0;
      this.#isAuctionInProgress = this.#giveNationTurn.atLeastOneNationHasGovernor === false;
    }

    if (this.#isAuctionInProgress) {
      // next nation starts with a different player
      this.#giveTurnToNextPlayer();
      this.#giveNationTurn.giveTurnToNextNation(this.#gameCoordinator.undoHistory);
    }
  }
  #giveTurnToNextPlayer() {
    this.#auctionOrder.push(this.#auctionOrder.shift());
    this.#gameCoordinator.currentPlayerName = this.#auctionOrder[0];
  }

  #prepareStartGame() {
    // Todo: this method don't belong here
    this.#giveNationTurn.giveTurnToNextGovernedNation(this.#gameCoordinator.undoHistory);
      this.#gameCoordinator.currentPlayerName = this.#gameCoordinator.game.currentNation.governor.name;

    for (const availableAction of this.#gameCoordinator.availableRondelActions(this.#gameCoordinator.currentNation)) {
      this.#gameCoordinator.availableActions.add(availableAction);
    }

    if (this.#gameCoordinator.variant !== 'withoutInvestorCard') {
      const firstNationGovernor = this.#gameCoordinator.game.firstNation.governor;
      if (firstNationGovernor) {
        let playerIndexAfterFirstNationGovernor = this.#auctionOrder.indexOf(firstNationGovernor.name) + 1;
        playerIndexAfterFirstNationGovernor %= this.#auctionOrder.length;

        this.#gameCoordinator.investorCardHolder = this.#auctionOrder[playerIndexAfterFirstNationGovernor];
      } else {
        this.#gameCoordinator.investorCardHolder = this.#initialStartingPlayer;
      }
    }
  }
}

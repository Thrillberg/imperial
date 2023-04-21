import Entity from './Entity';

import Rondel from './Rondel';

export default class AbstractImperialGame extends Entity {
  #players;
  #playerOrder;

  #nations;
  #nationOrder;

  #swissBankers;

  #rondel;
  #availableFreeRondelSlotCount = 3;
  #availablePaidRondelSlotCount = 3;
  #factoryBuildCosts = 5;

  constructor(id, playerOrder, nationOrder) {
    super(id);

    this.#players = new Map();
    this.#playerOrder = playerOrder;
    for (const player of this.#playerOrder) {
      this.#players.set(player.name, player);
    }
    this.currentPlayer = null;

    this.#nations = new Map();
    this.#nationOrder = nationOrder;
    for (const nation of this.#nationOrder) {
      this.#nations.set(nation.id, nation);
    }
    this.currentNationIndex = 0;

    this.#swissBankers = new Set(this.#playerOrder);
    this.investorCardHolderPlayerIndex = null;

    this.#rondel = new Rondel();
  }

  playerIdToEntity(playerId) {
    return this.#players.get(playerId);
  }
  * allPlayers() {
    for (const player in this.#players.values()) {
      yield player;
    }
  }
  get playerCount() {
    return this.#players.size;
  }
  get playerOrderCount() {
    return this.#playerOrder.length;
  }
  playerByOrder(index) {
    return this.#playerOrder[index];
  }
  get investorCardHolder() {
    if (this.investorCardHolderPlayerIndex) {
      return this.#playerOrder[this.investorCardHolderPlayerIndex];
    }
    return null;
  }

  get rondel() {
    return this.#rondel;
  }
  get availableFreeRondelSlotCount() {
    return this.#availableFreeRondelSlotCount;
  }
  get availablePaidRondelSlotCount() {
    return this.#availablePaidRondelSlotCount;
  }
  get factoryBuildCosts() {
    return this.#factoryBuildCosts;
  }

  nationIdToEntity(nationId) {
    return this.#nations.get(nationId);
  }
  * allNations() {
    for (const nation of this.#nations.values()) {
      yield nation;
    }
  }
  get nationCount() {
    return this.#nations.size;
  }
  get nationOrderCount() {
    return this.#nationOrder.length;
  }
  nationByOrder(index) {
    return this.#nationOrder[index];
  }
  get currentNation() {
    return this.#nationOrder[this.currentNationIndex];
  }
  get areAnyNationsGoverned() {
    for (const nation of this.allNations()) {
      if (nation.governor) {
        return true;
      }
    }

    return false;
  }

  get swissBankers() {
    return this.#swissBankers;
  }
}

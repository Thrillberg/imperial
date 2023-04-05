import Entity from './Entity';

import Rondel from './Rondel';

export default class AbstractImperialGame extends Entity {
  #players;
  #playerOrder;

  #rondel;
  #availableFreeRondelSlotCount = 3;
  #availablePaidRondelSlotCount = 3;
  #factoryBuildCosts = 5;

  #nations;
  #nationOrder;

  #swissBankers;

  constructor(id, playerOrder, nationOrder) {
    super(id);

    this.#players = new Map();
    this.#playerOrder = playerOrder;
    for (const player in this.#playerOrder) {
      this.#players.set(player.name, player);
    }
    this.currentPlayerIndex = 0;

    this.#rondel = new Rondel();

    this.#nations = new Map();
    this.#nationOrder = nationOrder;
    for (const nation in this.#nationOrder) {
      this.#nations.set(nation.id, nation);
    }
    this.currentNationIndex = 0;

    this.#swissBankers = new Set(this.#playerOrder);
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
  get currentPlayer() {
    return this.#playerOrder[this.currentPlayerIndex];
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
  * nationOrder() {
    for (let i = 0; i < this.#nationOrder.length; i += 1) {
      yield [i, this.#nationOrder[i]];
    }
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

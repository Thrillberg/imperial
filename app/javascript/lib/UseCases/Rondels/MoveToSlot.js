import AvailableSlots from './SlotSelection/AvailableSlots';
import SlotDistanceCosts from './SlotSelection/SlotDistanceCosts';

const InvalidMoveError = class extends Error {
  constructor(fromRondelSlot, toRondelSlot) {
    super(`Attepting to make invalid move from ${fromRondelSlot?.id} to ${toRondelSlot.id}.`);

    this.name = 'InvalidMoveError';
  }
};

export default class MoveToSlot {
  static get InvalidMoveError() {
    return InvalidMoveError;
  }

  #availableSlots;
  #costs;

  constructor(game) {
    this.#availableSlots = new AvailableSlots(game.rondel, game.availableFreeRondelSlotCount, game.availablePaidRondelSlotCount);
    this.#costs = new SlotDistanceCosts(game);
  }

  get availableSlots() {
    return this.#availableSlots;
  }
  get slotDistanceCosts() {
    return this.#costs;
  }

  forceMoveNation(nation, toRondelSlot) {
    if (nation.residingRondelSlot) {
      nation.residingRondelSlot.residingNations.delete(nation);
    }

    nation.residingRondelSlot = toRondelSlot;
    toRondelSlot.residingNations.add(nation);
  }
  tryMoveNation(governor, nation, toRondelSlot) {
    const availableFreeSlots = this.#availableSlots.nextAvailableFreeRondelSlots(nation.residingRondelSlot);

    let isValidMove = availableFreeSlots.has(toRondelSlot);
    let moveCosts = 0;

    if (isValidMove == false) {
      const availablePaidSlots = this.#availableSlots.nextAvailablePaidRondelSlots(nation.residingRondelSlot, this.#costs.costPerPaidRondelSlot(nation));

      isValidMove = availablePaidSlots.has(toRondelSlot);
      if (isValidMove) {
        moveCosts = availablePaidSlots.get(toRondelSlot);
      }
    }

    if (isValidMove) {
      this.forceMoveNation(nation, toRondelSlot);
      governor.cash -= moveCosts;
    } else {
      throw new InvalidMoveError(nation.residingRondelSlot, toRondelSlot);
    }
  }
}

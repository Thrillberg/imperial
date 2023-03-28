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

  static forceMoveNation(nation, toRondelSlot) {
    if (nation.residingRondelSlot) {
      nation.residingRondelSlot.residingNations.delete(nation);
    }

    nation.residingRondelSlot = toRondelSlot;
    toRondelSlot.residingNations.add(nation);
  }
  tryMoveNation(governor, nation, toRondelSlot) {
    const fromRondelSlot = nation.residingRondelSlot;
    const availableFreeSlots = this.#availableSlots.nextAvailableFreeRondelSlots(fromRondelSlot);

    let isValidMove = availableFreeSlots.has(toRondelSlot);
    let moveCosts = 0;

    if (isValidMove === false) {
      const costPerPaidRondelSlot = this.#costs.costPerPaidRondelSlot(nation);
      const availablePaidSlots = this.#availableSlots.nextAvailablePaidRondelSlots(fromRondelSlot, costPerPaidRondelSlot);

      isValidMove = availablePaidSlots.has(toRondelSlot);
      if (isValidMove) {
        moveCosts = availablePaidSlots.get(toRondelSlot);
      }
    }

    if (isValidMove) {
      MoveToSlot.forceMoveNation(nation, toRondelSlot);
      governor.cash -= moveCosts;
    } else {
      throw new InvalidMoveError(nation.residingRondelSlot, toRondelSlot);
    }
  }
}

export default class AvailableSlots {
  #rondel;

  #availableFreeActionsSlotCount;
  #availablePaidActionsSlotCount;

  constructor(rondel, availableFreeActionsSlotCount, availablePaidActionsSlotCount) {
    this.#rondel = rondel;

    this.#availableFreeActionsSlotCount = availableFreeActionsSlotCount;
    this.#availablePaidActionsSlotCount = availablePaidActionsSlotCount;
  }

  nextAvailableFreeRondelSlots(currentSlot) {
    const availableFreeActions = new Set();

    if (currentSlot) {
      for (let i = 0; i < this.#availableFreeActionsSlotCount; i += 1) {
        currentSlot = this.#rondel.slotClockwiseTo(currentSlot, 1);
        availableFreeActions.add(currentSlot);
      }
    } else {
      for (const availableSlot of this.#rondel.allSlots()) {
        availableFreeActions.add(availableSlot);
      }
    }

    return availableFreeActions;
  }

  nextAvailablePaidRondelSlots(currentSlot, costPerPaidSlotDistance) {
    const availablePaidActions = new Map();

    if (currentSlot) {
      currentSlot = this.#rondel.slotClockwiseTo(currentSlot, this.#availableFreeActionsSlotCount);

      for (let i = 0; i < this.#availablePaidActionsSlotCount; i += 1) {
        const cost = (i + 1) * costPerPaidSlotDistance;

        currentSlot = this.#rondel.slotClockwiseTo(currentSlot, 1);
        availablePaidActions.set(currentSlot, cost);
      }
    }

    return availablePaidActions;
  }
}

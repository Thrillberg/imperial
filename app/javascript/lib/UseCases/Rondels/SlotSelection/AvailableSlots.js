export default class AvailableSlots {
  constructor(rondel, availableFreeActionsSlotCount, availablePaidActionsSlotCount, costPerPaidSlotDistance) {
    this.rondel = rondel;

    this.availableFreeActionsSlotCount = availableFreeActionsSlotCount;
    this.availablePaidActionsSlotCount = availablePaidActionsSlotCount;

    this.costPerPaidSlotDistance = costPerPaidSlotDistance;
  }

  nextAvailableFreeRondelSlots(currentSlot) {
    const availableFreeActions = new Set();

    if (currentSlot) {
      for (let i = 0; i < this.availableFreeActionsSlotCount; i += 1) {
        currentSlot = this.rondel.slotClockwiseTo(currentSlot, 1);
        availableFreeActions.add(currentSlot);
      }
    } else {
      for (const availableSlot of this.rondel.slotOrder) {
        availableFreeActions.add(availableSlot);
      }
    }

    return availableFreeActions;
  }

  nextAvailablePaidRondelSlots(currentSlot) {
    const availablePaidActions = new Map();

    currentSlot = this.rondel.slotClockwiseTo(currentSlot, this.availableFreeActionsSlotCount);

    for (let i = 0; i < this.availablePaidActionsSlotCount; i += 1) {
      const cost = (i + 1) * this.costPerPaidSlotDistance;

      currentSlot = this.rondel.slotClockwiseTo(currentSlot, 1);
      availablePaidActions.set(currentSlot, cost);
    }

    return availablePaidActions;
  }
}

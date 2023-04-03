import RondelSlot from './RondelSlots/RondelSlot';

import FactorySlot from './RondelSlots/FactorySlot';

const Production1 = 'production1';
const Maneuver1 = 'maneuver1';
const Investor = 'investor';
const Import = 'import';
const Production2 = 'production2';
const Maneuver2 = 'maneuver2';
const Taxation = 'taxation';

export default class Rondel {
  #translator;

  #slotOrder;

  constructor() {
    this.#translator = new Map();
    this.#translator.set(FactorySlot.classId, new FactorySlot());
    this.#translator.set(Production1, new RondelSlot(Production1));
    this.#translator.set(Maneuver1, new RondelSlot(Maneuver1));
    this.#translator.set(Investor, new RondelSlot(Investor));
    this.#translator.set(Import, new RondelSlot(Import));
    this.#translator.set(Production2, new RondelSlot(Production2));
    this.#translator.set(Maneuver2, new RondelSlot(Maneuver2));
    this.#translator.set(Taxation, new RondelSlot(Taxation));

    this.#slotOrder = [
      this.factorySlot,
      this.production1Slot,
      this.maneuver1Slot,
      this.investorSlot,
      this.importSlot,
      this.production2Slot,
      this.maneuver2Slot,
      this.taxationSlot,
    ];
  }

  * allSlots() {
    for (const slot of this.#slotOrder) {
      yield slot;
    }
  }
  get factorySlot() {
    return this.idToEntity(FactorySlot.classId);
  }
  get production1Slot() {
    return this.idToEntity(Production1);
  }
  get maneuver1Slot() {
    return this.idToEntity(Maneuver1);
  }
  get investorSlot() {
    return this.idToEntity(Investor);
  }
  get importSlot() {
    return this.idToEntity(Import);
  }
  get production2Slot() {
    return this.idToEntity(Production2);
  }
  get maneuver2Slot() {
    return this.idToEntity(Maneuver2);
  }
  get taxationSlot() {
    return this.idToEntity(Taxation);
  }

  idToEntity(string) {
    return this.#translator.get(string);
  }

  slotClockwiseTo(slot, slotCounts) {
    let slotIndex = this.#slotOrder.indexOf(slot);

    slotIndex += slotCounts;
    slotIndex %= this.#slotOrder.length;

    return this.#slotOrder[slotIndex];
  }

  passedInvestor(exclusiveFromSlot, exclusiveToSlot) {
    while (exclusiveFromSlot !== exclusiveToSlot) {
      exclusiveFromSlot = this.slotClockwiseTo(exclusiveFromSlot, 1);

      if (exclusiveFromSlot === exclusiveToSlot) {
        break;
      }

      if (exclusiveFromSlot === this.investorSlot) {
        return true;
      }
    }

    return false;
  }
}

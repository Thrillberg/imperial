import FactorySlot from "./RondelSlots/FactorySlot";
import RondelSlot from "./RondelSlots/RondelSlot";

const Production1 = 'production1';
const Maneuver1 = 'maneuver1';
const Investor = 'investor';
const Import = 'import';
const Production2 = 'production2';
const Maneuver2 = 'maneuver2';
const Taxation = 'taxation';

export default class Rondel {
    #translator;

    constructor() {
        this.#translator = new Map();
        this.#translator.set(FactorySlot.Representation, new FactorySlot(5));
        this.#translator.set(Production1, new RondelSlot(Production1));
        this.#translator.set(Maneuver1, new RondelSlot(Maneuver1));
        this.#translator.set(Investor, new RondelSlot(Investor));
        this.#translator.set(Import, new RondelSlot(Import));
        this.#translator.set(Production2, new RondelSlot(Production2));
        this.#translator.set(Maneuver2, new RondelSlot(Maneuver2));
        this.#translator.set(Taxation, new RondelSlot(Taxation));

        this.slotOrder = [
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

    get factorySlot() {
        return this.representationToEntity(FactorySlot.Representation);
    }
    get production1Slot() {
        return this.representationToEntity(Production1);
    }
    get maneuver1Slot() {
        return this.representationToEntity(Maneuver1);
    }
    get investorSlot() {
        return this.representationToEntity(Investor);
    }
    get importSlot() {
        return this.representationToEntity(Import);
    }
    get production2Slot() {
        return this.representationToEntity(Production2);
    }
    get maneuver2Slot() {
        return this.representationToEntity(Maneuver2);
    }
    get taxationSlot() {
        return this.representationToEntity(Taxation);
    }

    representationToEntity(string) {
        return this.#translator.get(string)
    }

    slotClockwiseTo(Slot, SlotCounts) {
        let slotIndex = this.slotOrder.indexOf(Slot); 
        slotIndex += SlotCounts;

        slotIndex %= this.slotOrder.length;
        return this.slotOrder[slotIndex];
    }

    passedInvestor(exclusiveFromSlot, inclusiveToSlot) {
        do {
            exclusiveFromSlot = this.slotClockwiseTo(exclusiveFromSlot, 1);

            if (exclusiveFromSlot === this.investorSlot) {
                return true;
            }
        } while (exclusiveFromSlot !== inclusiveToSlot);

        return false;
    }
};
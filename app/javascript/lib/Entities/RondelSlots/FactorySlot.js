import RondelSlot from "./RondelSlot";

export default class FactorySlot extends RondelSlot {
    static get id() {
        return 'factory';
    }

    constructor(costToBuild) {
        super(FactorySlot.id);

        this.costToBuild = costToBuild;
    }
};
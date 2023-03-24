import RondelSlot from "./RondelSlot";

export default class FactorySlot extends RondelSlot {
    static get Representation() {
        return 'factory';
    }

    constructor(costToBuild) {
        super(FactorySlot.Representation);

        this.costToBuild = costToBuild;
    }
};
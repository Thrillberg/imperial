import RondelSlot from "./RondelSlot";

export default class FactorySlot extends RondelSlot {
    static get classId() {
        return 'factory';
    }

    constructor(costToBuild) {
        super(FactorySlot.classId);

        this.costToBuild = costToBuild;
    }
};
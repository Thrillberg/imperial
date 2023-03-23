import RondelTile from "./RondelTile";

export default class FactoryTile extends RondelTile {
    static get Representation() {
        return 'factory';
    }

    constructor(costToBuild) {
        super(FactoryTile.Representation);

        this.costToBuild = costToBuild;
    }
};
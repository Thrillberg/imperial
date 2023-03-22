import RondelTile from "./RondelTile";

const FactoryRepresentation = 'factory';

export default class FactoryTile extends RondelTile {
    static get Representation() {
        return FactoryRepresentation;
    }

    constructor(costToBuild) {
        super(FactoryTile.Representation);

        this.costToBuild = costToBuild;
    }

    canAffordToBuild(nation, player) {
        return nation.treasury + player.cash >= this.costToBuild;
    }

    buildableFactoriesLocations(homeProvinces) {
        const buildableLocations = new Set();

        for (const province of homeProvinces) {
            if (province.isDevoidOfFactory && province.isNotOccupiedByHostiles) {
                buildableLocations.add(province);
            }
        }

        return buildableLocations;
    }
};
export default class FactoryTile_Build_Permissions {
    constructor(factoryTile) {
        this.factoryTile = factoryTile;
    }

    canAffordToBuild(nation, player) {
        return nation.treasury + player.cash >= this.factoryTile.costToBuild;
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
}
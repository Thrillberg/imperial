export default class Permissions {
    constructor(factorySlot) {
        this.factorySlot = factorySlot;
    }

    canAffordToBuild(nation, player) {
        return nation.treasury + player.cash >= this.factorySlot.costToBuild;
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
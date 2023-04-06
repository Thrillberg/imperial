export default class Permissions {
  #costToBuild;

  constructor(costToBuild) {
    this.#costToBuild = costToBuild;
  }

  canAffordToBuild(nation, player) {
    return nation.treasury + player.cash >= this.#costToBuild;
  }

  static buildableFactoriesLocations(homeProvinces) {
    const buildableLocations = new Set();

    for (const province of homeProvinces) {
      if (province.isDevoidOfFactory && province.isNotOccupiedByHostiles) {
        buildableLocations.add(province);
      }
    }

    return buildableLocations;
  }
}

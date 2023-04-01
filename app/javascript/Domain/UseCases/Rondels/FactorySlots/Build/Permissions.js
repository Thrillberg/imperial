export default class Permissions {
  constructor(factorySlot) {
    this.factorySlot = factorySlot;
  }

  canAffordToBuild(nation, player) {
    return nation.treasury + player.cash >= this.factorySlot.costToBuild;
  }

  static* buildableFactoriesLocations(homeProvinces) {
    for (const province of homeProvinces) {
      if (province.isDevoidOfFactory && province.isDevoidOfHostiles) {
        yield province;
      }
    }
  }
}

export default class FactoryTile_Build_ChargeCosts {
    constructor(factoryTile) {
        this.factoryTile = factoryTile;
    }

    nationCosts(nation) {
        return Math.min(nation.treasury, this.factoryTile.costToBuild);
    }
    playerCosts(nation, player) {
        const owedAmounts = this.factoryTile.costToBuild - this.nationCosts(nation);

        return Math.max(0, Math.min(owedAmounts, player.cash));
    }
}
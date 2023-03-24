export default class ChargeCosts {
    constructor(factorySlot) {
        this.factorySlot = factorySlot;
    }

    nationCosts(nation) {
        return Math.min(nation.treasury, this.factorySlot.costToBuild);
    }
    playerCosts(nation, player) {
        const owedAmounts = this.factorySlot.costToBuild - this.nationCosts(nation);

        return Math.max(0, Math.min(owedAmounts, player.cash));
    }
}
export default class ChargeCosts {
  #costToBuild;

  constructor(costToBuild) {
    this.#costToBuild = costToBuild;
  }

  nationCosts(nation) {
    return Math.min(nation.treasury, this.#costToBuild);
  }
  playerCosts(nation, player) {
    const owedAmounts = this.#costToBuild - this.nationCosts(nation);

    return Math.max(0, Math.min(owedAmounts, player.cash));
  }
}

export default class ElectGovernor {
  #game;

  constructor(game) {
    this.#game = game;
  }

  electMostInvestedBondBearer(nation, undoHistory) {
    const bondBearers = new Map();
    for (const bond of nation.allSoldBonds()) {
      const alreadyBorneCost = bondBearers.has(bond.bearer) ? bondBearers.get(bond.bearer) : 0;
      const newlyBorneCost = alreadyBorneCost + bond.cost;

      bondBearers.set(bond.bearer, newlyBorneCost);
    }

    let newGovernor = nation.governor;
    let newGovernorInvestedAmount = newGovernor ? bondBearers.get(newGovernor) : 0;
    for (const [bearer, totalBondCost] of bondBearers) {
      if (totalBondCost > newGovernorInvestedAmount) {
        newGovernor = bearer;
        newGovernorInvestedAmount = totalBondCost;
      }
    }

    this.forceElect(nation, newGovernor, undoHistory);
  }

  forceElect(nation, governor, undoHistory) {
    if (nation.governor === governor) {
      return;
    }

    const previousGovernor = nation.governor;

    if (undoHistory) {
      undoHistory.pushUndoOperation(() => this.forceElect(nation, previousGovernor));
    }

    nation.governor = governor;

    if (previousGovernor) {
      previousGovernor.governingNations.delete(nation);
      if (previousGovernor.isSwissBanker) {
        this.#game.swissBanker.add(previousGovernor);
      }
    }

    if (governor) {
      governor.governingNations.add(nation);
      this.#game.swissBanker.delete(governor);
    }
  }
}

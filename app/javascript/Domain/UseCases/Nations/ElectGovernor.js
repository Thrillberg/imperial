export default class ElectGovernor {
  static electMostInvestedBondBearer(nation, undoHistory) {
    const bondBearers = new Map();
    for (const bond of nation.allSoldBonds()) {
      const alreadyBorneCost = bondBearers.has(bond.bearer) ? bondBearers.get(bond.bearer) : 0;
      const newlyBorneCost = alreadyBorneCost + bond.cost;

      bondBearers.set(bond.bearer, newlyBorneCost);
    }

    let newGovernor = nation.governor;
    let newGovernorInvestedAmount = newGovernor ? bondBearers.get(newGovernor) : 0;
    for (let [bearer, totalBondCost] of bondBearers) {
      if (totalBondCost > newGovernorInvestedAmount) {
        newGovernor = bearer;
        newGovernorInvestedAmount = totalBondCost;
      }
    }

    ElectGovernor.forceElect(nation, newGovernor, undoHistory);
  }

  static forceElect(nation, governor, undoHistory) {
    if (nation.governor === governor) {
      return;
    }

    if (undoHistory) {
      const previousgovernor = nation.governor;
      undoHistory.pushUndoOperation(() => ElectGovernor.forceElect(nation, previousgovernor));
    }

    nation.governor = governor;
  }
}

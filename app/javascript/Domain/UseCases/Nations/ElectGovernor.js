export default class ElectGovernor {
    static electMostInvestedBondBearer(nation, undoHistory) {
        const bondBearers = new Map();
        for (const bond in nation.allSoldBonds()) {
            if (bondBearers.has(bond.bearer) === false) {
                bondBearers.set(bond.bearer, 0);
            }

            const bearedCost = bondBearers.get(bond.bearer) + bond.cost;
            bondBearers.set(bond.bearer, bearedCost);
        }

        let newGovernor = nation.governor;
        let newGovernorInvestedAmount = newGovernor ? bondBearers.get(newGovernor) : 0;
        for (const [bearer, totalBondCost] in bondBearers) {
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
export default class AssignBond {
  static assign(bond, newBearer, undoHistory) {
    if (bond.bearer === newBearer) {
      return;
    }

    if (undoHistory) {
      const originalBearer = bond.bearer;
      undoHistory.pushUndoOperation(() => AssignBond.assign(bond, originalBearer));
    }

    if (bond.bearer) {
      bond.bearer.bonds.delete(bond);
    }
    bond.bearer = newBearer;

    if (newBearer) {
      newBearer.bonds.add(bond);
      bond.nation.unsoldBondsByInterestValue.delete(bond.interest);
    } else {
      bond.nation.unsoldBondsByInterestValue.set(bond.interest, bond);
    }
  }
  static unassign(bond, undoHistory) {
    AssignBond.assign(bond, null, undoHistory);
  }
}

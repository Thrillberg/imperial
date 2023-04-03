export default class AssignBond {
  static Assign(bond, newBearer, undoHistory) {
    if (undoHistory) {
      const originalBearer = bond.bearer;
      undoHistory.pushUndoOperation(() => AssignBond.Assign(bond, originalBearer));
    }

    if (bond.bearer) {
      bond.bearer.bonds.delete(bond);
    }

    if (newBearer) {
      newBearer.bonds.add(bond);
    }

    bond.bearer = newBearer;
  }
  static Unassign(bond, undoHistory) {
    AssignBond(bond, null, undoHistory);
  }
}

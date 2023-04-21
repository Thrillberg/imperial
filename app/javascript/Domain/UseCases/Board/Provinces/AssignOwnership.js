export default class AssignOwnership {
  assignAsHomeProvince(province, nation, undoHistory) {
    this.#unregisterFromNationProvince(province);
    this.#registerNationHomeProvince(province, nation, undoHistory);

    this.#reassignProvinceOwnership(province, nation, undoHistory);
  }
  assignAsColony(province, nation, undoHistory) {
    this.#unregisterFromNationProvince(province);
    this.#registerNationColony(province, nation, undoHistory);

    this.#reassignProvinceOwnership(province, nation, undoHistory);
  }

  #unregisterFromNationProvince(province, undoHistory) {
    const originalOwnership = province.ownership;
    if (originalOwnership) {
      if (originalOwnership.homeProvinces.delete(province)) {
        if (undoHistory) {
          undoHistory.pushUndoOperation(() => originalOwnership.homeProvinces.add(province));
        }
      }

      if (originalOwnership.colonies.delete(province)) {
        if (undoHistory) {
          undoHistory.pushUndoOperation(() => originalOwnership.colonies.add(province));
        }
      }
    }
  }

  #registerNationHomeProvince(province, nation, undoHistory) {
    nation.homeProvinces.add(province);
    if (undoHistory) {
      undoHistory.pushUndoOperation(() => nation.homeProvinces.delete(province));
    }
  }
  #registerNationColony(province, nation, undoHistory) {
    nation.colonies.add(province);
    if (undoHistory) {
      undoHistory.pushUndoOperation(() => nation.colonies.delete(province));
    }
  }

  #reassignProvinceOwnership(province, nation, undoHistory) {
    if (province.ownership === nation) {
      return;
    }

    if (undoHistory) {
      const originalOwnership = province.ownership;
      undoHistory.pushUndoOperation(() => this.#reassignProvinceOwnership(province, originalOwnership));
    }

    province.ownership = nation;
  }
}

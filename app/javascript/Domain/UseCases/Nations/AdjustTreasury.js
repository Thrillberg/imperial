const InsufficientTreasuryError = class extends Error {
  constructor(nation, value) {
    super(`${nation} cannot afford ${Math.abs(value)}`);

    this.name = 'InsufficientTreasuryError';
  }
};

export default class AdjustTreasury {
  static get InsufficientTreasuryError() {
    return InsufficientTreasuryError;
  }

  static changeBy(nation, amount, undoHistory) {
    if (nation.treasury + amount < 0) {
      throw new InsufficientTreasuryError(nation, amount);
    }

    if (undoHistory) {
      const originalAmount = nation.treasury;
      undoHistory.pushUndoOperation(() => { nation.treasury = originalAmount; });
    }

    if (amount) {
      nation.treasury = Math.max(0, nation.treasury + amount);
    }
  }
}

const InsufficientCashError = class extends Error {
  constructor(investor, value) {
    super(`${investor} cannot afford ${Math.abs(value)}`);

    this.name = 'InsufficientCashError';
  }
};

export default class AdjustCash {
  static get InsufficientCashError() {
    return InsufficientCashError;
  }

  static changeBy(investor, amount, undoHistory) {
    if (investor.cash + amount < 0) {
      throw new InsufficientCashError(investor, amount);
    }

    if (undoHistory) {
      const originalAmount = investor.cash;
      undoHistory.pushUndoOperation(() => { investor.cash = originalAmount; });
    }

    if (amount) {
      investor.cash = Math.max(0, investor.cash + amount);
    }
  }
}

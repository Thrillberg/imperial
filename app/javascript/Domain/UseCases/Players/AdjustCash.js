export default class AdjustCash {
  static changeBy(player, amount, undoHistory) {
    if (undoHistory) {
      const originalAmount = player.cash;
      undoHistory.pushUndoOperation(() => { player.cash = originalAmount; });
    }

    if (amount) {
      player.cash = Math.max(0, player.cash + amount);
    }
  }
}

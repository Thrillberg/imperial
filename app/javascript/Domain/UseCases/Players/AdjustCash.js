export default class AdjustCash {
    #game;

    constructor(game) {
        this.#game = game;
    }

    static changeBy(player, amount) {
        if (amount) {
            player.cash = Math.max(0, player.cash + amount);
        }
    }
    undoableChangeBy(player, amount) {
        if (amount) {
            const originalAmount = player.cash;
            this.#game.pushUndoOperation(() => player.cash = originalAmount);

            AdjustCash.changeBy(player, amount);
        }
    }
}
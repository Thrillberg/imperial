export default class ChangeCurrentPlayer {
    #game;

    constructor(game) {
        this.#game = game;
    }

    changeTo(player, undoHistory) {
        if (undoHistory) {
            const previousPlayer = this.#game.currentPlayer;

            undoHistory.addUndoCheckpoint();
            undoHistory.pushUndoOperation(() => this.changeTo(previousPlayer));
        }

        this.#game.currentPlayer = player;
    }
}
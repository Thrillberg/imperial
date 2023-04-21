export default class ChangeCurrentPlayer {
  #game;

  constructor(game) {
    this.#game = game;
  }

  changeTo(player, undoHistory) {
    // do not short-circuit even if player identical. Always add undo checkpoint
    if (undoHistory) {
      const previousPlayer = this.#game.currentPlayer;

      undoHistory.addUndoCheckpoint();
      undoHistory.pushUndoOperation(() => this.changeTo(previousPlayer));
    }

    this.#game.currentPlayer = player;
  }
}

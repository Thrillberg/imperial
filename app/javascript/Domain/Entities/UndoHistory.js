const InvalidUndoOperationError = class extends Error {
  constructor(operation) {
    super(`${operation} is an invalid undo operation`);

    this.name = 'InvalidUndoOperationError';
  }
};

export default class UndoHistory {
  static get InvalidUndoOperationError() {
    return InvalidUndoOperationError;
  }

  #undoStack;

  constructor() {
    this.#undoStack = [];
  }

  pushUndoOperation(operation) {
    if (operation instanceof Function) {
      if (this.#undoStack.length === 0) {
        this.addUndoCheckpoint();
      }

      this.#undoStack[this.#undoStack.length - 1].push(operation);
    } else {
      throw new InvalidUndoOperationError(operation);
    }
  }
  addUndoCheckpoint() {
    this.#undoStack.push([]);
  }
  undoToLastCheckpoint() {
    if (this.#undoStack.length === 0) {
      return;
    }

    const undoOperations = this.#undoStack.pop();
    while (undoOperations.length > 0) {
      const undoOperation = undoOperations.pop();
      try {
        undoOperation();
      } catch (error) {
        switch (error) {
          case TypeError:
            throw new InvalidUndoOperationError(undoOperation);

          default:
            throw error;
        }
      }
    }
  }
}

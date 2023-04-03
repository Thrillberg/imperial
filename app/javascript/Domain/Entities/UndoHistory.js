const InvalidUndoOperationError = class extends Error {
  constructor(operation) {
    super(`${operation} is an invalid undo operation`);

    this.name = 'InvalidUndoOperationError';
  }
};

const ModificationWhileUndoingError = class extends Error {
  constructor() {
    super('Attempting to modify the undo stack while an undo is in progress');

    this.name = 'ModificationWhileUndoingError';
  }
};

export default class UndoHistory {
  static get InvalidUndoOperationError() {
    return InvalidUndoOperationError;
  }
  static get ModificationWhileUndoingError() {
    return ModificationWhileUndoingError;
  }

  #undoStack;
  #isUndoing = false;

  constructor() {
    this.#undoStack = [];
  }

  pushUndoOperation(operation) {
    if (this.#isUndoing) {
      throw new ModificationWhileUndoingError();
    }

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
    if (this.#isUndoing) {
      throw new ModificationWhileUndoingError();
    }

    this.#undoStack.push([]);
  }
  undoToLastCheckpoint() {
    if (this.#undoStack.length === 0) {
      return;
    }

    this.#isUndoing = true;

    const undoOperations = this.#undoStack.pop();
    while (undoOperations.length > 0) {
      const undoOperation = undoOperations.pop();
      undoOperation();
    }

    this.#isUndoing = false;
  }
}

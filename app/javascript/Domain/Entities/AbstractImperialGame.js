import Entity from './Entity';

import Rondel from './Rondel';

const InvalidUndoOperationError = class extends Error {
  constructor(operation) {
    super(`${operation} is an invalid undo operation`);

    this.name = 'InvalidUndoOperationError';
  }
};

export default class AbstractImperialGame extends Entity {
  static get classId() {
    return 'AbstractImperialGame';
  }

  static get InvalidUndoOperationError() {
    return InvalidUndoOperationError;
  }

  #rondel;
  #availableFreeRondelSlotCount = 3;
  #availablePaidRondelSlotCount = 3;

  #nations;
  #nationOrder;

  #undoStack;

  constructor(id, nations, nationOrder) {
    super(id);

    this.#rondel = new Rondel();

    this.#nations = nations;
    this.#nationOrder = nationOrder;

    this.#undoStack = [];
  }

  get rondel() {
    return this.#rondel;
  }

  get availableFreeRondelSlotCount() {
    return this.#availableFreeRondelSlotCount;
  }
  get availablePaidRondelSlotCount() {
    return this.#availablePaidRondelSlotCount;
  }

  nationIdToEntity(nationId) {
    return this.#nations.get(nationId);
  }
  nationTurnAfter(nation) {
    let nationIndex = this.#nationOrder.indexOf(nation);

    nationIndex += 1;
    nationIndex %= this.#nationOrder.length;

    return this.#nationOrder[nationIndex];
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

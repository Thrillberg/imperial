import RondelSlot from './RondelSlot';

export default class FactorySlot extends RondelSlot {
  static get classId() {
    return 'factory';
  }

  constructor() {
    super(FactorySlot.classId);
  }
}

import Entity from '../Entity';

export default class Nation extends Entity {
  constructor(id) {
    super(id);

    this.governor = null;
    this.residingRondelSlot = null;
    this.powerPoints = 0;
  }
}

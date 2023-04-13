import AdjustTreasury from '../AdjustTreasury';

import AdjustCash from '../../Players/AdjustCash';
import AssignBond from './AssignBond';

import ElectGovernor from '../ElectGovernor';

const InvalidBondUpgradeError = class extends Error {
  constructor(fromBond, toBond) {
    super(`Invalid attempt to upgrade from ${fromBond} to ${toBond}`);

    this.name = 'InvalidBondUpgradeError';
  }
};

export default class PurchaseBond {
  static get InvalidBondUpgradeError() {
    return InvalidBondUpgradeError;
  }

  #electGovernor;

  constructor(game) {
    this.#electGovernor = new ElectGovernor(game);
  }

  purchase(investor, bond, undoHistory) {
    AdjustTreasury.changeBy(bond.nation, bond.cost, undoHistory);

    AdjustCash.changeBy(investor, -bond.cost, undoHistory);
    AssignBond.assign(bond, investor, undoHistory);

    this.#electGovernor.electMostInvestedBondBearer(bond.nation, undoHistory);
  }
  upgrade(investor, returnBond, purchaseBond, undoHistory) {
    if (returnBond.nation !== purchaseBond.nation || returnBond.cost >= purchaseBond.cost) {
      throw new InvalidBondUpgradeError(returnBond, purchaseBond);
    }

    const bondCostDifference = purchaseBond.cost - returnBond.cost;

    AdjustTreasury.changeBy(purchaseBond.nation, bondCostDifference, undoHistory);

    AdjustCash.changeBy(investor, -bondCostDifference, undoHistory);
    AssignBond.unassign(returnBond, undoHistory);
    AssignBond.assign(purchaseBond, investor, undoHistory);

    this.#electGovernor.electMostInvestedBondBearer(purchaseBond.nation, undoHistory);
  }
}

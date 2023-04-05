import AbstractImperialGame from './AbstractImperialGame';

import Nation from './Nations/Nation';
import { NationAsia as NationEnum } from '../constants';

export default class ImperialAsiaGame extends AbstractImperialGame {
  static get classId() {
    return 'imperialAsia';
  }

  static get ChinaId() {
    return NationEnum.CN;
  }
  static get JapanId() {
    return NationEnum.JP;
  }
  static get FranceId() {
    return NationEnum.FR;
  }
  static get GreatBritainId() {
    return NationEnum.GB;
  }
  static get TurkeyId() {
    return NationEnum.TR;
  }
  static get RussiaId() {
    return NationEnum.RU;
  }
  static get GermanyId() {
    return NationEnum.GE;
  }

  constructor(playerOrder) {
    const nationOrder = new Array(7);
    nationOrder[0] = new Nation(ImperialAsiaGame.ChinaId);
    nationOrder[1] = new Nation(ImperialAsiaGame.JapanId);
    nationOrder[2] = new Nation(ImperialAsiaGame.FranceId);
    nationOrder[3] = new Nation(ImperialAsiaGame.GreatBritainId);
    nationOrder[4] = new Nation(ImperialAsiaGame.TurkeyId);
    nationOrder[5] = new Nation(ImperialAsiaGame.RussiaId);
    nationOrder[6] = new Nation(ImperialAsiaGame.GermanyId);

    super(ImperialAsiaGame.classId, playerOrder, nationOrder);
  }

  get China() {
    return this.nationIdToEntity(ImperialAsiaGame.ChinaId);
  }
  get Japan() {
    return this.nationIdToEntity(ImperialAsiaGame.JapanId);
  }
  get France() {
    return this.nationIdToEntity(ImperialAsiaGame.FranceId);
  }
  get GreatBritain() {
    return this.nationIdToEntity(ImperialAsiaGame.GreatBritainId);
  }
  get Turkey() {
    return this.nationIdToEntity(ImperialAsiaGame.TurkeyId);
  }
  get Russia() {
    return this.nationIdToEntity(ImperialAsiaGame.RussiaId);
  }
  get Germany() {
    return this.nationIdToEntity(ImperialAsiaGame.GermanyId);
  }
}

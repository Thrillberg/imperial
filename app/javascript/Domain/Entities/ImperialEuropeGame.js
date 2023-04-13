import AbstractImperialGame from './AbstractImperialGame';

import Nation from './Nations/Nation';
import { Nation as NationEnum } from '../constants';

export default class ImperialEuropeGame extends AbstractImperialGame {
  static get classId() {
    return 'imperial';
  }

  static get AustriaHungaryId() {
    return NationEnum.AH;
  }
  static get ItalyId() {
    return NationEnum.IT;
  }
  static get FranceId() {
    return NationEnum.FR;
  }
  static get GreatBritainId() {
    return NationEnum.GB;
  }
  static get GermanyId() {
    return NationEnum.GE;
  }
  static get RussiaId() {
    return NationEnum.RU;
  }

  constructor(playerOrder) {
    const nationOrder = new Array(6);
    nationOrder[0] = new Nation(ImperialEuropeGame.AustriaHungaryId);
    nationOrder[1] = new Nation(ImperialEuropeGame.ItalyId);
    nationOrder[2] = new Nation(ImperialEuropeGame.FranceId);
    nationOrder[3] = new Nation(ImperialEuropeGame.GreatBritainId);
    nationOrder[4] = new Nation(ImperialEuropeGame.GermanyId);
    nationOrder[5] = new Nation(ImperialEuropeGame.RussiaId);

    super(ImperialEuropeGame.classId, playerOrder, nationOrder);
  }

  get AustriaHungary() {
    return this.nationIdToEntity(ImperialEuropeGame.AustriaHungaryId);
  }
  get Italy() {
    return this.nationIdToEntity(ImperialEuropeGame.ItalyId);
  }
  get France() {
    return this.nationIdToEntity(ImperialEuropeGame.FranceId);
  }
  get GreatBritain() {
    return this.nationIdToEntity(ImperialEuropeGame.GreatBritainId);
  }
  get Germany() {
    return this.nationIdToEntity(ImperialEuropeGame.GermanyId);
  }
  get Russia() {
    return this.nationIdToEntity(ImperialEuropeGame.RussiaId);
  }
}

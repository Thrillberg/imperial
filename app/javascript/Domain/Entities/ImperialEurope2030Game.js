import AbstractImperialGame from './AbstractImperialGame';

import Nation from './Nations/Nation';
import { Nation as NationEnum } from '../constants';

export default class ImperialEurope2030Game extends AbstractImperialGame {
  static get classId() {
    return 'imperialEurope2030';
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
    nationOrder[0] = new Nation(ImperialEurope2030Game.AustriaHungaryId);
    nationOrder[1] = new Nation(ImperialEurope2030Game.ItalyId);
    nationOrder[2] = new Nation(ImperialEurope2030Game.FranceId);
    nationOrder[3] = new Nation(ImperialEurope2030Game.GreatBritainId);
    nationOrder[4] = new Nation(ImperialEurope2030Game.GermanyId);
    nationOrder[5] = new Nation(ImperialEurope2030Game.RussiaId);

    super(ImperialEurope2030Game.classId, playerOrder, nationOrder);
  }

  get AustriaHungary() {
    return this.nationIdToEntity(ImperialEurope2030Game.AustriaHungaryId);
  }
  get Italy() {
    return this.nationIdToEntity(ImperialEurope2030Game.ItalyId);
  }
  get France() {
    return this.nationIdToEntity(ImperialEurope2030Game.FranceId);
  }
  get GreatBritain() {
    return this.nationIdToEntity(ImperialEurope2030Game.GreatBritainId);
  }
  get Germany() {
    return this.nationIdToEntity(ImperialEurope2030Game.GermanyId);
  }
  get Russia() {
    return this.nationIdToEntity(ImperialEurope2030Game.RussiaId);
  }
}

import AbstractImperialGame from './AbstractImperialGame';

import Nation from './Nations/Nation';

export default class ImperialAsiaGame extends AbstractImperialGame {
  static get classId() {
    return 'imperialAsia';
  }

  static get ChinaId() {
    return 'CN';
  }
  static get JapanId() {
    return 'JP';
  }
  static get FranceId() {
    return 'FR';
  }
  static get GreatBritainId() {
    return 'GB';
  }
  static get TurkeyId() {
    return 'TR';
  }
  static get RussiaId() {
    return 'RU';
  }
  static get GermanyId() {
    return 'GE';
  }

  constructor(id) {
    const nations = new Map();
    nations.set(ImperialAsiaGame.ChinaId, new Nation(ImperialAsiaGame.ChinaId));
    nations.set(ImperialAsiaGame.JapanId, new Nation(ImperialAsiaGame.JapanId));
    nations.set(ImperialAsiaGame.FranceId, new Nation(ImperialAsiaGame.FranceId));
    nations.set(ImperialAsiaGame.GreatBritainId, new Nation(ImperialAsiaGame.GreatBritainId));
    nations.set(ImperialAsiaGame.TurkeyId, new Nation(ImperialAsiaGame.TurkeyId));
    nations.set(ImperialAsiaGame.RussiaId, new Nation(ImperialAsiaGame.RussiaId));
    nations.set(ImperialAsiaGame.GermanyId, new Nation(ImperialAsiaGame.GermanyId));

    const nationOrder = new Array(7);
    nationOrder[0] = nations.get(ImperialAsiaGame.ChinaId);
    nationOrder[1] = nations.get(ImperialAsiaGame.JapanId);
    nationOrder[2] = nations.get(ImperialAsiaGame.FranceId);
    nationOrder[3] = nations.get(ImperialAsiaGame.GreatBritainId);
    nationOrder[4] = nations.get(ImperialAsiaGame.TurkeyId);
    nationOrder[5] = nations.get(ImperialAsiaGame.RussiaId);
    nationOrder[6] = nations.get(ImperialAsiaGame.GermanyId);

    super(id, nations, nationOrder);
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

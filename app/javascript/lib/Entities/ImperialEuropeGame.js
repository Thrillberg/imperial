import AbstractImperialGame from './AbstractImperialGame';

import Nation from './Nations/Nation';

export default class ImperialEuropeGame extends AbstractImperialGame {
  static get classId() {
    return 'imperial';
  }

  static get AustriaHungaryId() {
    return 'AH';
  }
  static get ItalyId() {
    return 'IT';
  }
  static get FranceId() {
    return 'FR';
  }
  static get GreatBritainId() {
    return 'GB';
  }
  static get GermanyId() {
    return 'GE';
  }
  static get RussiaId() {
    return 'RU';
  }

  constructor(id) {
    const nations = new Map();
    nations.set(ImperialEuropeGame.AustriaHungaryId, new Nation(ImperialEuropeGame.AustriaHungaryId));
    nations.set(ImperialEuropeGame.ItalyId, new Nation(ImperialEuropeGame.ItalyId));
    nations.set(ImperialEuropeGame.FranceId, new Nation(ImperialEuropeGame.FranceId));
    nations.set(ImperialEuropeGame.GreatBritainId, new Nation(ImperialEuropeGame.GreatBritainId));
    nations.set(ImperialEuropeGame.GermanyId, new Nation(ImperialEuropeGame.GermanyId));
    nations.set(ImperialEuropeGame.RussiaId, new Nation(ImperialEuropeGame.RussiaId));

    const nationOrder = new Array(6);
    nationOrder[0] = nations.get(ImperialEuropeGame.AustriaHungaryId);
    nationOrder[1] = nations.get(ImperialEuropeGame.ItalyId);
    nationOrder[2] = nations.get(ImperialEuropeGame.FranceId);
    nationOrder[3] = nations.get(ImperialEuropeGame.GreatBritainId);
    nationOrder[4] = nations.get(ImperialEuropeGame.GermanyId);
    nationOrder[5] = nations.get(ImperialEuropeGame.RussiaId);

    super(id, nations, nationOrder);
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

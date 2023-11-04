import { Nation, Nation2030, NationAsia } from './constants';

export default (game) => {
  const units = new Map();
  for (const [key, value] of game.units) {
    const newValue = new Map();
    for (const [key2, value2] of value) {
      newValue.set(key2, { ...value2 });
    }
    if (game.baseGame === 'imperial' || game.baseGame === 'imperialEurope2030') {
      units.set(Nation[key.value], newValue);
    } else if (game.baseGame === 'imperial2030') {
      units.set(Nation2030[key.value], newValue);
    } else if (game.baseGame === 'imperialAsia') {
      units.set(NationAsia[key.value], newValue);
    }
  }
  const nations = new Map();
  for (const [key, value] of game.nations) {
    if (game.baseGame === 'imperial' || game.baseGame === 'imperialEurope2030') {
      nations.set(Nation[key.value], { ...value });
    } else if (game.baseGame === 'imperial2030') {
      nations.set(Nation2030[key.value], { ...value });
    } else if (game.baseGame === 'imperialAsia') {
      nations.set(NationAsia[key.value], { ...value });
    }
  }
  const provinces = new Map();
  for (const [key, value] of game.provinces) {
    provinces.set(key, { ...value });
  }
  const availableBonds = new Set();
  for (const bond of game.availableBonds) {
    availableBonds.add(bond);
  }
  const availableActions = new Set();
  for (const action of game.availableActions) {
    availableActions.add(action);
  }
  const players = {};
  for (const player of Object.keys(game.players)) {
    players[player] = {};
    players[player].cash = game.players[player].cash;
    players[player].name = game.players[player].name;
    players[player].rawScore = game.players[player].rawScore;

    const bonds = new Set();
    for (const bond of game.players[player].bonds) {
      bonds.add(bond);
    }
    players[player].bonds = bonds;
  }
  const fleetConvoyCount = {};
  for (const province of Object.keys(game.fleetConvoyCount)) {
    fleetConvoyCount[province] = game.fleetConvoyCount[province];
  }
  const coexistingNations = [];
  for (const nation of game.coexistingNations) {
    coexistingNations.push(nation);
  }
  const swissBanksWhoDoNotInterrupt = [];
  for (const bank of game.swissBanksWhoDoNotInterrupt) {
    swissBanksWhoDoNotInterrupt.push(bank);
  }

  return {
    units,
    nations,
    provinces,
    availableBonds,
    availableActions,
    players,
    fleetConvoyCount,
    coexistingNations,
    currentNationInConflict: game.currentNationInConflict,
    swissBanksWhoDoNotInterrupt,
    importing: false,
    buildingFactory: game.buildingFactory,
  };
};

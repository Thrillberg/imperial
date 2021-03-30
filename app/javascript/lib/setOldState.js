import { Nation } from "./constants.js";

export default (game) => {
  let units = new Map;
  for (const [key, value] of game.units) {
    const newValue = new Map;
    for (const [key2, value2] of value) {
      newValue.set(key2, Object.assign({}, value2));
    }
    units.set(Nation[key.value], newValue);
  }
  let nations = new Map();
  for (const [key, value] of game.nations) {
    nations.set(Nation[key.value], Object.assign({}, value));
  }
  let provinces = new Map();
  for (const [key, value] of game.provinces) {
    provinces.set(key, Object.assign({}, value));
  }
  let availableBonds = new Set();
  for (const bond of game.availableBonds) {
    availableBonds.add(bond);
  }
  let availableActions = new Set();
  for (const action of game.availableActions) {
    availableActions.add(action);
  }
  let players = {};
  for (const player of Object.keys(game.players)) {
    players[player] = {};
    players[player].cash = game.players[player].cash;
    players[player].name = game.players[player].name;
    players[player].rawScore = game.players[player].rawScore;
    let bonds = new Set();
    for (const bond of game.players[player].bonds) {
      bonds.add(bond)
    }
    players[player].bonds = bonds;
  }
  let fleetConvoyCount = {};
  for (const province of Object.keys(game.fleetConvoyCount)) {
    fleetConvoyCount[province] = game.fleetConvoyCount[province]
  }
  let coexistingNations = [];
  for (const nation of game.coexistingNations) {
    coexistingNations.push(nation);
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
    currentNationInConflict: game.currentNationInConflict
  }
}

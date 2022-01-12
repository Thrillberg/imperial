export default (serializableGame) => {
  let game = Object.assign({}, serializableGame);
  const availableActions = [...game.availableActions]
  game.availableActions = availableActions
  const units = [...game.units.entries()]
  game.units = units
  const unitLimits = [...game.unitLimits.entries()]
  game.unitLimits = unitLimits
  const nations = [...game.nations.entries()]
  game.nations = nations
  const provinces = [...game.provinces.entries()]
  game.provinces = provinces
  const availableBonds = [...game.availableBonds]
  game.availableBonds = availableBonds
  let players = {};
  Object.keys(game.players).forEach(playerName => {
    players[playerName] = game.players[playerName];
    players[playerName].bonds = [...game.players[playerName].bonds];
  });
  game.players = players;
  game.oldState = {};

  return JSON.stringify(game)
}

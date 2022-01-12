// import serializeJavascript from 'serialize-javascript';

export default (serializableGame) => {
  // return serializeJavascript(game)
  let game = Object.assign({}, serializableGame);
  const availableActions = [...game.availableActions.entries()]
  game.availableActions = availableActions
  const units = [...game.units.entries()]
  // const units = Object.fromEntries(game.units.entries());
  game.units = units
  const unitLimits = [...game.unitLimits.entries()]
  game.unitLimits = unitLimits
  const nations = [...game.nations.entries()]
  game.nations = nations
  const provinces = [...game.provinces.entries()]
  game.provinces = provinces
  const availableBonds = [...game.availableBonds.entries()]
  game.availableBonds = availableBonds
  return JSON.stringify(game)
}

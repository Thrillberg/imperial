import { Nation, Nation2030 } from "./constants.js";

export default (serializedGame) => {
  const parsedGame = eval('(' + serializedGame + ')');
  if (parsedGame) {
    let game = Object.assign({}, parsedGame);
    game.availableActions = new Set(parsedGame.availableActions);
    game.units = new Map(parsedGame.units);
    // TODO: We need to deserialize the other 5 keys (unitLimits, nations, provinces, availableBonds, players' bonds) AND be sure to use the correct Nation type wherever necessary.
    console.log(game)
    return game
  }
  return serializedGame;
}

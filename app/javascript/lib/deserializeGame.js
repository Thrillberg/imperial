import { Nation, Nation2030 } from "./constants.js";

export default (serializedGame) => {
  let deserializedGame = eval('(' + serializedGame + ')');
  if (deserializedGame) {
    const availableActions = new Map();
    for (const action of deserializedGame.availableActions) {
      const baseGame = deserializedGame.baseGame;
      if (
        (
          action.type === "rondel" ||
          action.type === "bondPurchase" ||
          action.type === "skipBondPurchase" ||
          action.type === "skipBuildFactory"
        ) && action.payload.nation
      ) {
        if (baseGame === "imperial") {
          action.payload.nation = Nation[action.payload.nation.value];
        } else if (baseGame === "imperial2030") {
          action.payload.nation = Nation2030[action.payload.nation.value];
        }
      } else if (
        action.type === "fight" ||
        action.type === "coexist" ||
        action.type === "unfriendlyEntrance" ||
        action.type === "friendlyEntrance"
      ) {
        if (baseGame === "imperial") {
          action.payload.incumbent = Nation[action.payload.incumbent.value];
          action.payload.challenger = Nation[action.payload.challenger.value];
        } else if (baseGame === "imperial2030") {
          action.payload.incumbent = Nation2030[action.payload.incumbent.value];
          action.payload.challenger = Nation2030[action.payload.challenger.value];
        }
      }
      return action;
    }
    deserializedGame.availableActions = availableActions;
  }
  return deserializedGame;
}

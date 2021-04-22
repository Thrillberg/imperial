import { Nation, Nation2030 } from "../lib/constants.js";

export default function(rawLog, baseGame) {
  // The following map only exists because of our custom Nation type, which
  // has weirdness when we attempt nation.when() in the setup file.
  return rawLog.map(rawAction => {
    const action = JSON.parse(rawAction);
    if (
      action.type === "initialize" &&
      (!action.payload.variant || action.payload.variant === "standard")
    ) {
      if (baseGame === "imperial") {
        action.payload.players = action.payload.players.map(player => {
          return {
            id: player.id,
            nation: Nation[player.nation.value]
          };
        });
      } else if (baseGame === "imperial2030") {
        action.payload.players = action.payload.players.map(player => {
          return {
            id: player.id,
            nation: Nation2030[player.nation.value]
          };
        });
      }
    } else if (
      (
        action.type === "rondel" ||
        action.type === "bondPurchase" ||
        action.type === "skipBondPurchase"
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
  });
}

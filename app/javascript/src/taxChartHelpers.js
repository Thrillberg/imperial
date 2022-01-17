import Imperial from "../lib/imperial.js";
import Action from "../lib/action.js";

const postTaxationGameState = (game, nation) => {
  const hypotheticalGame = Imperial.fromLog(game.log, game.board);
  if (nation) {
    const action = Action.rondel({ nation, cost: 0, slot: "taxation" });
    hypotheticalGame.availableActions.add(action);
    hypotheticalGame.tick(action);
  } else {
    let taxationAction = {};
    for (const action of hypotheticalGame.availableActions) {
      if (action.type === "rondel" && action.payload.slot === "taxation") {
        taxationAction = action;
      }
    }
    hypotheticalGame.tick(taxationAction);
  }
  return hypotheticalGame;
}

export const nextTaxChartPosition = (game, nation) => {
  if (nation) {
    return postTaxationGameState(game, nation).nations.get(nation).taxChartPosition;
  } else {
    return postTaxationGameState(game).nations.get(game.currentNation).taxChartPosition;
  }
};

export const nextTaxationPowerPoints = (game, nation) => {
  if (nation) {
    return postTaxationGameState(game, nation).nations.get(nation).powerPoints;
  } else {
    return postTaxationGameState(game).nations.get(game.currentNation).powerPoints;
  }
};

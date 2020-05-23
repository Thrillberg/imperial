const imperial = {
  getAvailableActions(log) {
    const lastMove = log[log.length - 1];
    if (this.shouldReturnRondelActions(lastMove)) {
      return this.rondelActions(this.getNation(log));
    } else {
      return new Set(
        ["trieste", "prague", "lemburg"].map((province) => ({
          type: "buildFactory",
          payload: { province },
        }))
      );
    }
  },

  shouldReturnRondelActions(lastMove) {
    return (
      this.logIsEmpty(lastMove) ||
      this.lastMoveWasBuildFactory(lastMove) ||
      this.lastMoveWasProduction(lastMove)
    );
  },

  getNation(log) {
    const nations = ["AH", "IT", "FR", "GB", "GE", "RU"];
    const rondelActions = log.filter((action) => action.type === "rondel");
    if (rondelActions.length > 0) {
      const lastTurnNation =
        rondelActions[rondelActions.length - 1].payload.nation;
      return nations[nations.indexOf(lastTurnNation) + 1];
    } else {
      return "AH";
    }
  },

  rondelActions(nation) {
    return new Set(
      [
        "factory",
        "production1",
        "maneuver1",
        "investor",
        "import",
        "production2",
        "maneuver2",
        "taxation",
      ].map((slot) => ({
        type: "rondel",
        payload: { nation, cost: 0, slot },
      }))
    );
  },

  logIsEmpty(lastMove) {
    return !lastMove;
  },

  lastMoveWasBuildFactory(lastMove) {
    return lastMove.type === "buildFactory";
  },

  lastMoveWasProduction(lastMove) {
    return (
      lastMove.type === "rondel" && lastMove.payload.slot === "production1"
    );
  },
};

module.exports = imperial;

/*
events = []
initial = {}

at setup:
score == 0
2-5 in the tax chart
predetermined territories
  (2 factories each, in the square cities)

assume 6 players for now
13mm per player
pay 9mm -> their "own" nation
pay 2mm -> their "sister" nation

rondel is empty
*/

/*
<- events is empty
-> it's austria-hungary's controller's turn
-> validRondelPositions(Country) -> [RondelSlot]
*/

/*
<- events has {AH placed token in rondel @ ??}
*/

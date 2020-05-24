const imperial = {
  getAvailableActions(log) {
    const lastMove = log[log.length - 1];
    if (this.shouldReturnRondelActions(lastMove)) {
      return this.rondelActions(this.getNation(log));
    } else if (
      lastMove.type === "rondel" &&
      lastMove.payload.slot === "factory"
    ) {
      return this.buildFactoryAction(lastMove.payload.nation);
    } else if (
      lastMove.type === "rondel" &&
      lastMove.payload.slot === "import"
    ) {
      return this.importAction(lastMove.payload.nation);
    }
  },

  shouldReturnRondelActions(lastMove) {
    return (
      this.logIsEmpty(lastMove) ||
      this.lastMoveWasBuildFactory(lastMove) ||
      this.lastMoveWasProduction(lastMove) ||
      this.lastMoveWasManeuver(lastMove) ||
      this.lastMoveWasInvestor(lastMove) ||
      this.lastMoveWasImport(lastMove) ||
      this.lastMoveWasTaxation(lastMove)
    );
  },

  getNation(log) {
    const rondelActions = log.filter((action) => action.type === "rondel");
    if (rondelActions.length > 0) {
      const lastTurnNation =
        rondelActions[rondelActions.length - 1].payload.nation;
      return this.nextNation(lastTurnNation);
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
      lastMove.type === "rondel" &&
      (lastMove.payload.slot === "production1" ||
        lastMove.payload.slot === "production2")
    );
  },

  lastMoveWasManeuver(lastMove) {
    return (
      lastMove.type === "rondel" &&
      (lastMove.payload.slot === "maneuver1" ||
        lastMove.payload.slot === "maneuver2")
    );
  },

  lastMoveWasInvestor(lastMove) {
    return lastMove.type === "rondel" && lastMove.payload.slot === "investor";
  },

  lastMoveWasImport(lastMove) {
    return lastMove.type === "import";
  },

  lastMoveWasTaxation(lastMove) {
    return lastMove.type === "rondel" && lastMove.payload.slot === "taxation";
  },

  nextNation(lastTurnNation) {
    const nations = ["AH", "IT", "FR", "GB", "GE", "RU"];
    if (lastTurnNation === "RU") {
      return "AH";
    } else {
      return nations[nations.indexOf(lastTurnNation) + 1];
    }
  },

  buildFactoryAction(nation) {
    const factoryLocations = {
      AH: ["trieste", "prague", "lemburg"],
      IT: ["genoa", "venice", "florence"],
      FR: ["brest", "dijon", "marseille"],
      GB: ["dublin", "sheffield", "edinburgh"],
      GE: ["danzig", "munich", "cologne"],
      RU: ["kiev", "st. petersburg", "warsaw"],
    };
    return new Set(
      factoryLocations[nation].map((province) => ({
        type: "buildFactory",
        payload: { province },
      }))
    );
  },

  importAction(nation) {
    const importLocations = {
      AH: ["vienna", "budapest"],
      IT: ["rome", "naples"],
      FR: ["paris", "bordeaux"],
      GB: ["london", "liverpool"],
      GE: ["berlin", "hamburg"],
      RU: ["moscow", "odessa"],
    };
    return new Set(
      importLocations[nation].map((province) => ({
        type: "import",
        payload: { province },
      }))
    );
  },
};

module.exports = imperial;

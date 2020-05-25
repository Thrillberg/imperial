const imperial = {
  getCash(player, log) {
    let cash = 11;
    log
      .filter((action) => {
        return (
          action.type === "bondPurchase" && action.payload.player === player
        );
      })
      .map((bondPurchase) => {
        cash -= bondPurchase.payload.cost;
      });

    const investorActions = log.filter((action) => {
      return (
        action.type === "rondel" &&
        action.payload.slot === "investor" &&
        this.getController(action.payload.nation, log) === player
      );
    });
    cash += 4 * investorActions.length;

    const investorActionsAsInvestorCardHolder = log.filter((action) => {
      return (
        action.type === "rondel" &&
        action.payload.slot === "investor" &&
        this.getInvestorCardHolder(log) === player
      );
    });
    cash += 4 * investorActionsAsInvestorCardHolder.length;

    return cash;
  },

  getAvailableActions(log) {
    const lastMove = log[log.length - 1];
    if (this.shouldReturnRondelActions(lastMove)) {
      return this.rondelActions(this.getNation(log));
    } else if (lastMove.type === "rondel") {
      if (lastMove.payload.slot === "factory") {
        return this.buildFactoryAction(lastMove.payload.nation);
      } else if (lastMove.payload.slot === "import") {
        return this.importAction(lastMove.payload.nation);
      }
    }
  },

  getTreasury(nation, log) {
    let treasuryAmount = 0;
    if (nation === "AH") {
      treasuryAmount = 2;
    } else if (nation === "IT") {
      treasuryAmount = 9;
    } else if (nation != "GE") {
      log
        .filter((action) => {
          return (
            action.type === "bondPurchase" && action.payload.nation === nation
          );
        })
        .map((bondPurchase) => {
          treasuryAmount += bondPurchase.payload.cost;
        });
    }

    const importActions = log.filter(
      (action) =>
        action.type === "import" &&
        this.importLocations(nation).includes(action.payload.province)
    );
    treasuryAmount -= importActions.length;

    const investorRondelActions = log.filter(
      (action) =>
        action.type === "rondel" &&
        action.payload.slot === "investor" &&
        action.payload.nation === nation
    );
    treasuryAmount -= 4 * investorRondelActions.length;

    return treasuryAmount;
  },

  getController(nation, log) {
    return log
      .filter(
        (action) =>
          action.type === "bondPurchase" && action.payload.nation === nation
      )
      .reduce((highestBondPurchase, bondPurchase, index, bondPurchases) => {
        if (bondPurchase.cost > bondPurchases[index - 1]) {
          highestBondPurchase = bondPurchase;
        }

        return highestBondPurchase;
      }).payload.player;
  },

  getInvestorCardHolder(log) {
    const AHController = this.getController("AH", log);
    const order = log
      .filter((action) => {
        return action.type === "playerSeating";
      })
      .map((playerSeatingAction) => {
        return playerSeatingAction.payload.order;
      })[0];
    const indexOfInvestorCardHolder = order.indexOf(AHController) - 1;
    return order[indexOfInvestorCardHolder];
  },

  unitCount(province) {
    return 1;
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

  importLocations(nation) {
    if (nation === "AH") {
      return ["vienna", "budapest", "prague", "lemberg", "trieste"];
    } else if (nation === "IT") {
      return ["rome", "naples"];
    } else if (nation === "FR") {
      return ["paris", "bordeaux"];
    } else if (nation === "GB") {
      return ["london", "liverpool"];
    } else if (nation === "GE") {
      return ["berlin", "hamburg"];
    } else if (nation === "RU") {
      return ["moscow", "odessa"];
    }
  },

  importAction(nation) {
    return new Set(
      this.importLocations(nation).map((province) => ({
        type: "import",
        payload: { province },
      }))
    );
  },
};

module.exports = imperial;

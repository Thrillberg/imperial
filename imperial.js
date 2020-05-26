class Imperial {
  static fromLog(log) {
    return new Imperial(log);
  }

  constructor(log) {
    this.log = log;
  }

  get state() {
    return {
      availableActions: this.availableActions(),
      investorCardHolder: this.investorCardHolder(),
      nations: this.nations(),
      players: this.players(),
      provinces: this.provinces(),
    };
  }

  availableActions() {
    const lastMove = this.log[this.log.length - 1];
    if (this.shouldReturnRondelActions(lastMove)) {
      return this.rondelActions(this.getNation(this.log));
    } else if (lastMove.type === "rondel") {
      if (lastMove.payload.slot === "factory") {
        return this.buildFactoryAction(lastMove.payload.nation);
      } else if (lastMove.payload.slot === "import") {
        return this.importAction(lastMove.payload.nation);
      }
    }
  }

  investorCardHolder() {
    const AHController = this.getController("AH", this.log);
    const order = this.log
      .filter((action) => {
        return action.type === "playerSeating";
      })
      .map((playerSeatingAction) => {
        return playerSeatingAction.payload.order;
      })[0];
    const indexOfInvestorCardHolder = order.indexOf(AHController) - 1;

    const investorRondelActions = this.log.filter(
      (action) => action.type === "rondel" && action.payload.slot === "investor"
    );
    if (indexOfInvestorCardHolder - investorRondelActions.length === -1) {
      return order[order.length - 1];
    }

    return order[indexOfInvestorCardHolder - investorRondelActions.length];
  }

  nations() {
    let nations = {};
    ["AH", "IT", "FR", "GB", "GE", "RU"].map((nation) => {
      nations[nation] = {
        controller: this.getController(nation, this.log),
        treasury: this.getTreasury(nation, this.log),
      };
    });
    return nations;
  }

  players() {
    let players = {};
    const seatingAction = this.log.find((action) => {
      return action.type === "playerSeating";
    });
    seatingAction.payload.order.map((player) => {
      players[player] = {
        cash: this.getCash(player, this.log),
      };
    });
    return players;
  }

  provinces() {
    let provinces = {};
    [
      "berlin",
      "bordeaux",
      "hamburg",
      "lemberg",
      "liverpool",
      "london",
      "marseille",
      "paris",
      "trieste",
    ].forEach((province) => {
      provinces[province] = { hasFactory: true, unitCount: 1 };
    });
    return provinces;
  }

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
  }

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
  }

  getNation(log) {
    const rondelActions = log.filter((action) => action.type === "rondel");
    if (rondelActions.length > 0) {
      const lastTurnNation =
        rondelActions[rondelActions.length - 1].payload.nation;
      return this.nextNation(lastTurnNation);
    } else {
      return "AH";
    }
  }

  logIsEmpty(lastMove) {
    return lastMove.type === "playerSeating";
  }

  lastMoveWasBuildFactory(lastMove) {
    return lastMove.type === "buildFactory";
  }

  lastMoveWasProduction(lastMove) {
    return (
      lastMove.type === "rondel" &&
      (lastMove.payload.slot === "production1" ||
        lastMove.payload.slot === "production2")
    );
  }

  lastMoveWasManeuver(lastMove) {
    return (
      lastMove.type === "rondel" &&
      (lastMove.payload.slot === "maneuver1" ||
        lastMove.payload.slot === "maneuver2")
    );
  }

  lastMoveWasInvestor(lastMove) {
    return lastMove.type === "rondel" && lastMove.payload.slot === "investor";
  }

  lastMoveWasImport(lastMove) {
    return lastMove.type === "import";
  }

  lastMoveWasTaxation(lastMove) {
    return lastMove.type === "rondel" && lastMove.payload.slot === "taxation";
  }

  nextNation(lastTurnNation) {
    const nations = ["AH", "IT", "FR", "GB", "GE", "RU"];
    if (lastTurnNation === "RU") {
      return "AH";
    } else {
      return nations[nations.indexOf(lastTurnNation) + 1];
    }
  }

  importAction(nation) {
    return new Set(
      this.importLocations(nation).map((province) => ({
        type: "import",
        payload: { province },
      }))
    );
  }

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
  }

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
  }

  getTreasury(nation, log) {
    let treasuryAmount = 0;
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

    if (this.investmentHasBeenSold(nation, 4, log)) {
      treasuryAmount += 9;
      treasuryAmount -= 4 * investorRondelActions.length;
    }
    if (this.investmentHasBeenSold(nation, 2, log)) {
      treasuryAmount += 4;
      treasuryAmount -= 2 * investorRondelActions.length;
    }
    if (this.investmentHasBeenSold(nation, 1, log)) {
      treasuryAmount += 2;
      treasuryAmount -= 1 * investorRondelActions.length;
    }

    const factoryLocations = {
      AH: ["trieste", "prague", "lemburg"],
      IT: ["genoa", "venice", "florence"],
      FR: ["brest", "dijon", "marseille"],
      GB: ["dublin", "sheffield", "edinburgh"],
      GE: ["danzig", "munich", "cologne"],
      RU: ["kiev", "st. petersburg", "warsaw"],
    };

    const buildFactoryActions = log.filter((action) => {
      return (
        action.type === "buildFactory" &&
        factoryLocations[nation].includes(action.payload.province)
      );
    });
    treasuryAmount -= 5 * buildFactoryActions.length;

    return treasuryAmount;
  }

  investmentHasBeenSold(nation, value, log) {
    const bondValues = {
      1: 2,
      2: 4,
      4: 9,
    };
    if (
      log.filter((action) => {
        return (
          action.type === "bondPurchase" &&
          action.payload.nation === nation &&
          bondValues[value] === action.payload.cost
        );
      }).length > 0
    ) {
      return true;
    }
    return false;
  }

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
        this.getPreviousInvestorCardHolder(log) === player
      );
    });
    cash += 4 * investorActionsAsInvestorCardHolder.length;

    return cash;
  }

  getController(nation, log) {
    const out = log
      .filter(
        (action) =>
          action.type === "bondPurchase" && action.payload.nation === nation
      )
      .sort((a, b) => {
        const costA = a.payload.cost;
        const costB = b.payload.cost;
        if (costA < costB) {
          return 1;
        } else if (costA == costB) {
          return 0;
        } else {
          return -1;
        }
      });
    if (out.length > 0) {
      return out[0].payload.player;
    } else {
      return null;
    }
  }

  getPreviousInvestorCardHolder(log) {
    const AHController = this.getController("AH", log);
    const order = log
      .filter((action) => {
        return action.type === "playerSeating";
      })
      .map((playerSeatingAction) => {
        return playerSeatingAction.payload.order;
      })[0];
    const indexOfInvestorCardHolder = order.indexOf(AHController) - 1;

    const investorRondelActions = log.filter(
      (action) => action.type === "rondel" && action.payload.slot === "investor"
    );
    if (indexOfInvestorCardHolder - investorRondelActions.length === -1) {
      return order[0];
    }

    return order[indexOfInvestorCardHolder - investorRondelActions.length + 1];
  }
}

module.exports = Imperial;

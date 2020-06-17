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
    } else if (this.lastMoveWasRondelManeuver(lastMove)) {
      switch (lastMove.payload.nation) {
        case "FR":
          const FRLandDestinations = [
            "brest",
            "dijon",
            "bordeaux",
            "marseille",
            "belgium",
            "genoa",
            "munich",
            "spain",
          ];
          let parisActions = [];
          FRLandDestinations.map((province) => {
            parisActions.push({
              type: "maneuver",
              payload: { origin: "paris", destination: province },
            });
          });
          return [
            {
              type: "maneuver",
              payload: {
                origin: "bordeaux",
                destination: "bay of biscay",
              },
            },
            {
              type: "maneuver",
              payload: {
                origin: "marseille",
                destination: "western mediterranean sea",
              },
            },
            ...parisActions,
          ];
        case "GB":
          return [
            {
              type: "maneuver",
              payload: { origin: "liverpool", destination: "north atlantic" },
            },
            {
              type: "maneuver",
              payload: { origin: "london", destination: "english channel" },
            },
          ];
        case "GE":
          return [
            {
              type: "maneuver",
              payload: { origin: "hamburg", destination: "north sea" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "danzig" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "prague" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "munich" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "cologne" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "hamburg" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "dijon" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "belgium" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "holland" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "denmark" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "london" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "sheffield" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "edinburgh" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "norway" },
            },
          ];
        case "AH":
          const AHLandDestinations = [
            "warsaw",
            "kiev",
            "budapest",
            "prague",
            "romania",
            "danzig",
            "munich",
            "genoa",
            "venice",
            "berlin",
            "vienna",
            "trieste",
            "west balkan",
            "rome",
            "naples",
            "greece",
            "tunis",
          ];
          let lembergActions = [];
          let budapestActions = [];
          let viennaActions = [];
          AHLandDestinations.map((province) => {
            lembergActions.push({
              type: "maneuver",
              payload: { origin: "trieste", destination: province },
            });
            budapestActions.push({
              type: "maneuver",
              payload: { origin: "budapest", destination: province },
            });
            viennaActions.push({
              type: "maneuver",
              payload: { origin: "vienna", destination: province },
            });
          });
          return [
            {
              type: "maneuver",
              payload: { origin: "trieste", destination: "ionian sea" },
            },
            ...lembergActions,
            ...budapestActions,
            ...viennaActions,
          ];
        case "IT":
          const ITLandDestinations = [
            "naples",
            "tunis",
            "algeria",
            "spain",
            "marseille",
            "genoa",
            "florence",
            "venice",
            "vienna",
            "trieste",
          ];
          let romeActions = [];
          ITLandDestinations.map((province) => {
            romeActions.push({
              type: "maneuver",
              payload: { origin: "rome", destination: province },
            });
          });
          return [
            {
              type: "maneuver",
              payload: {
                origin: "naples",
                destination: "western mediterranean sea",
              },
            },
            ...romeActions,
          ];
      }
    } else if (lastMove.type === "rondel") {
      if (lastMove.payload.slot === "factory") {
        return this.buildFactoryAction(lastMove.payload.nation);
      } else if (lastMove.payload.slot === "import") {
        return this.importAction(lastMove.payload.nation);
      }
    } else if (lastMove.type === "maneuver") {
      if (this.startedConflict(lastMove)) {
        return [
          {
            type: "coexist",
            payload: {
              province: "western mediterranean sea",
              incumbent: "IT",
              challenger: "FR",
            },
          },
          {
            type: "fight",
            payload: {
              province: "western mediterranean sea",
              incumbent: "IT",
              challenger: "FR",
            },
          },
          ,
        ];
      } else {
        return this.rondelActions(this.getNation(this.log));
      }
    }
  }

  investorCardHolder() {
    return this.getInvestorCardHolder(this.log, this.log);
  }

  nations() {
    let nations = {};
    ["AH", "IT", "FR", "GB", "GE", "RU"].map((nation) => {
      nations[nation] = {
        controller: this.getController(nation, this.log),
        treasury: this.getTreasury(nation, this.log),
        taxChartPosition: this.getTaxChartPosition(nation),
        powerPoints: this.getPowerPoints(nation),
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
      "bay of biscay",
      "berlin",
      "bordeaux",
      "budapest",
      "english channel",
      "hamburg",
      "ionian sea",
      "lemberg",
      "liverpool",
      "london",
      "marseille",
      "morocco",
      "moscow",
      "naples",
      "north atlantic",
      "north sea",
      "norway",
      "odessa",
      "paris",
      "romania",
      "rome",
      "spain",
      "st. petersburg",
      "trieste",
      "tunis",
      "vienna",
      "west balkan",
      "western mediterranean sea",
    ].forEach((province) => {
      const flag = this.getFlag(province);
      const unitCount = this.getUnitCount(province);
      provinces[province] = { hasFactory: true, unitCount, flag };
    });
    return provinces;
  }

  getFlag(province) {
    const actionsWithIndex = this.log.map((action, index) => ({
      ...action,
      index,
    }));
    const maneuverActions = actionsWithIndex.filter(
      (action, index) =>
        action.type === "maneuver" && action.payload.destination === province
    );
    if (maneuverActions.length > 0) {
      return this.log
        .slice(0, maneuverActions[0].index)
        .reverse()
        .find(
          (action) =>
            action.type === "rondel" &&
            (action.payload.slot === "maneuver1" ||
              action.payload.slot === "maneuver2")
        ).payload.nation;
    }
  }

  getUnitCount(province) {
    let unitCount = 0;

    const importsCount = this.log.filter((action) => {
      return action.type === "import" && action.payload.province === province;
    }).length;
    unitCount += importsCount;

    const maneuverCount = this.log.filter(
      (action) =>
        action.type === "maneuver" && action.payload.destination === province
    ).length;
    unitCount += maneuverCount;

    const fightCount = this.log.filter(
      (action) =>
        action.type === "fight" && action.payload.province === province
    ).length;
    unitCount -= fightCount * 2;

    const productionCount = this.log.filter((action) => {
      return (
        action.type === "rondel" &&
        (action.payload.slot === "production1" ||
          action.payload.slot === "production2") &&
        this.homeProvinces(action.payload.nation).includes(province)
      );
    }).length;
    unitCount += productionCount;

    return unitCount;
  }

  getTaxChartPosition(nation) {
    const factoryCount =
      this.log.filter(
        (action) =>
          action.type === "buildFactory" &&
          this.homeProvinces(nation).includes(action.payload.province)
      ).length + 2;
    const flagCount = [
      "romania",
      "west balkan",
      "ionian sea",
      "tunis",
      "norway",
      "north sea",
    ].filter((province) => this.getFlag(province) === nation).length;
    return (factoryCount * 2 + flagCount).toString();
  }

  getPowerPoints(nation) {
    return parseInt(this.getTaxChartPosition(nation)) - 5;
  }

  shouldReturnRondelActions(lastMove) {
    return (
      this.logIsEmpty(lastMove) ||
      this.lastMoveWasBuildFactory(lastMove) ||
      this.lastMoveWasProduction(lastMove) ||
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

  lastMoveWasRondelManeuver(lastMove) {
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
      return ["moscow", "st. petersburg", "odessa", "kiev", "warsaw"];
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
    if (this.investmentHasBeenSold(nation, 3, log)) {
      treasuryAmount += 6;
      treasuryAmount -= 3 * investorRondelActions.length;
    }
    if (this.investmentHasBeenSold(nation, 2, log)) {
      treasuryAmount += 4;
      treasuryAmount -= 2 * investorRondelActions.length;
    }
    if (this.investmentHasBeenSold(nation, 1, log)) {
      treasuryAmount += 2;
      treasuryAmount -= 1 * investorRondelActions.length;
    }

    const taxationRondelActionsCount = this.log.filter(
      (action) =>
        action.type === "rondel" &&
        action.payload.slot === "taxation" &&
        action.payload.nation === nation
    ).length;
    treasuryAmount +=
      this.factoryCount(nation) * 2 * taxationRondelActionsCount;
    treasuryAmount += this.flagCount(nation) * taxationRondelActionsCount;
    treasuryAmount -= this.unitCount(nation) * taxationRondelActionsCount;

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
      3: 6,
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
    let cash = 13;
    log
      .filter((action) => {
        return (
          action.type === "bondPurchase" && action.payload.player === player
        );
      })
      .map((bondPurchase) => {
        cash -= bondPurchase.payload.cost;
      });

    const allInvestorActions = log
      .map((action, index) => {
        if (action.type === "rondel" && action.payload.slot === "investor") {
          return { logIndex: index, action };
        }
      })
      .filter(Boolean);

    allInvestorActions.map((investorAction) => {
      if (!!investorAction) {
        if (
          this.getInvestorCardHolder(
            log.slice(0, investorAction.logIndex + 1),
            log
          ) === player
        ) {
          cash += 2;
        }

        if (
          this.getController(investorAction.action.payload.nation, log) ===
          player
        ) {
          cash += 4;
        }

        if (
          this.hasSmallInvestment(
            investorAction.action.payload.nation,
            player,
            log
          )
        ) {
          cash += 1;
        }
      }
    });

    const taxationActionsCount = this.log.filter(
      (action) => action.type === "rondel" && action.payload.slot === "taxation"
    ).length;
    cash += taxationActionsCount;

    return cash;
  }

  getController(nation, log) {
    const bondPurchases = log.filter((action) => {
      return action.type === "bondPurchase" && action.payload.nation === nation;
    });

    const out = bondPurchases.sort((a, b) => {
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

  hasSmallInvestment(nation, player, log) {
    const bondPurchases = log.filter((action) => {
      return (
        action.type === "bondPurchase" &&
        action.payload.nation === nation &&
        action.payload.player === player &&
        action.payload.cost === 2
      );
    });
    if (bondPurchases.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  getInvestorCardHolder(log, fullLog) {
    const AHController = this.getController("AH", fullLog);
    const order = fullLog.find((action) => {
      return action.type === "playerSeating";
    }).payload.order;
    const indexOfInvestorCardHolder = order.indexOf(AHController);

    const investorRondelActions = log.filter(
      (action) => action.type === "rondel" && action.payload.slot === "investor"
    );
    let index = indexOfInvestorCardHolder - investorRondelActions.length;
    if (index === -1) {
      return order[order.length - 1];
    }
    index = Math.abs(index);

    return order[index];
  }

  startedConflict(lastMove) {
    return true;
  }

  factoryCount(nation) {
    return 2;
  }

  flagCount(nation) {
    return 2;
  }

  unitCount(nation) {
    return 2;
  }

  homeProvinces(nation) {
    if (nation === "AH") {
      return ["vienna", "budapest", "prague", "lemberg", "trieste"];
    } else if (nation === "IT") {
      return ["rome", "naples"];
    } else if (nation === "FR") {
      return ["paris", "bordeaux", "marseille"];
    } else if (nation === "GB") {
      return ["london", "liverpool"];
    } else if (nation === "GE") {
      return ["berlin", "hamburg"];
    } else if (nation === "RU") {
      return ["moscow", "st. petersburg", "odessa", "kiev", "warsaw"];
    }
  }
}

module.exports = Imperial;

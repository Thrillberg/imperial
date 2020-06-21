const { Nation } = require("./constants");
const { bondPurchase, maneuver } = require("./actions");

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
    const postInvestorSlots = ["import", "production2"];
    const lastMoveSkippedInvestorSlot =
      lastMove.type === "rondel" &&
      postInvestorSlots.includes(lastMove.payload.slot) &&
      this.previousRondelPosition(lastMove.payload.nation) === "maneuver1";

    if (lastMoveSkippedInvestorSlot) {
      return [
        bondPurchase(Nation.AH, "Claudia", 4),
        bondPurchase(Nation.AH, "Claudia", 6),
        bondPurchase(Nation.IT, "Claudia", 2),
        bondPurchase(Nation.IT, "Claudia", 4),
        bondPurchase(Nation.IT, "Claudia", 6),
        bondPurchase(Nation.FR, "Claudia", 4),
        bondPurchase(Nation.FR, "Claudia", 6),
        bondPurchase(Nation.GB, "Claudia", 4),
        bondPurchase(Nation.GB, "Claudia", 6),
        bondPurchase(Nation.GE, "Claudia", 2),
        bondPurchase(Nation.RU, "Claudia", 4),
      ];
    } else if (this.shouldReturnRondelActions(lastMove)) {
      return this.rondelActions(this.getNation(this.log));
    } else if (this.lastMoveWasRondelManeuver(lastMove)) {
      switch (lastMove.payload.nation) {
        case Nation.FR:
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
            parisActions.push(maneuver("paris", province));
          });
          return [
            maneuver("bordeaux", "bay of biscay"),
            maneuver("marseille", "western mediterranean sea"),
            ...parisActions,
          ];
        case Nation.GB:
          return [
            maneuver("liverpool", "north atlantic"),
            maneuver("london", "english channel"),
          ];
        case Nation.GE:
          return [
            maneuver("hamburg", "north sea"),
            maneuver("berlin", "danzig"),
            maneuver("berlin", "prague"),
            maneuver("berlin", "munich"),
            maneuver("berlin", "cologne"),
            maneuver("berlin", "hamburg"),
            maneuver("berlin", "dijon"),
            maneuver("berlin", "belgium"),
            maneuver("berlin", "holland"),
            maneuver("berlin", "denmark"),
            maneuver("berlin", "london"),
            maneuver("berlin", "sheffield"),
            maneuver("berlin", "edinburgh"),
            maneuver("berlin", "norway"),
          ];
        case Nation.AH:
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
            lembergActions.push(maneuver("trieste", province));
            budapestActions.push(maneuver("budapest", province));
            viennaActions.push(maneuver("vienna", province));
          });
          return [
            maneuver("trieste", "ionian sea"),
            ...lembergActions,
            ...budapestActions,
            ...viennaActions,
          ];
        case Nation.IT:
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
            romeActions.push(maneuver("rome", province));
          });
          return [
            maneuver("naples", "western mediterranean sea"),
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
              incumbent: Nation.IT,
              challenger: Nation.FR,
            },
          },
          {
            type: "fight",
            payload: {
              province: "western mediterranean sea",
              incumbent: Nation.IT,
              challenger: Nation.FR,
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
    const nations = new Map();
    for (const nation of Nation) {
      nations.set(nation, {
        controller: this.getController(nation, this.log),
        treasury: this.getTreasury(nation, this.log),
        taxChartPosition: this.getTaxChartPosition(nation),
        powerPoints: this.getPowerPoints(nation),
      });
    }
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
        bonds: this.getBonds(player),
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
      "cologne",
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

    const evacuationCount = this.log.filter(
      (action) =>
        action.type === "maneuver" && action.payload.origin === province
    ).length;
    unitCount -= evacuationCount;

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
      return Nation.AH;
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
    return lastTurnNation.when({
      AH: () => Nation.IT,
      IT: () => Nation.FR,
      FR: () => Nation.GB,
      GB: () => Nation.GE,
      GE: () => Nation.RU,
      RU: () => Nation.AH,
    });
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
    if (nation === Nation.AH) {
      return ["vienna", "budapest", "prague", "lemberg", "trieste"];
    } else if (nation === Nation.IT) {
      return ["rome", "naples"];
    } else if (nation === Nation.FR) {
      return ["paris", "bordeaux"];
    } else if (nation === Nation.GB) {
      return ["london", "liverpool"];
    } else if (nation === Nation.GE) {
      return ["berlin", "hamburg"];
    } else if (nation === Nation.RU) {
      return ["moscow", "st. petersburg", "odessa", "kiev", "warsaw"];
    }
  }

  buildFactoryAction(nation) {
    return new Set(
      nation
        .when({
          AH: () => ["trieste", "prague", "lemburg"],
          IT: () => ["genoa", "venice", "florence"],
          FR: () => ["brest", "dijon", "marseille"],
          GB: () => ["dublin", "sheffield", "edinburgh"],
          GE: () => ["danzig", "munich", "cologne"],
          RU: () => ["kiev", "st. petersburg", "warsaw"],
        })
        .map((province) => ({
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

    const buildFactoryActions = log.filter((action) => {
      return (
        action.type === "buildFactory" &&
        nation
          .when({
            AH: () => ["trieste", "prague", "lemburg"],
            IT: () => ["genoa", "venice", "florence"],
            FR: () => ["brest", "dijon", "marseille"],
            GB: () => ["dublin", "sheffield", "edinburgh"],
            GE: () => ["danzig", "munich", "cologne"],
            RU: () => ["kiev", "st. petersburg", "warsaw"],
          })
          .includes(action.payload.province)
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

    const taxationActions = this.log.filter(
      (action) =>
        action.type === "rondel" &&
        action.payload.slot === "taxation" &&
        player === this.getController(action.payload.nation)
    );
    if (taxationActions.length > 0) {
      const powerPointsCash = this.getPowerPoints(
        taxationActions[0].payload.nation
      );
      cash += powerPointsCash;
    }

    const postInvestorSlots = ["import", "production2"];
    const investorSlotSkippedCount = this.log.filter(
      (action) =>
        action.type === "rondel" &&
        postInvestorSlots.includes(action.payload.slot) &&
        this.previousRondelPosition(action.payload.nation) === "maneuver1"
    ).length;
    if (investorSlotSkippedCount === 1) {
      cash += 2;
    }

    return cash;
  }

  getBonds(player) {
    return [
      { nation: Nation.AH, cost: 2 },
      { nation: Nation.FR, cost: 9 },
      { nation: Nation.AH, cost: 6 },
    ];
  }

  previousRondelPosition(nation) {
    const rondelActions = this.log.filter(
      (action) => action.type === "rondel" && action.payload.nation === nation
    );
    if (rondelActions.length > 2) {
      return rondelActions[rondelActions.length - 2].payload.slot;
    }
  }

  getController(nation, log) {
    const bondPurchases = this.log.filter((action) => {
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
    const AHController = this.getController(Nation.AH, fullLog);
    const order = fullLog.find((action) => {
      return action.type === "playerSeating";
    }).payload.order;
    const indexOfInvestorCardHolder = order.indexOf(AHController);

    const investorRondelActionsCount = log.filter(
      (action) => action.type === "rondel" && action.payload.slot === "investor"
    ).length;
    const postInvestorSlots = ["import", "production2"];
    const investorSlotSkippedCount = fullLog.filter(
      (action) =>
        action.type === "rondel" &&
        postInvestorSlots.includes(action.payload.slot) &&
        this.previousRondelPosition(action.payload.nation) === "maneuver1"
    ).length;
    const investorActionsCount =
      investorRondelActionsCount + investorSlotSkippedCount;
    let index = indexOfInvestorCardHolder - investorActionsCount;
    if (index === -1) {
      return order[order.length - 1];
    } else if (index === -3) {
      return order[order.length - 4];
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
    if (nation === Nation.AH) {
      return ["vienna", "budapest", "prague", "lemberg", "trieste"];
    } else if (nation === Nation.IT) {
      return ["rome", "naples"];
    } else if (nation === Nation.FR) {
      return ["paris", "bordeaux", "marseille"];
    } else if (nation === Nation.GB) {
      return ["london", "liverpool"];
    } else if (nation === Nation.GE) {
      return ["berlin", "hamburg"];
    } else if (nation === Nation.RU) {
      return ["moscow", "st. petersburg", "odessa", "kiev", "warsaw"];
    }
  }
}

module.exports = Imperial;

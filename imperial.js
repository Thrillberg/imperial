const { Nation } = require("./constants");
const Action = require("./action");

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
        Action.bondPurchase({ nation: Nation.AH, player: "Claudia", cost: 4 }),
        Action.bondPurchase({ nation: Nation.AH, player: "Claudia", cost: 6 }),
        Action.bondPurchase({ nation: Nation.IT, player: "Claudia", cost: 2 }),
        Action.bondPurchase({ nation: Nation.IT, player: "Claudia", cost: 4 }),
        Action.bondPurchase({ nation: Nation.IT, player: "Claudia", cost: 6 }),
        Action.bondPurchase({ nation: Nation.FR, player: "Claudia", cost: 4 }),
        Action.bondPurchase({ nation: Nation.FR, player: "Claudia", cost: 6 }),
        Action.bondPurchase({ nation: Nation.GB, player: "Claudia", cost: 4 }),
        Action.bondPurchase({ nation: Nation.GB, player: "Claudia", cost: 6 }),
        Action.bondPurchase({ nation: Nation.GE, player: "Claudia", cost: 2 }),
        Action.bondPurchase({ nation: Nation.RU, player: "Claudia", cost: 4 }),
      ];
    } else if (this.lastMoveWasInvestor(lastMove)) {
      const purchasedBonds = new Set(
        this.toBonds(
          this.log.filter((action) => action.type === "bondPurchase")
        ).map(({ nation, cost }) => `${nation}|${cost}`)
      );

      const allRemainingBonds = this.allBonds().filter(({ nation, cost }) => {
        return !purchasedBonds.has(`${nation}|${cost}`);
      });

      return allRemainingBonds
        .filter((bond) => {
          const player = this.investorCardHolder();
          const exchangeableBondCosts = this.getBonds(player)
            .filter((exchangeableBond) => {
              return exchangeableBond.nation === bond.nation;
            })
            .map((x) => x.cost);
          const topBondCost = Math.max(exchangeableBondCosts);
          return bond.cost <= this.getCash(player) + topBondCost;
        })
        .map((bond) => {
          return Action.bondPurchase({
            nation: bond.nation,
            player: this.investorCardHolder(),
            cost: bond.cost,
          });
        });
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
            parisActions.push(
              Action.maneuver({ origin: "paris", destination: province })
            );
          });
          return [
            Action.maneuver({
              origin: "bordeaux",
              destination: "bay of biscay",
            }),
            Action.maneuver({
              origin: "marseille",
              destination: "western mediterranean sea",
            }),
            ...parisActions,
          ];
        case Nation.GB:
          return [
            Action.maneuver({
              origin: "liverpool",
              destination: "north atlantic",
            }),
            Action.maneuver({
              origin: "london",
              destination: "english channel",
            }),
          ];
        case Nation.GE:
          return [
            Action.maneuver({ origin: "hamburg", destination: "north sea" }),
            Action.maneuver({ origin: "berlin", destination: "danzig" }),
            Action.maneuver({ origin: "berlin", destination: "prague" }),
            Action.maneuver({ origin: "berlin", destination: "munich" }),
            Action.maneuver({ origin: "berlin", destination: "cologne" }),
            Action.maneuver({ origin: "berlin", destination: "hamburg" }),
            Action.maneuver({ origin: "berlin", destination: "dijon" }),
            Action.maneuver({ origin: "berlin", destination: "belgium" }),
            Action.maneuver({ origin: "berlin", destination: "holland" }),
            Action.maneuver({ origin: "berlin", destination: "denmark" }),
            Action.maneuver({ origin: "berlin", destination: "london" }),
            Action.maneuver({ origin: "berlin", destination: "sheffield" }),
            Action.maneuver({ origin: "berlin", destination: "edinburgh" }),
            Action.maneuver({ origin: "berlin", destination: "norway" }),
          ];
        case Nation.AH:
          return this.unitLocations(Nation.AH)
            .map((origin) => {
              return this.possibleDestinations(origin).map((destination) => {
                return Action.maneuver({ origin, destination });
              });
            })
            .reduce((acc, val) => acc.concat(val), []);
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
            romeActions.push(
              Action.maneuver({ origin: "rome", destination: province })
            );
          });
          return [
            Action.maneuver({
              origin: "naples",
              destination: "western mediterranean sea",
            }),
            ...romeActions,
          ];
        case Nation.RU:
          const RULandDestinations = [
            "warsaw",
            "odessa",
            "kiev",
            "st. petersburg",
            "danzig",
            "prague",
            "lemberg",
            "romania",
            "bulgaria",
            "turkey",
            "sweden",
            "berlin",
            "hamburg",
            "denmark",
          ];
          let moscowActions = [];
          RULandDestinations.map((province) => {
            moscowActions.push(
              Action.maneuver({ origin: "moscow", destination: province })
            );
          });
          return [
            Action.maneuver({
              origin: "st. petersburg",
              destination: "baltic sea",
            }),
            Action.maneuver({
              origin: "odessa",
              destination: "black sea",
            }),
            ...moscowActions,
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
          Action.coexist({
            province: "western mediterranean sea",
            incumbent: Nation.IT,
            challenger: Nation.FR,
          }),
          Action.fight({
            province: "western mediterranean sea",
            incumbent: Nation.IT,
            challenger: Nation.FR,
          }),
          ,
        ];
      } else {
        return this.rondelActions(this.getNation(this.log));
      }
    }
  }

  unitLocations(nation) {
    const maneuverActions = this.log
      .map((action, index) => {
        if (
          action.type === "rondel" &&
          action.payload.nation === nation &&
          (action.payload.slot === "maneuver1" ||
            action.payload.slot === "maneuver2")
        ) {
          return { action, index };
        } else {
          return null;
        }
      })
      .filter(Boolean);

    const penultimateManeuverAction =
      maneuverActions[maneuverActions.length - 2];
    if (!!penultimateManeuverAction) {
      const slice = this.log.slice(
        penultimateManeuverAction.index + 1,
        this.log.length - 1
      );
      let maneuvers = [];
      for (var i = 0; i < slice.length; i++) {
        if (slice[i].type === "maneuver") {
          maneuvers.push(slice[i]);
        } else {
          break;
        }
      }

      return maneuvers.map((maneuver) => maneuver.payload.destination);
    } else {
      return ["lemberg", "trieste", "vienna", "budapest"];
    }
  }

  possibleDestinations(origin) {
    const sharedLandDestinations = [
      "trieste",
      "vienna",
      "budapest",
      "lemberg",
      "prague",
    ];
    const landDestinations = [
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
    switch (origin) {
      case "trieste":
        return ["ionian sea"];
      case "budapest":
        return landDestinations;
      case "vienna":
        return landDestinations;
      case "lemberg":
        return landDestinations;
      case "ionian sea":
        return ["western mediterranean sea", "eastern mediterranean sea"];
      case "romania":
        return [...sharedLandDestinations, "odessa", "bulgaria", "west balkan"];
      case "west balkan":
        return [
          ...sharedLandDestinations,
          "greece",
          "bulgaria",
          "romania",
          "tunis",
          "naples",
          "rome",
          "venice",
        ];
      case "tunis":
        return [
          ...sharedLandDestinations,
          "algeria",
          "greece",
          "west balkan",
          "venice",
          "rome",
          "naples",
        ];
    }
  }

  allBonds() {
    return [...Nation]
      .map((nation) => {
        return [2, 4, 6, 9, 12, 16, 20, 25, 30].map((cost) => {
          return { nation: nation, cost: cost };
        });
      })
      .reduce((acc, val) => acc.concat(val), []);
  }

  toBonds(bondActions) {
    return bondActions.map((action) => {
      return { nation: action.payload.nation, cost: action.payload.cost };
    });
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
      "algeria",
      "baltic sea",
      "bay of biscay",
      "berlin",
      "black sea",
      "bordeaux",
      "budapest",
      "bulgaria",
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
      "sweden",
      "trieste",
      "tunis",
      "turkey",
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
      (action) =>
        action.type === "maneuver" && action.payload.destination === province
    );
    const fightActionsIndices = actionsWithIndex
      .filter(
        (action) =>
          action.type === "fight" && action.payload.province === province
      )
      .map((action) => action.index);
    let realManeuvers = [];
    for (var i = 0; i < maneuverActions.length; i++) {
      if (!fightActionsIndices.includes(maneuverActions[i].index + 1)) {
        realManeuvers.push(maneuverActions[i]);
      }
    }
    if (realManeuvers.length > 0) {
      return this.log
        .slice(0, realManeuvers[realManeuvers.length - 1].index)
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
      ].map((slot) => Action.rondel({ nation, cost: 0, slot }))
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
      this.importLocations(nation).map((province) =>
        Action.import({ province })
      )
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
        .map((province) => Action.buildFactory({ province }))
    );
  }

  getTreasury(nation) {
    let treasuryAmount = 0;
    const importActions = this.log.filter(
      (action) =>
        action.type === "import" &&
        this.importLocations(nation).includes(action.payload.province)
    );
    treasuryAmount -= importActions.length;

    const investorRondelActions = this.log.filter(
      (action) =>
        action.type === "rondel" &&
        action.payload.slot === "investor" &&
        action.payload.nation === nation
    );

    if (this.investmentHasBeenSold(nation, 4, this.log)) {
      treasuryAmount += 9;
      treasuryAmount -= 4 * investorRondelActions.length;
    }
    if (this.investmentHasBeenSold(nation, 3, this.log)) {
      treasuryAmount += 6;
    }
    if (this.investmentHasBeenSold(nation, 2, this.log)) {
      treasuryAmount += 4;
      treasuryAmount -= 2 * investorRondelActions.length;
    }
    if (this.investmentHasBeenSold(nation, 1, this.log)) {
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

    const buildFactoryActions = this.log.filter((action) => {
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

  getCash(player, log = this.log) {
    let cash = 13;
    const bondPurchases = this.getBonds(player)
      .map((bond) => bond.cost)
      .reduce((a, b) => a + b, 0);
    cash -= bondPurchases;

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

        // if (
        //   this.hasMediumInvestment(investorAction.action.payload.nation, player)
        // ) {
        //   cash += 2;
        // }

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

    const taxationActions = log.filter(
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
    const investorSlotSkippedCount = log.filter(
      (action) =>
        action.type === "rondel" &&
        postInvestorSlots.includes(action.payload.slot) &&
        this.previousRondelPosition(action.payload.nation) === "maneuver1" &&
        this.getController(action.payload.nation) === player
    ).length;
    if (investorSlotSkippedCount === 1) {
      cash += 2;
    }

    return cash;
  }

  getNaiveCash(player, log = this.log) {
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

    const taxationActions = log.filter(
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
    const investorSlotSkippedCount = log.filter(
      (action) =>
        action.type === "rondel" &&
        postInvestorSlots.includes(action.payload.slot) &&
        this.previousRondelPosition(action.payload.nation) === "maneuver1" &&
        this.getController(action.payload.nation) === player
    ).length;
    if (investorSlotSkippedCount === 1) {
      cash += 2;
    }

    return cash;
  }

  getBonds(player) {
    const bondPurchases = this.log
      .map((action, index) => {
        if (
          action.type === "bondPurchase" &&
          action.payload.player === player
        ) {
          return { action, index };
        } else {
          return null;
        }
      })
      .filter(Boolean);

    let bondsToBeRemoved = [];
    let bonds = [];
    bondPurchases.map((purchase, index) => {
      const cashAtTimeOfPurchase = this.getNaiveCash(
        player,
        this.log.slice(0, purchase.index)
      );

      if (cashAtTimeOfPurchase >= purchase.action.payload.cost) {
        bonds.push(purchase);
      } else {
        bonds.push(purchase);
        bondsToBeRemoved.push(index - 1);
      }
    });
    bondsToBeRemoved.forEach((index) => {
      bonds.splice(index, 1);
    });
    return bonds.map((bond) => {
      return {
        nation: bond.action.payload.nation,
        cost: bond.action.payload.cost,
      };
    });
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

  hasMediumInvestment(nation, player) {
    const bondPurchases = this.log.filter((action) => {
      return (
        action.type === "bondPurchase" &&
        action.payload.nation === nation &&
        action.payload.player === player &&
        action.payload.cost === 4
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
    } else if (index <= -3) {
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

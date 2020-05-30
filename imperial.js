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
      } else if (lastMove.payload.slot === "maneuver1") {
        if (lastMove.payload.nation === "FR") {
          const landDestinations = [
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
          landDestinations.map((province) => {
            parisActions.push({
              type: "manuever",
              payload: { origin: "paris", destination: province },
            });
          });
          return [
            {
              type: "manuever",
              payload: {
                origin: "bordeaux",
                destination: "bay of biscay",
              },
            },
            {
              type: "manuever",
              payload: {
                origin: "marseille",
                destination: "western mediterranean sea",
              },
            },
            ...parisActions,
          ];
        } else {
          return [
            {
              type: "manuever",
              payload: { origin: "liverpool", destination: "north atlantic" },
            },
            {
              type: "manuever",
              payload: { origin: "london", destination: "english channel" },
            },
          ];
        }
      } else if (
        lastMove.payload.slot === "maneuver2" &&
        lastMove.payload.nation === "GE"
      ) {
        return [
          {
            type: "manuever",
            payload: { origin: "hamburg", destination: "north sea" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "danzig" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "prague" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "munich" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "cologne" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "hamburg" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "dijon" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "belgium" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "holland" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "denmark" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "london" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "sheffield" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "edinburgh" },
          },
          {
            type: "manuever",
            payload: { origin: "berlin", destination: "norway" },
          },
        ];
      } else if (lastMove.payload.nation === "AH") {
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
        let lembergActions = [];
        let budapestActions = [];
        let viennaActions = [];
        landDestinations.map((province) => {
          lembergActions.push({
            type: "manuever",
            payload: { origin: "trieste", destination: province },
          });
          budapestActions.push({
            type: "manuever",
            payload: { origin: "budapest", destination: province },
          });
          viennaActions.push({
            type: "manuever",
            payload: { origin: "vienna", destination: province },
          });
        });
        return [
          {
            type: "manuever",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          ...lembergActions,
          ...budapestActions,
          ...viennaActions,
        ];
      } else if (lastMove.payload.nation === "IT") {
        const landDestinations = [
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
        landDestinations.map((province) => {
          romeActions.push({
            type: "manuever",
            payload: { origin: "rome", destination: province },
          });
        });
        return [
          {
            type: "manuever",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          ...romeActions,
        ];
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
      "budapest",
      "english channel",
      "hamburg",
      "ionian sea",
      "lemberg",
      "liverpool",
      "london",
      "marseille",
      "moscow",
      "naples",
      "north atlantic",
      "north sea",
      "norway",
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
    const maneuverIndices = this.log.map((action, index) => {
      if (
        action.type === "maneuver" &&
        action.payload.destination === province
      ) {
        return {
          logIndex: index,
        };
      }
    });
    const lastManeuverIndex = maneuverIndices[maneuverIndices.length - 1];
    const reversedLog = this.log.slice(0, lastManeuverIndex).reverse();
    const lastManeuverAction = reversedLog.find((action) => {
      return (
        action.type === "rondel" &&
        (action.payload.slot === "maneuver1" ||
          action.payload.slot === "maneuver2")
      );
    });
    if (!!lastManeuverAction) {
      return lastManeuverAction.payload.nation;
    }
  }

  getUnitCount(province) {
    const importsCount = this.log.filter((action) => {
      return action.type === "import" && action.payload.province === province;
    }).length;

    if (importsCount === 0) {
      return 1;
    } else {
      return importsCount;
    }
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
    const index = indexOfInvestorCardHolder - investorRondelActions.length;
    if (index === -1) {
      return order[order.length - 1];
    }

    return order[index];
  }
}

module.exports = Imperial;

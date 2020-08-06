import { Nation, Bond } from "./constants.js";
import Action from "./action.js";
import standardGameBoard from "./standardGameBoard.js";
import setup from "./standardSetup.js";

export default class Imperial {
  static fromLog(log) {
    let game = new Imperial();
    log.forEach((entry) => game.tick(entry));
    return game;
  }

  constructor(board) {
    this.board = board || standardGameBoard;
    this.log = [];
    this.rondelSlots = this.setupRondelSlots();
  }

  setupRondelSlots() {
    return [
      { name: "factory", nations: [] },
      { name: "production1", nations: [] },
      { name: "maneuver1", nations: [] },
      { name: "investor", nations: [] },
      { name: "import", nations: [] },
      { name: "production2", nations: [] },
      { name: "maneuver2", nations: [] },
      { name: "taxation", nations: [] },
    ];
  }

  tick(action) {
    if (action.type === "noop") {
      return;
    } else if (action.type === "initialize") {
      const s = setup({
        players: action.payload.players,
        provinceNames: Array.from(this.board.graph.keys()),
      });
      this.availableBonds = s.availableBonds;
      this.currentNation = s.currentNation;
      this.investorCardHolder = s.investorCardHolder;
      this.nations = s.nations;
      this.order = s.order;
      this.players = s.players;
      this.provinces = s.provinces;
      this.units = s.units;
      return;
    } else if (action.type === "bondPurchase") {
      this.purchaseBond(action);
    } else if (action.type === "rondel") {
      this.removeNationFromOldSlot(action);
      this.addNationToNewSlot(action);
      this.handleInvestorAndProduction(action);
      this.handleTaxation(action);
      this.handleSkippingInvestorSlot(action);
      this.availableActions = this.availableActionsState(action);
    } else if (action.type === "import") {
      action.payload.forEach(({ province, type }) => {
        const nation = this.board.graph.get(province).nation;
        if (type === "army") {
          this.units.get(nation).get(province).armies++;
        } else {
          this.units.get(nation).get(province).fleets++;
        }
        this.nations.get(nation).treasury--;
      });
    } else if (action.type === "buildFactory") {
      this.buildFactory(action);
    } else if (action.type === "maneuver") {
      const maneuverActions = this.log.filter(
        (action) =>
          action.type === "rondel" &&
          (action.payload.slot === "maneuver1" ||
            action.payload.slot === "maneuver2")
      );
      const lastManeuver = maneuverActions[maneuverActions.length - 1];
      this.provinces.get(action.payload.destination).flag =
        lastManeuver.payload.nation;
      this.nations.get(lastManeuver.payload.nation).flagCount += 1;
      if (
        this.units.get(lastManeuver.payload.nation).get(action.payload.origin)
          .fleets > 0
      ) {
        this.units.get(lastManeuver.payload.nation).get(action.payload.origin)
          .fleets--;
        this.units
          .get(lastManeuver.payload.nation)
          .get(action.payload.destination).fleets++;
      }
      if (
        this.units.get(lastManeuver.payload.nation).get(action.payload.origin)
          .armies > 0
      ) {
        this.units.get(lastManeuver.payload.nation).get(action.payload.origin)
          .armies--;
        this.units
          .get(lastManeuver.payload.nation)
          .get(action.payload.destination).armies++;
      }
      this.availableActions = this.availableActionsState(action);
    } else if (action.type === "fight") {
      this.units.get(Nation.FR).get(action.payload.province).fleets -= 1;
      this.units.get(Nation.IT).get(action.payload.province).fleets -= 1;
      this.provinces.get(action.payload.province).flag =
        action.payload.incumbent;
    }
    this.log.push(action);
    this.handleAdvancePlayer(action);
  }

  handleAdvancePlayer(action) {
    if (
      action.type === "import" ||
      action.type === "bondPurchase" ||
      action.type === "buildFactory" ||
      action.payload.slot === "production1" ||
      action.payload.slot === "production2"
    ) {
      this.currentNation = this.getNation(this.log);
      try {
        this.currentPlayerName = this.getController(this.currentNation);
      } catch (e) {
        console.log(this.currentNation);
      }
    } else {
      this.availableActions = this.availableActionsState(action);
    }
  }

  purchaseBond(action) {
    const uncost = {
      2: 1,
      4: 2,
      6: 3,
      9: 4,
      12: 5,
      16: 6,
      20: 7,
      25: 8,
      30: 9,
    };
    const bonds = this.players[action.payload.player].bonds;
    if (action.payload.cost > this.players[action.payload.player].cash) {
      const tradeIn = [...bonds]
        .filter(({ nation }) => nation === action.payload.nation)
        .map(({ cost }) => cost)[0];
      if (tradeIn === undefined) {
        throw new Error(
          `${action.payload.player} does not have any bonds to trade for ${action.payload.nation}`
        );
      }
      const bondToTrade = Bond(action.payload.nation, uncost[tradeIn]);
      const netCost = action.payload.cost - bondToTrade.cost;
      this.nations.get(action.payload.nation).treasury += netCost;
      this.availableBonds.add(bondToTrade);
      this.players[action.payload.player].cash -= netCost;
      this.players[action.payload.player].bonds.delete(bondToTrade);
    } else {
      this.nations.get(action.payload.nation).treasury += action.payload.cost;
      this.players[action.payload.player].cash -= action.payload.cost;
    }

    const newBond = Bond(action.payload.nation, uncost[action.payload.cost]);
    if (!this.availableBonds.has(newBond)) {
      throw new Error(`${bond} not available`);
    }
    this.players[action.payload.player].bonds.add(newBond);
    this.availableBonds.delete(newBond);

    const totalInvestmentInNation = [...bonds]
      .filter((bond) => bond.nation === action.payload.nation)
      .reduce((x, y) => x + y.cost, 0);
    if (totalInvestmentInNation >= 6) {
      this.nations.get(action.payload.nation).controller =
        action.payload.player;
    }
    this.advanceInvestorCard();
  }

  advanceInvestorCard() {
    if (!!this.investorCardHolder) {
      const index = this.order.indexOf(this.investorCardHolder);
      if (index === 0) {
        this.investorCardHolder = this.order[this.order.length - 1];
      } else {
        this.investorCardHolder = this.order[index - 1];
      }
    }
  }

  removeNationFromOldSlot(action) {
    this.rondelSlots.forEach((slot) => {
      const nationIndex = slot.nations.indexOf(action.payload.nation.value);
      if (nationIndex !== -1) {
        slot.nations.splice(nationIndex, 1);
      }
    });
  }

  addNationToNewSlot(action) {
    this.rondelSlots
      .find((slot) => slot.name === action.payload.slot)
      .nations.push(action.payload.nation.value);
  }

  handleInvestorAndProduction(action) {
    if (action.payload.slot === "investor") {
      this.players[this.investorCardHolder].cash += 2;
      for (var player of Object.keys(this.players)) {
        if (this.players[player].bonds.size > 0) {
          for (const bond of this.players[player].bonds) {
            if (bond.nation === action.payload.nation) {
              if (bond.cost === 9) {
                this.players[player].cash += 4;
                this.nations.get(action.payload.nation).treasury -= 4;
              } else {
                this.players[player].cash += 1;
                this.nations.get(action.payload.nation).treasury -= 1;
              }
            }
          }
        }
      }
    } else if (
      action.payload.slot === "production1" ||
      action.payload.slot === "production2"
    ) {
      Array.from(this.board.byNation.get(action.payload.nation))
        .filter((province) => this.provinces.get(province).factory !== null)
        .forEach((province) => {
          if (this.provinces.get(province).factory === "shipyard") {
            this.units.get(action.payload.nation).get(province).fleets++;
          } else {
            this.units.get(action.payload.nation).get(province).armies++;
          }
        });
    }
  }

  handleTaxation(action) {
    if (action.payload.slot === "taxation") {
      const nationName = action.payload.nation;
      const nation = this.nations.get(nationName);
      const taxes = this.factoryCount(nationName) * 2 + nation.flagCount;
      nation.treasury += taxes - this.unitCount(nationName);

      this.players[this.getController(nationName)].cash +=
        taxes - nation.taxChartPosition;
      nation.taxChartPosition = taxes;
      if (taxes === 6) {
        nation.powerPoints += 1;
      } else {
        nation.powerPoints += 3;
      }
    }
  }

  unitCount(nation) {
    let out = 0;
    for (const [province, units] of this.units.get(nation)) {
      out += units.armies;
      out += units.fleets;
    }
    return out;
  }

  handleSkippingInvestorSlot(action) {
    const postInvestorSlots = ["import", "production2"];
    if (
      postInvestorSlots.includes(action.payload.slot) &&
      this.previousRondelPosition(action.payload.nation) === "maneuver1"
    ) {
      this.players[this.currentPlayerName].cash += 2;
    }
  }

  buildFactory(action) {
    const nation = this.getNationByProvince(action.payload.province);
    this.provinces.get(
      action.payload.province
    ).factory = standardGameBoard.graph.get(
      action.payload.province
    ).factoryType;
    this.nations.get(nation).treasury -= 5;
  }

  getNationByProvince(province) {
    if (province === "st. petersburg" || province === "moscow") {
      return Nation.RU;
    } else if (province === "marseille") {
      return Nation.FR;
    } else if (province === "cologne") {
      return Nation.GE;
    }

    return Nation.AH;
  }

  availableActionsState(action) {
    const lastMove = action || this.log[this.log.length - 1];
    const postInvestorSlots = ["import", "production2"];
    const lastMoveSkippedInvestorSlot =
      lastMove.type === "rondel" &&
      postInvestorSlots.includes(lastMove.payload.slot) &&
      this.previousRondelPosition(lastMove.payload.nation) === "maneuver1";

    if (lastMoveSkippedInvestorSlot) {
      return new Set([
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
      ]);
    } else if (this.lastMoveWasInvestor(lastMove)) {
      return new Set(
        [...this.availableBonds]
          .filter((bond) => {
            const player = this.investorCardHolder;
            const exchangeableBondCosts = this.getBonds(player)
              .filter((exchangeableBond) => {
                return exchangeableBond.nation === bond.nation;
              })
              .map((x) => x.cost);
            const topBondCost = Math.max(exchangeableBondCosts);
            return bond.cost <= this.players[player].cash + topBondCost;
          })
          .map((bond) => {
            return Action.bondPurchase({
              nation: bond.nation,
              player: this.investorCardHolder,
              cost: bond.cost,
            });
          })
      );
    } else if (this.lastMoveWasTaxation(lastMove)) {
      return new Set(this.rondelActions(this.getNation(this.log)));
    } else if (this.lastMoveWasRondelManeuver(lastMove)) {
      const destinations = new Set();
      const provincesWithFleets = new Map();

      for (const [province, units] of this.units.get(lastMove.payload.nation)) {
        if (units.fleets > 0) {
          provincesWithFleets.set(province, units.fleets);
        }
      }

      for (const [origin, count] of provincesWithFleets) {
        for (const destination of standardGameBoard.neighborsFor({
          origin,
          nation: lastMove.payload.nation,
          isFleet: true,
          friendlyFleets: new Set(),
        })) {
          destinations.add(Action.maneuver({ origin, destination }));
        }
      }

      return destinations;
    } else if (lastMove.type === "rondel") {
      if (lastMove.payload.slot === "factory") {
        return new Set(this.buildFactoryAction(lastMove.payload.nation));
      } else if (lastMove.payload.slot === "import") {
        return new Set(this.importAction(lastMove.payload.nation));
      }
    } else if (lastMove.type === "maneuver") {
      if (this.startedConflict(lastMove)) {
        return new Set([
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
        ]);
      } else if (lastMove.payload.destination === "north sea") {
        return new Set([
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
        ]);
      } else if (lastMove.payload.destination === "ionian sea") {
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
          lembergActions.push(
            Action.maneuver({ origin: "lemberg", destination: province })
          );
          budapestActions.push(
            Action.maneuver({ origin: "budapest", destination: province })
          );
          viennaActions.push(
            Action.maneuver({ origin: "vienna", destination: province })
          );
        });

        return new Set([
          ...lembergActions,
          ...viennaActions,
          ...budapestActions,
        ]);
      } else if (
        lastMove.payload.origin === "naples" &&
        lastMove.payload.destination === "western mediterranean sea"
      ) {
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
        return new Set(romeActions);
      } else if (lastMove.payload.destination === "bay of biscay") {
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
        return new Set(parisActions);
      } else if (lastMove.payload.destination === "black sea") {
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
        return new Set(moscowActions);
      } else if (lastMove.payload.destination === "western mediterranean sea") {
        const sharedLandDestinations = [
          "trieste",
          "vienna",
          "budapest",
          "lemberg",
          "prague",
        ];
        const romaniaDestinations = [
          ...sharedLandDestinations,
          "odessa",
          "bulgaria",
          "west balkan",
        ];
        const romaniaActions = [];
        romaniaDestinations.map((province) => {
          romaniaActions.push(
            Action.maneuver({ origin: "romania", destination: province })
          );
        });
        const westBalkanDestinations = [
          ...sharedLandDestinations,
          "greece",
          "bulgaria",
          "romania",
          "tunis",
          "naples",
          "rome",
          "venice",
        ];
        const westBalkanActions = [];
        westBalkanDestinations.map((province) => {
          westBalkanActions.push(
            Action.maneuver({ origin: "west balkan", destination: province })
          );
        });
        const tunisDestinations = [
          ...sharedLandDestinations,
          "algeria",
          "greece",
          "west balkan",
          "venice",
          "rome",
          "naples",
        ];
        const tunisActions = [];
        tunisDestinations.map((province) => {
          tunisActions.push(
            Action.maneuver({ origin: "tunis", destination: province })
          );
        });
        return new Set([
          ...romaniaActions,
          ...westBalkanActions,
          ...tunisActions,
        ]);
      } else {
        return new Set(this.rondelActions(this.getNation(this.log)));
      }
    }
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
      return this.currentNation;
    }
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
    const out = new Set();
    for (const province of this.board.byNation.get(nation)) {
      if (this.board.graph.get(province).factoryType === "shipyard") {
        out.add(Action.import({ province, unit: "fleet" }));
      }
      out.add(Action.import({ province, unit: "army" }));
    }
    return out;
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

  getBonds(player) {
    return [...this.players[player].bonds];
  }

  previousRondelPosition(nation) {
    const rondelActions = this.log.filter(
      (action) => action.type === "rondel" && action.payload.nation === nation
    );
    if (rondelActions.length > 2) {
      return rondelActions[rondelActions.length - 1].payload.slot;
    }
  }

  getController(nation) {
    return this.nations.get(nation).controller;
  }

  startedConflict(lastMove) {
    return (
      lastMove.payload.origin === "marseille" &&
      lastMove.payload.destination === "western mediterranean sea"
    );
  }

  factoryCount(nation) {
    let count = 0;
    for (const province of this.board.byNation.get(nation)) {
      if (this.provinces.get(province).factory) {
        count++;
      }
    }
    return count;
  }
}

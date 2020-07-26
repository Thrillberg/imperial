import { Nation, Bond } from "./constants.js";
import Action from "./action.js";
import setup from "./setup.js";

export default class Imperial {
  static fromLog(log) {
    let game = new Imperial();
    log.forEach((entry) => game.tick(entry));
    return game;
  }

  constructor() {
    this.log = [];
    this.nations = this.setupNations();
    this.players = {};
    this.order = null;
    this.provinces = this.setupProvinces();
    this.rondelSlots = this.setupRondelSlots();
  }

  get state() {
    return {
      availableActions: this.availableActionsState(),
      investorCardHolder: this.investorCardHolderState(),
      players: this.playersState(),
    };
  }

  setupNations() {
    const nations = new Map();
    for (const nation of Nation) {
      nations.set(nation, {
        controller: "",
        flagCount: 0,
        powerPoints: 0,
        rondelPosition: "",
        taxChartPosition: 5,
        treasury: 0,
        unitCount: 0,
      });
    }
    return nations;
  }

  setupProvinces() {
    const provinces = new Map();
    for (const province of [
      "algeria",
      "baltic sea",
      "bay of biscay",
      "berlin",
      "black sea",
      "bordeaux",
      "brest",
      "budapest",
      "bulgaria",
      "cologne",
      "danzig",
      "dijon",
      "dublin",
      "edinburgh",
      "english channel",
      "florence",
      "genoa",
      "hamburg",
      "ionian sea",
      "kiev",
      "lemberg",
      "liverpool",
      "london",
      "marseille",
      "morocco",
      "moscow",
      "munich",
      "naples",
      "north atlantic",
      "north sea",
      "norway",
      "odessa",
      "paris",
      "prague",
      "romania",
      "rome",
      "sheffield",
      "spain",
      "st. petersburg",
      "sweden",
      "trieste",
      "tunis",
      "turkey",
      "venice",
      "vienna",
      "warsaw",
      "west balkan",
      "western mediterranean sea",
    ]) {
      provinces.set(province, {
        unitCount: 0,
        hasFactory: false,
      });
    }
    provinces.get("vienna").hasFactory = true;
    provinces.get("budapest").hasFactory = true;
    provinces.get("paris").hasFactory = true;
    provinces.get("bordeaux").hasFactory = true;
    provinces.get("london").hasFactory = true;
    provinces.get("liverpool").hasFactory = true;
    provinces.get("berlin").hasFactory = true;
    provinces.get("hamburg").hasFactory = true;
    provinces.get("rome").hasFactory = true;
    provinces.get("naples").hasFactory = true;
    provinces.get("odessa").hasFactory = true;
    provinces.get("moscow").hasFactory = true;

    return provinces;
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
      const s = setup(action.payload);
      this.availableBonds = s.availableBonds;
      this.investorCardHolder = s.investorCardHolder;
      this.nations = s.nations;
      this.order = s.order;
      this.players = s.players;
      return;
    } else if (action.type === "playerSeating") {
      this.seatPlayers(action);
    } else if (action.type === "startFirstRound") {
      this.startFirstRound();
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
      this.import(action);
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
      this.provinces.get(action.payload.origin).unitCount -= 1;
      this.provinces.get(action.payload.destination).unitCount += 1;
      this.availableActions = this.availableActionsState(action);
    } else if (action.type === "fight") {
      this.provinces.get(action.payload.province).unitCount -= 2;
      this.provinces.get(action.payload.province).flag =
        action.payload.incumbent;
    }
    this.log.push(action);
    this.handleAdvancePlayer(action);
  }

  handleAdvancePlayer(action) {
    if (
      action.type === "bondPurchase" ||
      action.type === "buildFactory" ||
      action.payload.slot === "production1" ||
      action.payload.slot === "production2" ||
      this.log[this.log.length - 1].type === "import"
    ) {
      this.currentNationName = this.getNation(this.log).value;
      this.currentPlayerName = this.getController(this.getNation(this.log));
    } else {
      this.availableActions = this.availableActionsState(action);
    }
  }

  seatPlayers(action) {
    this.order = action.payload.order;
    action.payload.order.forEach(
      (player) =>
        (this.players[player] = { name: player, cash: 13, bonds: new Set() })
    );
  }

  startFirstRound() {
    this.currentPlayerName = this.getController(Nation.AH);
    const investorCardHolderIndex =
      this.order.indexOf(this.currentPlayerName) - 1;
    this.investorCardHolder = this.order[investorCardHolderIndex];
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
      this.homeProvinces(action.payload.nation)
        .filter((province) => this.provinces.get(province).hasFactory === true)
        .forEach((province) => {
          this.provinces.get(province).unitCount += 1;
          this.nations.get(action.payload.nation).unitCount += 1;
        });
    }
  }

  handleTaxation(action) {
    if (action.payload.slot === "taxation") {
      const nationName = action.payload.nation;
      const nation = this.nations.get(nationName);
      const taxes = this.factoryCount(nationName) * 2 + nation.flagCount;
      nation.treasury += taxes - nation.unitCount;

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

  handleSkippingInvestorSlot(action) {
    const postInvestorSlots = ["import", "production2"];
    if (
      postInvestorSlots.includes(action.payload.slot) &&
      this.previousRondelPosition(action.payload.nation) === "maneuver1"
    ) {
      this.players[this.currentPlayerName].cash += 2;
    }
  }

  import(action) {
    const nation = this.getNationByProvince(action.payload.province);
    this.nations.get(nation).treasury -= 1;
    this.provinces.get(action.payload.province).unitCount += 1;
    this.nations.get(nation).unitCount += 1;
  }

  buildFactory(action) {
    const nation = this.getNationByProvince(action.payload.province);
    this.provinces.get(action.payload.province).hasFactory = true;
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
          return new Set([
            Action.maneuver({
              origin: "bordeaux",
              destination: "bay of biscay",
            }),
            Action.maneuver({
              origin: "marseille",
              destination: "western mediterranean sea",
            }),
            ...parisActions,
          ]);
        case Nation.GB:
          return new Set([
            Action.maneuver({
              origin: "liverpool",
              destination: "north atlantic",
            }),
            Action.maneuver({
              origin: "london",
              destination: "english channel",
            }),
          ]);
        case Nation.GE:
          return new Set([
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
          ]);
        case Nation.AH:
          return new Set(
            this.unitLocations(Nation.AH)
              .map((origin) => {
                return this.possibleDestinations(origin).map((destination) => {
                  return Action.maneuver({ origin, destination });
                });
              })
              .reduce((acc, val) => acc.concat(val), [])
          );
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
          return new Set([
            Action.maneuver({
              origin: "naples",
              destination: "western mediterranean sea",
            }),
            ...romeActions,
          ]);
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
          return new Set([
            Action.maneuver({
              origin: "st. petersburg",
              destination: "baltic sea",
            }),
            Action.maneuver({
              origin: "odessa",
              destination: "black sea",
            }),
            ...moscowActions,
          ]);
      }
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
      } else {
        return new Set(this.rondelActions(this.getNation(this.log)));
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

  investorCardHolderState() {
    return this.getInvestorCardHolder(this.log, this.log);
  }

  playersState() {
    let players = {};
    this.order.map((player) => {
      players[player] = {
        cash: this.getCash(player, this.log),
        bonds: this.getBonds(player),
      };
    });
    return players;
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
    treasuryAmount +=
      this.nations.get(nation).flagCount * taxationRondelActionsCount;

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
      }
    });

    const taxationActions = log.filter(
      (action) =>
        action.type === "rondel" &&
        action.payload.slot === "taxation" &&
        player === this.getController(action.payload.nation)
    );

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
    return this.nations.get(nation).controller
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

  homeProvinces(nation) {
    return nation.when({
      AH: () => ["vienna", "budapest", "prague", "lemberg", "trieste"],
      IT: () => ["rome", "naples", "genoa", "venice", "florence"],
      FR: () => ["paris", "bordeaux", "marseille", "dijon", "brest"],
      GB: () => ["london", "liverpool", "dublin", "edinburgh", "sheffield"],
      GE: () => ["berlin", "hamburg", "munich", "danzig", "cologne"],
      RU: () => ["moscow", "st. petersburg", "odessa", "kiev", "warsaw"],
    });
  }
}

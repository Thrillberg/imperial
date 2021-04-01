import { Nation, Bond } from "./constants.js";
import Action from "./action.js";
import Auction from "./auction.js";
import standardGameBoard from "./board.js";
import auctionSetup from "./auctionSetup.js";
import standardSetup from "./standardSetup.js";
import availableBondPurchases from "./availableBondPurchases.js";
import setOldState from "./setOldState.js";

export default class Imperial {
  static fromLog(log, board) {
    let game = new Imperial(board);
    log.forEach(entry => game.tick(entry));
    return game;
  }

  constructor(board) {
    this.board = board || standardGameBoard;
    // This is the canonical log from which game state is derived.
    this.log = [];
    // This includes everything from this.log plus extra actions that are
    // useful for display purposes. Do not rely on this log for game state
    // calculations.
    this.annotatedLog = [];
    this.unitsToMove = [];
    this.units = new Set();
    this.provinces = new Map();
    this.nations = new Map();
    this.availableActions = new Set();

    this.maneuvering = false;
    this.handlingConflict = false;
    this.soloMode = false;
    this.swissBanks = [];
    this.uncontrolledNations = [];
    this.passingThroughInvestor = false;
    this.previousPlayerName = "";
    this.fleetConvoyCount = {};
    this.maxImports = 0;
    this.winner = "";
    this.availableBonds = new Set();
    this.players = {};
    this.investing = false;
    this.firstInvestor = "";
    this.currentNationInConflict = null;
    this.coexistingNations = [];
    this.swissBanksWhoDoNotInterrupt = [];
  }

  tick(action) {
    this.setOldState(action);
    // Initialize and endGame actions are always valid.
    if (action.type === "initialize") {
      this.log.push(action);
      this.annotatedLog.push(action);
      this.initialize(action);
      return;
    } else if (action.type === "endGame") {
      this.log.push(action);
      this.annotatedLog.push(action);
      this.endGame();
      return;
    }

    // Check if the requested action is invalid.
    let validAction = false;
    for (const availableAction of this.availableActionsWithUndo()) {
      if (this.isEqual(availableAction, action)) {
        validAction = true;
      }
    }

    if (!validAction) { return; }

    this.log.push(action);
    this.annotatedLog.push(action);

    switch (action.type) {
      case "noop":
        return;
      case "undo": {
        Object.assign(this, this.oldState);
        return;
      }
      case "bondPurchase": {
        if (this.auction?.inAuction) {
          this.auction.tick(action, this);
        } else {
          this.bondPurchase(action);
        }
        return;
      }
      case "skipBondPurchase": {
        if (this.auction?.inAuction) {
          this.auction.tick(action, this);
        } else {
          this.skipBondPurchase(action);
        }
        return;
      }
      case "endManeuver": {
        this.endManeuver();
        return;
      }
      case "fight": {
        this.fight(action);
        return;
      }
      case "coexist": {
        this.coexist(action);
        return;
      }
      case "unfriendlyEntrance": {
        this.unfriendlyEntrance(action);
        return;
      }
      case "friendlyEntrance": {
        this.friendlyEntrance(action);
        return;
      }
      case "forceInvestor": {
        this.swissBanksWhoDoNotInterrupt = [];
        this.passingThroughInvestor = false;
        this.nations.get(this.currentNation).rondelPosition = "investor";
        const investorAction = Action.rondel({
          slot: "investor",
          nation: this.currentNation,
          cost: 0
        });
        this.currentPlayerName = this.nations.get(this.currentNation).controller;
        this.investor(investorAction);
        return;
      }
      case "skipForceInvestor": {
        this.swissBanksWhoDoNotInterrupt.push(this.currentPlayerName);
        // All Swiss Banks have allowed the move past Investor
        if (this.swissBanksWhoDoNotInterrupt.length === this.swissBanks.length) {
          const reversedLog = this.log.slice().reverse();
          const lastRondelAction = reversedLog.find((action) => {
            return action.type === "rondel"
          });
          this.currentPlayerName = this.nations.get(lastRondelAction.payload.nation).controller;
          this.availableActions = new Set([lastRondelAction]);
          this.tick(lastRondelAction);
          return;
        // More Swiss Banks need to be given the option to force Investor
        } else {
          this.allowSwissBanksToForceInvestor();
        }
        return;
      }
      case "buildFactory": {
        this.buildFactory(action);
        return;
      }
      case "destroyFactory": {
        this.destroyFactory(action);
        return;
      }
      case "skipDestroyFactory": {
        this.skipDestroyFactory(action);
        return;
      }
      case "import": {
        this.import(action);
        return;
      }
      case "maneuver": {
        this.maneuver(action);
        return;
      }
      case "rondel": {
        this.previousPlayerName = this.currentPlayerName;
        this.rondel(action);
        return;
      }
    }
  }

  setOldState(action) {
    // Undo rewinds the state until the last rondel action or
    // bond purchase/skipped bond purchase
    if (action.type === "rondel" || action.type === "bondPurchase" || action.type === "skipBondPurchase") {
      const oldState = setOldState(this);
      this.oldState = Object.assign({}, this, oldState);
    }
  }

  initialize(action) {
    let setup;
    this.variant = action.payload.variant;
    if (action.payload.variant === "standard") {
      setup = standardSetup;
    } else {
      this.auction = Auction.fromLog(this.log, this);
      setup = auctionSetup;
    }
    const s = setup({
      players: action.payload.players,
      provinceNames: Array.from(this.board.graph.keys())
    });
    this.availableBonds = s.availableBonds;
    this.currentNation = s.currentNation;
    this.investorCardHolder = s.investorCardHolder;
    this.nations = s.nations;
    this.order = s.order;
    this.players = s.players;
    this.provinces = s.provinces;
    this.unitLimits = s.unitLimits;
    this.units = this.initializeUnits(s.units);
    this.currentPlayerName = this.getStartingPlayer();
    this.previousPlayerName = this.currentPlayerName;
    if (this.variant === "standard") {
      this.availableActions = new Set(this.rondelActions(this.currentNation));
    }
    this.soloMode = action.payload.soloMode;
  }

  getStartingPlayer() {
    if (this.variant === "standard") {
      return this.nations.get(this.currentNation).controller;
    } else {
      return this.order[0];
    }
  }

  bondPurchase(action) {
    const uncost = {
      2: 1,
      4: 2,
      6: 3,
      9: 4,
      12: 5,
      16: 6,
      20: 7,
      25: 8,
      30: 9
    };
    const bonds = this.players[action.payload.player].bonds;
    if (action.payload.cost > this.players[action.payload.player].cash) {
      const tradeableBonds = [...bonds]
        .filter(({ nation }) => nation === action.payload.nation)
        .map(({ cost }) => cost);
      const tradeIn = Math.max(...tradeableBonds);
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
      this.annotatedLog.push(Action.playerTradedInForABond({
        player: action.payload.player,
        bondNation: action.payload.nation,
        bondCost: bondToTrade.cost
      }));
    } else {
      this.nations.get(action.payload.nation).treasury += action.payload.cost;
      this.players[action.payload.player].cash -= action.payload.cost;
    }

    const newBond = Bond(action.payload.nation, uncost[action.payload.cost]);
    if (!this.availableBonds.has(newBond)) {
      throw new Error(`${newBond} not available`);
    }
    this.players[action.payload.player].bonds.add(newBond);
    this.availableBonds.delete(newBond);

    if (this.nations.get(action.payload.nation).controller === null) {
      this.nations.get(action.payload.nation).controller =
        action.payload.player;
    }

    if (
      this.totalInvestmentInNation(
        action.payload.player,
        action.payload.nation
      ) >
      this.totalInvestmentInNation(
        this.nations.get(action.payload.nation).controller,
        action.payload.nation
      )
    ) {
      this.nations.get(action.payload.nation).controller =
        action.payload.player;
    }
    this.investorCardActive = false;

    this.updateRawScores();
    
    if (this.investing) {
      this.previousPlayerName = this.currentPlayerName;
      const nextNation = this.currentNation.when({
        AH: () => Nation.IT,
        IT: () => Nation.FR,
        FR: () => Nation.GB,
        GB: () => Nation.GE,
        GE: () => Nation.RU,
        RU: () => Nation.AH
      });
      const index = this.order.indexOf(this.currentPlayerName);
      if (index === this.order.length - 1) {
        this.currentPlayerName = this.order[0];
      } else {
        this.currentPlayerName = this.order[index + 1];
      }
      if (this.currentPlayerName !== this.firstInvestor) {
        this.availableActions = availableBondPurchases(this.currentNation, this);
        // If there is one available action, it is the pass action and doesn't
        // count as a real action.
        while (this.availableActions.size <= 1 && this.investing) {
          if (this.currentPlayerName === this.firstInvestor) {
            this.investing = false;
            for (const player in this.players) {
              this.checkForSwissBank(player);
            }
            this.handleAdvancePlayer();
            this.advanceInvestorCard();
            this.availableActions = new Set(this.rondelActions(this.currentNation));

            return;
          }
          this.annotatedLog.push(
            Action.playerAutoSkipsBondPurchase({
              player: this.currentPlayerName,
              bondNation: this.currentNation
            })
          );
          this.previousPlayerName = this.currentPlayerName;
          const currentPlayerIndex = this.order.indexOf(this.currentPlayerName);
          this.currentPlayerName = this.order[currentPlayerIndex + 1] || this.order[0];
          if (this.currentPlayerName !== this.firstInvestor) {
            if (this.swissBanks.includes(this.currentPlayerName)) {
              this.availableActions = this.bondPurchasesFromAllNations();
            } else {
              this.availableActions = availableBondPurchases(this.currentNation, this);
            }
          }
        }
        return;
      } else if (!this.nations.get(nextNation).controller) {
        this.currentNation = nextNation;
        this.roundOfInvestment();
        return;
      }
      this.investing = false;
    }

    let swissBanksToInvest = this.swissBanks;
    if (
      swissBanksToInvest.length > 0 &&
      swissBanksToInvest.some(bank => this.hasNotBoughtABondThisTurn(bank) === true)
      ) {
      for (const player of swissBanksToInvest) {
        if (
          player !== this.investorCardHolder &&
          this.hasNotBoughtABondThisTurn(player)
        ) {
          this.endOfInvestorTurn(player);
        }
      }
    } else {
      for (const player in this.players) {
        this.checkForSwissBank(player);
      }
      this.handleAdvancePlayer();
      this.advanceInvestorCard();
      this.availableActions = new Set(this.rondelActions(this.currentNation));
    }
  }

  checkForSwissBank(player) {
    if (this.nationsUnderControl(player).length > 0) {
      const playerIndex = this.swissBanks.indexOf(player);
      if (playerIndex !== -1) {
        this.swissBanks.splice(playerIndex, 1)
      }
    } else {
      const playerIndex = this.swissBanks.indexOf(player);
      if (playerIndex === -1) {
        this.swissBanks.push(player);
      }
    }
  }

  skipBondPurchase(action) {
    if (this.investing) {
      this.previousPlayerName = this.currentPlayerName;
      const nextNation = this.currentNation.when({
        AH: () => Nation.IT,
        IT: () => Nation.FR,
        FR: () => Nation.GB,
        GB: () => Nation.GE,
        GE: () => Nation.RU,
        RU: () => Nation.AH
      });
      const index = this.order.indexOf(this.currentPlayerName);
      if (index === this.order.length - 1) {
        this.currentPlayerName = this.order[0];
      } else {
        this.currentPlayerName = this.order[index + 1];
      }
      if (this.currentPlayerName !== this.firstInvestor) {
        if (this.swissBanks.includes(this.currentPlayerName)) {
          this.availableActions = this.bondPurchasesFromAllNations();
        } else {
          this.availableActions = availableBondPurchases(this.currentNation, this);
        }
        // If there is one available action, it is the pass action and doesn't
        // count as a real action.
        while (this.availableActions.size <= 1 && this.investing) {
          this.annotatedLog.push(
            Action.playerAutoSkipsBondPurchase({
              player: this.currentPlayerName,
              bondNation: this.currentNation
            })
          );
          this.previousPlayerName = this.currentPlayerName;
          const currentPlayerIndex = this.order.indexOf(this.currentPlayerName);
          this.currentPlayerName = this.order[currentPlayerIndex + 1] || this.order[0];
          if (this.currentPlayerName === this.firstInvestor) {
            this.investing = false;
            for (const player in this.players) {
              this.checkForSwissBank(player);
            }
            this.handleAdvancePlayer();
            this.advanceInvestorCard();
            this.availableActions = new Set(this.rondelActions(this.currentNation));

            return;
          }
          if (this.swissBanks.includes(this.currentPlayerName)) {
            this.availableActions = this.bondPurchasesFromAllNations();
          } else {
            this.availableActions = availableBondPurchases(this.currentNation, this);
          }
        }
        return;
      } else if (!this.nations.get(nextNation).controller) {
        this.currentNation = nextNation;
        this.roundOfInvestment();
        return;
      }
      this.investing = false;
    }
    let swissBanksToInvest = this.swissBanks;
    if (
      this.variant !== "withoutInvestorCard" &&
      swissBanksToInvest.length > 0 &&
      swissBanksToInvest.some(bank => this.hasNotBoughtABondThisTurn(bank) === true)
    ) {
      for (const player of swissBanksToInvest) {
        if (
          player !== this.investorCardHolder &&
          this.hasNotBoughtABondThisTurn(player)
        ) {
          this.endOfInvestorTurn(player);
        }
      }
    } else {
      for (const player in this.players) {
        this.checkForSwissBank(player);
      }
      this.handleAdvancePlayer();
      this.advanceInvestorCard();
      this.availableActions = new Set(this.rondelActions(this.currentNation));
    }
  }

  endManeuver() {
    this.unitsToMove = [];
    this.fleetConvoyCount = {};
    this.maneuvering = false;
    if (this.variant === "withoutInvestorCard") {
      this.roundOfInvestment();
    } else {
      this.handleAdvancePlayer();
      this.availableActions = new Set(this.rondelActions(this.currentNation));
    }
  }

  endGame() {
    const scores = {};
    Object.keys(this.players).forEach(player => {
      let score = this.players[player].rawScore;
      score += this.players[player].cash;
      scores[player] = score;
    });
    const winningScore = Math.max(...Object.keys(scores).map(x => scores[x]));
    const winners = Object.keys(scores).filter(
      x => scores[x] === winningScore
    );
    if (winners.length === 1) {
      this.winner = winners[0]
    } else {
      let winningNation = {}
      for (const [nation, data] of this.nations) {
        if (data.powerPoints === 25) {
          winningNation = nation;
        }
      }
      this.winner = "";
      winners.forEach((winner) => {
        if (
          this.totalInvestmentInNation(winner, winningNation) >
          this.totalInvestmentInNation(this.winner, winningNation)
        ) {
          this.winner = winner
        }
      });
    }
    this.availableActions = new Set();
  }

  fight(action) {
    this.coexistingNations = [];
    this.currentNationInConflict = null;
    const province = action.payload.province;
    const incumbentUnitsAtProvince = this.units
      .get(action.payload.incumbent)
      .get(province);
    const challengerUnitsAtProvince = this.units
      .get(action.payload.challenger)
      .get(province);

    // Remove units from this.unitsToMove in case they could have moved
    let unitIndex = null;
    this.unitsToMove.forEach(([unitProvince, _], index) => {
      if (unitProvince === province) {
        unitIndex = index;
      }
    });
    if (unitIndex !== null) {
      this.unitsToMove.splice(unitIndex, 1);
      // Remove it from available actions
      for (const action of this.availableActions) {
        if (action.payload?.origin === province || action.payload?.province === province) {
          this.availableActions.delete(action)
        }
      }
    }

    // Remove units at the fight
    while (
      (incumbentUnitsAtProvince.fleets > 0 || incumbentUnitsAtProvince.armies > 0) &&
      (challengerUnitsAtProvince.fleets > 0 || challengerUnitsAtProvince.armies > 0)
    ) {
      if (action.payload.targetType === "army") {
        incumbentUnitsAtProvince.armies -= 1;
        if (challengerUnitsAtProvince.armies > 0) {
          challengerUnitsAtProvince.armies -= 1;
        } else {
          challengerUnitsAtProvince.fleets -= 1;
        }
      } else {
        incumbentUnitsAtProvince.fleets -= 1;
        if (challengerUnitsAtProvince.armies > 0) {
          challengerUnitsAtProvince.armies -= 1;
        } else {
          challengerUnitsAtProvince.fleets -= 1;
        }
      }
    }

    // Remove destroyed units from this.availableActions
    const fleetsAtProvince = this.units.get(this.currentNation).get(province).fleets;
    const armiesAtProvince = this.units.get(this.currentNation).get(province).armies;
    if (fleetsAtProvince === 0 && armiesAtProvince === 0) {
      let coexistAction = {};
      let fightAction = {};
      for (const action of this.availableActions) {
        if (action.type === "coexist" && action.payload.province === province) {
          coexistAction = action
        } else if (action.type === "fight" && action.payload.province === province) {
          fightAction = action
        }
      }
      this.availableActions.delete(coexistAction)
      this.availableActions.delete(fightAction)
    }

    const totalIncumbentUnitsAtProvince =
      incumbentUnitsAtProvince.armies + incumbentUnitsAtProvince.fleets;
    const totalChallengerUnitsAtProvince =
      challengerUnitsAtProvince.armies + challengerUnitsAtProvince.fleets;

    let isNeutralProvince = true;
    for (const [nation, provinces] of this.board.byNation) {
      if (provinces.has(province) && !!nation) {
        isNeutralProvince = false;
      }
    }

    // Change flags, if challenger wins and province is not a home province
    if (
      totalChallengerUnitsAtProvince > totalIncumbentUnitsAtProvince &&
      isNeutralProvince
    ) {
      this.provinces.get(province).flag = action.payload.challenger;
    }

    this.handlingConflict = false;
    this.previousPlayerName = this.currentPlayerName;
    this.currentPlayerName = this.nations.get(action.payload.challenger).controller;
    if (this.unitsToMove.length === 0) {
      this.unitsToMove = [];
      this.maneuvering = false;
      if (this.variant === "withoutInvestorCard") {
        this.roundOfInvestment();
      } else {
        this.handleAdvancePlayer();
        this.availableActions = new Set(this.rondelActions(this.currentNation));
      }
    } else {
      const reversedLog = this.log.slice().reverse();
      const lastManeuverRondelAction = reversedLog.find(this.actionIsRondelAndManeuver);
      this.beginManeuver(lastManeuverRondelAction);
    }
  }

  actionIsRondelAndManeuver(action) {
    const slot = action.payload.slot;
    return action.type === "rondel" &&
      (slot === "maneuver1" || slot === "maneuver2");
  }

  coexist(action) {
    this.coexistingNations.push(action.payload.challenger);
    let nationsAtProvince = [];
    for (const [nation] of this.nations) {
      const {armies, fleets} = this.units.get(nation).get(action.payload.province);
      if ((armies > 0 || fleets > 0) && !this.coexistingNations.includes(nation)) {
        nationsAtProvince.push(nation);
      }
    }
    if (nationsAtProvince.length > 0) {
      // Coexist request can be accepted or rejected
      this.previousPlayerName = this.currentPlayerName;
      this.currentPlayerName = this.nations.get(nationsAtProvince[0]).controller;
      const destination = action.payload.province;
      this.availableActions = new Set();
      
      if (this.units.get(nationsAtProvince[0]).get(action.payload.province).armies > 0) {
        this.availableActions.add(
          Action.fight({
            province: destination,
            incumbent: this.coexistingNations[0],
            challenger: nationsAtProvince[0],
            targetType: "army"
          })
        );
      } else if (this.units.get(nationsAtProvince[0]).get(action.payload.province).fleets > 0) {
        this.availableActions.add(
          Action.fight({
            province: destination,
            incumbent: this.coexistingNations[0],
            challenger: nationsAtProvince[0],
            targetType: "fleet"
          })
        );
      }
      if (this.availableActions.size > 0) {
        this.availableActions.add(
          Action.coexist({
            province: destination,
            incumbent: action.payload.challenger,
            challenger: nationsAtProvince[0]
          })
        )
        this.handlingConflict = true;
        return;
      }
    }

    this.handlingConflict = false;
    this.coexistingNations = [];
    this.currentNationInConflict = null;
    this.previousPlayerName = this.currentPlayerName;
    this.currentPlayerName = this.nations.get(action.payload.challenger).controller;
    if (this.unitsToMove.length === 0) {
      // End of turn
      this.units.get(action.payload.challenger).get(action.payload.province).friendly = true;
      this.unitsToMove = [];
      this.maneuvering = false;
      if (this.variant === "withoutInvestorCard") {
        this.roundOfInvestment();
      } else {
        this.handleAdvancePlayer();
        this.availableActions = new Set(this.rondelActions(this.currentNation));
      }
    } else {
      // Find and maneuver other units
      const reversedLog = this.log.slice().reverse();
      const lastManeuverRondelAction = reversedLog.find(action => action.type === "rondel");
      const destinations = new Set([Action.endManeuver()]);
      const action = lastManeuverRondelAction;
      const provincesWithFleets = new Map();
      const provincesWithArmies = new Map();

      for (const [province, type] of this.unitsToMove) {
        if (type === "fleet") {
          provincesWithFleets.set(province, 1);
        } else {
          provincesWithArmies.set(province, 1);
        }
      }

      for (const [origin] of provincesWithFleets) {
        for (const destination of this.board.neighborsFor({
          origin,
          nation: action.payload.nation,
          isFleet: true,
          friendlyFleets: new Set(),
          occupiedHomeProvinces: this.occupiedHomeProvinces(this.currentNation)
        })) {
          destinations.add(
            Action.maneuver({
              origin,
              destination
            })
          );
        }
      }

      const friendlyFleets = new Set();
      for (const [province, units] of this.units.get(this.currentNation)) {
        if (units.fleets - (this.fleetConvoyCount[province] || 0) > 0) {
          friendlyFleets.add(province);
        }
      }
      for (const [origin] of provincesWithArmies) {
        for (const destination of this.board.neighborsFor({
          origin,
          nation: action.payload.nation,
          isFleet: false,
          friendlyFleets,
          occupiedHomeProvinces: this.occupiedHomeProvinces(this.currentNation)
        })) {
          destinations.add(
            Action.maneuver({
              origin,
              destination
            })
          );
        }
      }

      this.availableActions = destinations;
    }
  }

  unfriendlyEntrance(action) {
    const province = action.payload.province
    // Allow destroyFactory if 3 foreign units attack a factory
    const isOccupyingForeignFactoryWithThreeUnits =
      !!this.provinces.get(province).factory &&
        this.board.graph.get(province).nation !== this.currentNation &&
        this.units.get(this.currentNation).get(province).armies >= 3 &&
        this.log[this.log.length - 1].type !== "skipDestroyFactory";
    if (isOccupyingForeignFactoryWithThreeUnits) {
      this.availableActions = new Set([
        Action.destroyFactory({ province }),
        Action.skipDestroyFactory({ province })
      ]);
      return;
    }

    this.handlingConflict = false;
    if (this.unitsToMove.length === 0) {
      this.unitsToMove = [];
      this.maneuvering = false;
      if (this.variant === "withoutInvestorCard") {
        this.roundOfInvestment();
      } else {
        this.handleAdvancePlayer();
        this.availableActions = new Set(this.rondelActions(this.currentNation));
      }
    } else {
      const reversedLog = this.log.slice().reverse();
      const lastManeuverRondelAction = reversedLog.find(this.actionIsRondelAndManeuver);
      this.beginManeuver(lastManeuverRondelAction);
    }
  }

  friendlyEntrance(action) {
    this.handlingConflict = false;
    this.units.get(action.payload.challenger).get(action.payload.province).friendly = true;
    if (this.unitsToMove.length === 0) {
      this.unitsToMove = [];
      this.maneuvering = false;
      if (this.variant === "withoutInvestorCard") {
        this.roundOfInvestment();
      } else {
        this.handleAdvancePlayer();
        this.availableActions = new Set(this.rondelActions(this.currentNation));
      }
    } else {
      const reversedLog = this.log.slice().reverse();
      const lastManeuverRondelAction = reversedLog.find(this.actionIsRondelAndManeuver);
      this.beginManeuver(lastManeuverRondelAction);
    }
  }

  buildFactory(action) {
    this.provinces.get(action.payload.province).factory = this.board.graph.get(
      action.payload.province
    ).factoryType;
    this.nations.get(this.currentNation).treasury -= 5;
    if (this.passingThroughInvestor) {
      this.middleOfInvestorTurn();
      this.passingThroughInvestor = false;
    } else {
      if (this.variant === "withoutInvestorCard") {
        this.roundOfInvestment();
      } else {
        this.handleAdvancePlayer();
        this.availableActions = new Set(this.rondelActions(this.currentNation));
        this.buildingFactory = false;
      }
    }
  }

  destroyFactory(action) {
    this.provinces.get(action.payload.province).factory = "";
    this.units.get(this.currentNation).get(action.payload.province).armies -= 3;
    this.setManeuverAvailableActions();
  }

  skipDestroyFactory(action) {
    this.setManeuverAvailableActions();
  }

  import(action) {
    action.payload.placements.forEach(({ province, type }) => {
      const nation = this.board.graph.get(province).nation;
      if (type === "army") {
        this.units.get(nation).get(province).armies++;
      } else {
        this.units.get(nation).get(province).fleets++;
      }
      this.nations.get(nation).treasury--;
    });
    this.importing = false;

    if (this.passingThroughInvestor) {
      this.middleOfInvestorTurn();
      this.passingThroughInvestor = false;
    } else {
      if (this.variant === "withoutInvestorCard") {
        this.roundOfInvestment();
      } else {
        this.handleAdvancePlayer();
        this.availableActions = new Set(this.rondelActions(this.currentNation));
      }
    }
  }

  maneuver(action) {
    const origin = action.payload.origin;
    const destination = action.payload.destination;
    const unitType = this.board.graph.get(destination).isOcean
      ? "fleet"
      : "army";

    // Execute the unit movement
    if (unitType === "fleet") {
      this.units.get(this.currentNation).get(origin).fleets--;
      this.units.get(this.currentNation).get(destination).fleets++;
    }
    if (unitType === "army") {
      const friendlyFleets = new Set();
      for (const [province, units] of this.units.get(this.currentNation)) {
        if (units.fleets - (this.fleetConvoyCount[province] || 0) > 0) {
          friendlyFleets.add(province);
        }
      }
      const paths = this.board.pathsFrom({ origin, nation: this.currentNation, isFleet: false, friendlyFleets, isOccupied: false }, [origin]);
      const validPaths = paths.filter(path => path[path.length - 1] === destination) || [];
      const ourPath = validPaths.sort((pathA, pathB) => {
        return pathA.filter(province => this.board.graph.get(province).isOcean).length -
          pathB.filter(province => this.board.graph.get(province).isOcean).length
      })[0];
      const usedFleets = ourPath.filter(province => this.board.graph.get(province).isOcean);
      for (const province of usedFleets) {
        this.fleetConvoyCount[province] = (this.fleetConvoyCount[province] || 0) + 1
      }

      this.units.get(this.currentNation).get(origin).armies--;
      this.units.get(this.currentNation).get(destination).armies++;

      // Fleets cannot move after armies!
      this.unitsToMove = this.unitsToMove.filter(([, type]) => type === "army");
    }

    // Remove the unit that just moved from this.unitsToMove
    const i = this.unitsToMove.findIndex(
      arr => arr[0] === action.payload.origin && arr[1] === unitType
    );
    this.unitsToMove.splice(i, 1);

    // Interrupt manuevers in case of potential conflict!
    this.availableActions = new Set();
    let incumbent = null;
    for (const [nation] of this.nations) {
      if (nation !== this.currentNation) {
        const units = this.units.get(nation).get(destination);
        if (units.armies > 0 || units.fleets > 0) {
          if (units.armies > 0) {
            if (!incumbent) {
              incumbent = nation;
            }
            this.availableActions.add(
              Action.fight({
                province: destination,
                incumbent: nation,
                challenger: this.currentNation,
                targetType: "army"
              })
            );
          }
          if (units.fleets > 0) {
            if (!incumbent) {
              incumbent = nation;
            }
            this.availableActions.add(
              Action.fight({
                province: destination,
                incumbent: nation,
                challenger: this.currentNation,
                targetType: "fleet"
              }),
            );
          }
        }
      }
    }
    if (this.availableActions.size > 0) {
      this.availableActions.add(
        Action.coexist({
          province: destination,
          incumbent,
          challenger: this.currentNation
        })
      )
      this.handlingConflict = true;
      return;
    }

    // Interrupt maneuvers when entering another nation's home province!
    for (const [nation] of this.nations) {
      if (
        nation !== this.currentNation &&
        this.board.byNation.get(nation)?.has(destination)
      ) {
        this.availableActions = new Set();
        this.availableActions.add(
          Action.unfriendlyEntrance({
            incumbent: nation,
            challenger: this.currentNation,
            province: destination
          }),
        );
        this.availableActions.add(
          Action.friendlyEntrance({
            incumbent: nation,
            challenger: this.currentNation,
            province: destination
          })
        )
        this.handlingConflict = true;
        return;
      }
    }

    // Allow destroyFactory if 3 foreign units attack a factory
    const isOccupyingForeignFactoryWithThreeUnits =
      !!this.provinces.get(destination).factory &&
        this.board.graph.get(destination).nation !== this.currentNation &&
        this.units.get(this.currentNation).get(destination).armies >= 3 &&
        this.log[this.log.length - 1].type !== "skipDestroyFactory";
    if (isOccupyingForeignFactoryWithThreeUnits) {
      this.availableActions = new Set([
        Action.destroyFactory({ province: destination }),
        Action.skipDestroyFactory({ province: destination })
      ]);
      return;
    }

    // Don't update the province flag if the province is a home province of a nation.
    let plantFlag = true;
    for (const [nation, provinces] of this.board.byNation) {
      if (provinces.has(destination) && !!nation) {
        plantFlag = false;
      }
    }
    if (plantFlag === true) {
      // Update province flag
      this.provinces.get(destination).flag = this.currentNation;
    }

    // Update origin flag if a different nation remains in the origin
    const nationHadAFlagAtOrigin = this.provinces.get(origin).flag === this.currentNation;
    const armiesAtOrigin = this.units.get(this.currentNation).get(origin).armies;
    const fleetsAtOrigin = this.units.get(this.currentNation).get(origin).fleets;
    if (nationHadAFlagAtOrigin && armiesAtOrigin === 0 && fleetsAtOrigin === 0) {
      const otherNationsOccupying = [];
      for (const [nation] of this.nations) {
        const nationsArmies = this.units.get(nation).get(origin).armies;
        const nationsFleets = this.units.get(nation).get(origin).fleets;
        if (nationsArmies > 0 || nationsFleets > 0) {
          otherNationsOccupying.push(nation);
        }
      }
      // If multiple other nations occupy, then flag remains with the original flag-holder
      if (otherNationsOccupying.length === 1) {
        this.provinces.get(origin).flag = otherNationsOccupying[0];
      }
    }

    this.setManeuverAvailableActions();
  }

  setManeuverAvailableActions() {
    if (this.unitsToMove.length > 0) {
      this.availableActions = new Set();
      this.checkForNewFights();
      const provincesWithFleets = new Map();
      const provincesWithArmies = new Map();
      this.availableActions.add(Action.endManeuver());
      this.unitsToMove.forEach(([origin, type]) => {
        const units = this.units.get(this.currentNation).get(origin);
        if (units.fleets > 0 && type === "fleet") {
          provincesWithFleets.set(origin, units.fleets);
        } else if (units.armies > 0) {
          provincesWithArmies.set(origin, units.armies);
        }
        for (const [origin] of provincesWithFleets) {
          for (const destination of this.board.neighborsFor({
            origin,
            nation: this.currentNation,
            isFleet: true,
            friendlyFleets: new Set(),
            occupiedHomeProvinces: this.occupiedHomeProvinces(this.currentNation)
          })) {
            this.availableActions.add(Action.maneuver({ origin, destination }));
          }
        }
        const friendlyFleets = new Set();
        for (const [province, units] of this.units.get(this.currentNation)) {
          if (units.fleets - (this.fleetConvoyCount[province] || 0) > 0) {
            friendlyFleets.add(province);
          }
        }
        for (const [origin] of provincesWithArmies) {
          for (const destination of this.board.neighborsFor({
            origin,
            nation: this.currentNation,
            isFleet: false,
            friendlyFleets,
            occupiedHomeProvinces: this.occupiedHomeProvinces(this.currentNation)
          })) {
            this.availableActions.add(Action.maneuver({ origin, destination }));
          }
        }
      });
    } else {
      // No more units may be maneuvered on this turn.
      this.maneuvering = false;
      this.fleetConvoyCount = {};
      if (this.passingThroughInvestor) {
        this.middleOfInvestorTurn();
        this.passingThroughInvestor = false;
      } else {
        if (this.variant === "withoutInvestorCard") {
          this.roundOfInvestment();
        } else {
          this.handleAdvancePlayer();
          this.availableActions = new Set(this.rondelActions(this.currentNation));
        }
      }
    }
  }

  rondel(action) {
    this.currentNation = action.payload.nation;
    const currentNation = this.nations.get(this.currentNation);
    if (this.passedThroughInvestor(currentNation.rondelPosition, action.payload.slot) && this.passingThroughInvestor === false) {
      this.passingThroughInvestor = true;
      // Allow Swiss Bank holders to interrupt
      this.swissBanksWhoDoNotInterrupt = [];
      if (this.canAffordToPayInvestors(this.currentNation)) {
        this.allowSwissBanksToForceInvestor();
        if (this.availableActions.size > 0) {
          return;
        }
      }
    }
    currentNation.previousRondelPosition = currentNation.rondelPosition;
    currentNation.rondelPosition = action.payload.slot;
    this.players[this.currentPlayerName].cash -= action.payload.cost;
    if (action.payload.cost > 0) {
      this.annotatedLog.push(Action.playerPaysForRondel({
        player: this.currentPlayerName,
        cost: action.payload.cost,
        slot: action.payload.slot
      }));
    }

    switch (action.payload.slot) {
      case "investor": {
        this.investor(action);
        return;
      }
      case "import": {
        this.importRondel(action);
        return;
      }
      case "production1":
      case "production2": {
        const nation = action.payload.nation;
        Array.from(this.board.byNation.get(nation))
          .filter(province => this.provinces.get(province).factory !== null)
          .forEach(province => {
            const units = this.units.get(nation).get(province);
            if (this.nobodyIsOccupying(province, nation)) {
              if (this.provinces.get(province).factory === "shipyard" &&
                  !this.overUnitLimit(action.payload.nation, "fleet", 1)
              ) {
                units.fleets++;
              } else if (this.provinces.get(province).factory !== "shipyard" &&
                        !this.overUnitLimit(action.payload.nation, "army", 1)
              ) {
                units.armies++;
              }
            }
          });
        if (this.passingThroughInvestor) {
          this.middleOfInvestorTurn();
          this.passingThroughInvestor = false;
          return;
        }
        if (this.variant === "withoutInvestorCard") {
          this.roundOfInvestment();
        } else {
          this.handleAdvancePlayer();
          this.availableActions = new Set(this.rondelActions(this.currentNation));
        }
        return;
      }
      case "taxation": {
        const nationName = action.payload.nation;
        const nation = this.nations.get(nationName);
        // 1. Tax revenue / success bonus
        let taxes =
          this.unoccupiedFactoryCount(nationName) * 2 +
          this.flagCount(nationName);
        // Taxes cannot exceed 20m
        if (taxes > 20) taxes = 20;
        let excessTaxes = taxes - nation.taxChartPosition;
        // Players can never lose money here and
        // nations cannot descend in taxChartPosition
        if (excessTaxes < 0) {
          excessTaxes = 0;
        }
        // Player receives full excess taxes
        this.players[this.currentPlayerName].cash += excessTaxes;
        this.annotatedLog.push(Action.playerGainsCash({
          player: this.currentPlayerName,
          amount: excessTaxes
        }));
        // Nation's taxChartPosition matches taxes but cannot fall
        if (taxes > nation.taxChartPosition) {
          nation.taxChartPosition = taxes;
        }
        // The tax chart maxes out at 15
        if (nation.taxChartPosition > 15) nation.taxChartPosition = 15;
        // 2. Collecting money
        let payment = taxes - this.unitCount(nationName);
        // Nations cannot be paid less than 0m
        if (payment < 0) payment = 0;
        nation.treasury += payment;
        this.annotatedLog.push(Action.nationGainsTreasury({
          nation: nationName,
          amount: payment
        }));
        // 3. Adding power points
        let powerPoints = taxes - 5;
        if (powerPoints < 0) powerPoints = 0;
        nation.powerPoints += powerPoints;

        if (nation.powerPoints >= 25) {
          nation.powerPoints = 25;
          this.updateRawScores();

          this.tick(Action.endGame());
          return;
        }

        this.annotatedLog.push(Action.nationGainsPowerPoints({
          nation: nationName,
          powerPoints
        }));

        if (this.passingThroughInvestor) {
          this.middleOfInvestorTurn();
          this.passingThroughInvestor = false;
        } else {
          if (this.variant === "withoutInvestorCard") {
            this.roundOfInvestment();
          } else {
            this.handleAdvancePlayer();
            this.availableActions = new Set(
              this.rondelActions(this.currentNation)
            );
          }
        }
        this.updateRawScores();
        return;
      }
      case "maneuver1":
      case "maneuver2": {
        this.availableActions = new Set([Action.endManeuver()]);
        this.maneuvering = true;
        this.collectUnitsToMove(action);
        this.checkForNewFights();
        this.beginManeuver(action);
        return;
      }
      case "factory": {
        // If nation cannot afford to build a factory
        if (this.nations.get(this.currentNation).treasury < 5) {
          if (this.variant === "withoutInvestorCard") {
            this.roundOfInvestment();
          } else {
            this.handleAdvancePlayer();
            return;
          }
        }

        this.availableActions = new Set();
        for (const province of this.board.byNation.get(action.payload.nation)) {
          if (
            !this.provinces.get(province).factory &&
            this.nobodyIsOccupying(province, this.currentNation)
          ) {
            this.availableActions.add(Action.buildFactory({ province }));
          }
        }
        this.buildingFactory = true;

        return;
      }
    }
  }

  investor(action) {
    const nation = action.payload.nation;
    // 1. Nation pays bond-holders interest
    for (const player of Object.keys(this.players)) {
      if (player !== this.currentPlayerName) {
        this.playerBondsOfNation(player, nation).forEach(
          bond => {
            let payment = bond.number;
            if (this.nations.get(nation).treasury >= payment) {
              this.nations.get(nation).treasury -= payment;
            } else if (this.players[this.currentPlayerName].cash >= payment) {
              this.players[this.currentPlayerName].cash -= payment;
            } else {
              payment = this.players[this.currentPlayerName].cash;
              this.players[this.currentPlayerName].cash = 0;
            }
            this.players[player].cash += payment;
          }
        );
      }
    }
    // Nation pays its controller interest
    const amountOwedToController = [
      ...this.players[this.currentPlayerName].bonds
    ]
      .filter(bond => bond.nation === nation)
      .reduce((x, y) => x + y.number, 0);
    if (this.nations.get(nation).treasury > amountOwedToController) {
      this.players[this.currentPlayerName].cash += amountOwedToController;
      this.nations.get(nation).treasury -= amountOwedToController;
    } else {
      const payment = this.nations.get(nation).treasury;
      this.players[this.currentPlayerName].cash += payment;
      this.nations.get(nation).treasury -= payment;
    }
    if (this.variant === "withoutInvestorCard") {
      this.roundOfInvestment();
    } else {
      this.investorCardActive = true;
      this.middleOfInvestorTurn();
      this.passingThroughInvestor = false;
    }
  }

  importRondel(action) {
    const availableActions = new Set([Action.import({ placements: [] })]);
    const homeProvinces = this.board.byNation.get(action.payload.nation);
    const unoccupiedHomeProvinces = [...homeProvinces].filter(province => {
      let unoccupied = true;
      for (const [nation] of this.nations) {
        if (nation !== action.payload.nation && this.units.get(nation).get(province).armies > 0) {
          unoccupied = false
        }
      }
      return unoccupied;
    });
    const treasury = this.nations.get(action.payload.nation).treasury;
    if (treasury < 3) {
      this.maxImports = treasury;
    } else {
      this.maxImports = 3;
    }

    for (const province of unoccupiedHomeProvinces) {
      if (treasury >= 1) {
        if (!this.overUnitLimit(action.payload.nation, "army", 1)) {
          availableActions.add(
            Action.import({ placements: [{ province, type: "army" }] })
          );
        };
        if (this.board.graph.get(province).factoryType === "shipyard" &&
            !this.overUnitLimit(action.payload.nation, "fleet", 1)
        ) {
          availableActions.add(
            Action.import({ placements: [{ province, type: "fleet" }] })
          );
        }
      }

      for (const province2 of unoccupiedHomeProvinces) {
        if (treasury >= 2) {
          if (!this.overUnitLimit(action.payload.nation, "army", 2)) {
          availableActions.add(
            Action.import({
              placements: [
                { province, type: "army" },
                { province: province2, type: "army" }
              ]
            })
          )};
          if (this.board.graph.get(province).factoryType === "shipyard" && 
              !this.overUnitLimit(action.payload.nation, "fleet", 1) &&
              !this.overUnitLimit(action.payload.nation, "army", 1)
          ) {
            availableActions.add(
              Action.import({
                placements: [
                  { province, type: "fleet" },
                  { province: province2, type: "army" }
                ]
              })
            );
          }
          if (this.board.graph.get(province2).factoryType === "shipyard" &&
              !this.overUnitLimit(action.payload.nation, "fleet", 1) &&
              !this.overUnitLimit(action.payload.nation, "army", 1)
          ) {
            availableActions.add(
              Action.import({
                placements: [
                  { province, type: "army" },
                  { province: province2, type: "fleet" }
                ]
              })
            );
          }
          if (
            this.board.graph.get(province).factoryType === "shipyard" &&
            this.board.graph.get(province2).factoryType === "shipyard" &&
            !this.overUnitLimit(action.payload.nation, "fleet", 2)
          ) {
            availableActions.add(
              Action.import(
                { placements: [{ province, type: "fleet" }] },
                { province: province2, type: "fleet" }
              )
            );
          }
        }

        for (const province3 of unoccupiedHomeProvinces) {
          if (treasury >= 3) {
            if (!this.overUnitLimit(action.payload.nation, "army", 3)) {
            availableActions.add(
              Action.import({
                placements: [
                  { province, type: "army" },
                  { province: province2, type: "army" },
                  { province: province3, type: "army" }
                ]
              })
            )};
            if (this.board.graph.get(province).factoryType === "shipyard" &&
                !this.overUnitLimit(action.payload.nation, "fleet", 1) &&
                !this.overUnitLimit(action.payload.nation, "army", 2)
            ) {
              availableActions.add(
                Action.import({
                  placements: [
                    { province, type: "fleet" },
                    { province: province2, type: "army" },
                    { province: province3, type: "army" }
                  ]
                })
              );
            }
            if (this.board.graph.get(province2).factoryType === "shipyard" &&
                !this.overUnitLimit(action.payload.nation, "fleet", 1) &&
                !this.overUnitLimit(action.payload.nation, "army", 2)
            ) {
              availableActions.add(
                Action.import({
                  placements: [
                    { province, type: "army" },
                    { province: province2, type: "fleet" },
                    { province: province3, type: "army" }
                  ]
                })
              );
            }
            if (this.board.graph.get(province3).factoryType === "shipyard" &&
                !this.overUnitLimit(action.payload.nation, "fleet", 1) &&
                !this.overUnitLimit(action.payload.nation, "army", 2)
            ) {
              availableActions.add(
                Action.import({
                  placements: [
                    { province, type: "army" },
                    { province: province2, type: "army" },
                    { province: province3, type: "fleet" }
                  ]
                })
              );
            }
            if (
              this.board.graph.get(province).factoryType === "shipyard" &&
              this.board.graph.get(province2).factoryType === "shipyard" &&
              !this.overUnitLimit(action.payload.nation, "fleet", 2) &&
              !this.overUnitLimit(action.payload.nation, "army", 1)
            ) {
              availableActions.add(
                Action.import({
                  placements: [
                    { province, type: "fleet" },
                    { province: province2, type: "fleet" },
                    { province: province3, type: "army" }
                  ]
                })
              );
            }
            if (
              this.board.graph.get(province).factoryType === "shipyard" &&
              this.board.graph.get(province3).factoryType === "shipyard" &&
              !this.overUnitLimit(action.payload.nation, "fleet", 2) &&
              !this.overUnitLimit(action.payload.nation, "army", 1)
            ) {
              availableActions.add(
                Action.import({
                  placements: [
                    { province, type: "fleet" },
                    { province: province2, type: "army" },
                    { province: province3, type: "fleet" }
                  ]
                })
              );
            }
            if (
              this.board.graph.get(province2).factoryType === "shipyard" &&
              this.board.graph.get(province3).factoryType === "shipyard" &&
              !this.overUnitLimit(action.payload.nation, "fleet", 2) &&
              !this.overUnitLimit(action.payload.nation, "army", 1)
            ) {
              availableActions.add(
                Action.import({
                  placements: [
                    { province, type: "army" },
                    { province: province2, type: "fleet" },
                    { province: province3, type: "fleet" }
                  ]
                })
              );
            }
            if (
              this.board.graph.get(province).factoryType === "shipyard" &&
              this.board.graph.get(province2).factoryType === "shipyard" &&
              this.board.graph.get(province3).factoryType === "shipyard" &&
              !this.overUnitLimit(action.payload.nation, "fleet", 3)
            ) {
              availableActions.add(
                Action.import({
                  placements: [
                    { province, type: "fleet" },
                    { province: province2, type: "fleet" },
                    { province: province3, type: "fleet" }
                  ]
                })
              );
            }
          }
        }
      }
    }

    this.availableActions = availableActions;
    this.importing = true;
    return;
  }

  collectUnitsToMove(action) {
    this.unitsToMove = [];

    // Collect all units that are allowed to move on this turn
    for (const [province, units] of this.units.get(action.payload.nation)) {
      let fleetCount = units.fleets;
      let armyCount = units.armies;
      while (fleetCount > 0 || armyCount > 0) {
        if (fleetCount > 0) {
          this.unitsToMove.push([province, "fleet"]);
          fleetCount--;
        } else if (armyCount > 0) {
          this.unitsToMove.push([province, "army"]);
          armyCount--;
        }
      }
    }
  }

  checkForNewFights() {
    this.unitsToMove.forEach(([province, unitType]) => {
      for (const [nation, data] of this.nations) {
        let {armies, fleets} = this.units.get(nation).get(province);
        if ((armies > 0 || fleets > 0) && nation !== this.currentNation) {
          this.availableActions.add(Action.fight({
            province,
            incumbent: this.currentNation,
            challenger: nation,
            targetType: unitType
          }))
        }
      }
    });
  }

  beginManeuver(action) {
    this.availableActions.add(Action.endManeuver());

    this.unitsToMove.forEach(([origin, type]) => {
      if (type === "fleet") {
        for (const destination of this.board.neighborsFor({
          origin,
          nation: action.payload.nation,
          isFleet: true,
          friendlyFleets: new Set(),
          occupiedHomeProvinces: this.occupiedHomeProvinces(this.currentNation)
        })) {
          this.availableActions.add(
            Action.maneuver({
              origin,
              destination
            })
          );
        }
      } else if (type === "army") {
        const friendlyFleets = new Set();
        for (const [province, units] of this.units.get(this.currentNation)) {
          if (units.fleets - (this.fleetConvoyCount[province] || 0) > 0) {
            friendlyFleets.add(province);
          }
        }
        for (const destination of this.board.neighborsFor({
          origin,
          nation: action.payload.nation,
          isFleet: false,
          friendlyFleets,
          occupiedHomeProvinces: this.occupiedHomeProvinces(this.currentNation)
        })) {
          this.availableActions.add(
            Action.maneuver({
              origin,
              destination
            })
          );
        }
      }
    });
  }

  flagCount(nation) {
    let count = 0;
    for (const [, { flag }] of this.provinces) {
      if (flag === nation) {
        count++;
      }
    }
    return count;
  }

  middleOfInvestorTurn() {
    this.currentPlayerName = this.investorCardHolder;
    // 2. Investor card holder gets 2m cash
    this.players[this.investorCardHolder].cash += 2;
    this.annotatedLog.push(Action.playerInvests({player: this.investorCardHolder}));
    this.endOfInvestorTurn(this.investorCardHolder);
  }

  endOfInvestorTurn(investor) {
    this.currentPlayerName = investor;
    if (this.variant === "withoutInvestorCard") {
      this.availableActions = availableBondPurchases(this.currentNation, this);
      this.investing = true
      this.firstInvestor = this.currentPlayerName
    } else {
      this.availableActions = this.bondPurchasesFromAllNations();
    }
  }

  bondPurchasesFromAllNations() {
    let actions = new Set();
    for (const [nation, data] of this.nations) {
      for (const action of availableBondPurchases(nation, this)) {
        actions.add(action);
      }
    }
    for (const action of actions) {
      if (action.type === "skipBondPurchase" && action.payload.nation) {
        actions.delete(action);
      }
    }
    actions.add(
      Action.skipBondPurchase({ player: this.currentPlayerName, nation: null })
    );
    return actions;
  }

  playerBondsOfNation(player, nation) {
    const out = [];
    for (const bond of this.players[player].bonds) {
      if (bond.nation === nation) {
        out.push(bond);
      }
    }
    return out;
  }

  handleAdvancePlayer() {
    this.previousPlayerName = this.currentPlayerName;
    this.currentNation = this.nextNation(this.currentNation);
    this.currentPlayerName = this.nations.get(this.currentNation).controller;
  }

  totalInvestmentInNation(player, nation) {
    if (!this.players[player]) {
      return 0
    }

    return [...this.players[player].bonds]
      .filter(bond => bond.nation === nation)
      .reduce((x, y) => x + y.cost, 0);
  }

  advanceInvestorCard() {
    if (this.investorCardHolder) {
      const index = this.order.indexOf(this.investorCardHolder);
      if (index === 0) {
        this.investorCardHolder = this.order[this.order.length - 1];
      } else {
        this.investorCardHolder = this.order[index - 1];
      }
    }
  }

  unitCount(nation) {
    return this.armyCount(nation) + this.fleetCount(nation);
  }

  armyCount(nation) {
    let out = 0;
    for (const [, units] of this.units.get(nation)) {
      out += units.armies;
    }
    return out;
  }

  fleetCount(nation) {
    let out = 0;
    for (const [, units] of this.units.get(nation)) {
      out += units.fleets;
    }
    return out;
  }

  overUnitLimit(nation, unitType, numberOfPlacements) {
    if (unitType === "army") {
      return this.armyCount(nation) + numberOfPlacements > this.unitLimits.get(nation).armies;
    } else {
      return this.fleetCount(nation) + numberOfPlacements > this.unitLimits.get(nation).fleets;
    }
  }

  rondelActions(nation) {
    const rondelPositions = [
      "factory",
      "production1",
      "maneuver1",
      "investor",
      "import",
      "production2",
      "maneuver2",
      "taxation"
    ];
    const currentPosition = this.nations.get(nation).rondelPosition;
    const out = new Set();
    if (currentPosition) {
      const currentIndex = rondelPositions.indexOf(currentPosition);
      const distance = currentIndex - 8;
      [
        rondelPositions[currentIndex + 1] || rondelPositions[distance + 1],
        rondelPositions[currentIndex + 2] || rondelPositions[distance + 2],
        rondelPositions[currentIndex + 3] || rondelPositions[distance + 3]
      ].forEach(slot => {
        out.add(Action.rondel({ nation, cost: 0, slot }));
      });
      out.add(
        Action.rondel({
          nation,
          cost: 2,
          slot:
            rondelPositions[currentIndex + 4] || rondelPositions[distance + 4]
        })
      );
      out.add(
        Action.rondel({
          nation,
          cost: 4,
          slot:
            rondelPositions[currentIndex + 5] || rondelPositions[distance + 5]
        })
      );
      out.add(
        Action.rondel({
          nation,
          cost: 6,
          slot:
            rondelPositions[currentIndex + 6] || rondelPositions[distance + 6]
        })
      );
    } else {
      rondelPositions.forEach(slot => {
        out.add(Action.rondel({ nation, cost: 0, slot }));
      });
    }
    // Remove rondel positions that the player cannot afford.
    const cash = this.players[this.currentPlayerName].cash;
    for (const position of out) {
      if (position.payload.cost > cash) {
        out.delete(position);
      }
    }
    // Remove factory if the nation cannot afford it.
    const treasury = this.nations.get(nation).treasury;
    let factoryAction = {};
    for (const action of out) {
      if (action.payload.slot === "factory") {
        factoryAction = action;
      }
    }
    if (treasury < 5) {
      out.delete(factoryAction)
    };
    return out;
  }

  nextNation(lastTurnNation) {
    const nextNation = lastTurnNation.when({
      AH: () => Nation.IT,
      IT: () => Nation.FR,
      FR: () => Nation.GB,
      GB: () => Nation.GE,
      GE: () => Nation.RU,
      RU: () => Nation.AH
    });
    if (this.nations.get(nextNation).controller) {
      return nextNation;
    } else {
      return this.nextNation(nextNation);
    }
  }

  importAction(nation) {
    const out = new Set();
    for (const province of this.board.byNation.get(nation)) {
      if (this.board.graph.get(province).factoryType === "shipyard") {
        out.add(Action.import({ placements: [{ province, unit: "fleet" }] }));
      }
      out.add(Action.import({ placements: [{ province, unit: "army" }] }));
    }
    return out;
  }

  unoccupiedFactoryCount(nation) {
    let count = 0;
    for (const province of this.board.byNation.get(nation)) {
      const hasAnUnoccupiedFactory = (
        this.provinces.get(province).factory &&
        this.nobodyIsOccupying(province, nation)
      )
      if (hasAnUnoccupiedFactory) count++
    }
    return count;
  }

  nobodyIsOccupying(province, owningNation) {
    let provinceIsUnoccupied = true;
    for (const [occupyingNation] of this.units) {
      if (occupyingNation !== owningNation) {
        let {armies, friendly} = this.units.get(occupyingNation).get(province);
        if (armies > 0 && !friendly) {
          provinceIsUnoccupied = false;
        }
      }
    }
    return provinceIsUnoccupied;
  }

  nationsUnderControl(player) {
    let nations = [];
    for (const [nation, data] of this.nations) {
      if (data.controller === player) {
        nations.push(nation.value);
      }
    }
    return nations;
  }
  
  hasNotBoughtABondThisTurn(player) {
    let hasNotBoughtABond = true;
    const reversedLog = this.log.slice().reverse();
    for (const action of reversedLog) {
      if (action.type === "rondel") {
        break;
      } else if (action.payload && (action.payload.player === player && (action.type === "bondPurchase" || action.type === "skipBondPurchase"))) {
        hasNotBoughtABond = false
      }
    };
    return hasNotBoughtABond;
  }

  allowSwissBanksToForceInvestor() {
    this.availableActions = new Set();
    this.swissBanks.forEach(player => {
      if (!this.swissBanksWhoDoNotInterrupt.includes(player)) {
        this.currentPlayerName = player;
        this.availableActions.add(Action.forceInvestor({player}))
        this.availableActions.add(Action.skipForceInvestor({player}))
        return;
      }
    });
  }

  canAffordToPayInvestors(nation) {
    let totalOwed = 0;
    for (const player of Object.keys(this.players)) {
      this.playerBondsOfNation(player, nation).forEach(
        bond => {
          totalOwed += bond.number;
        }
      );
    }
    return totalOwed <= this.nations.get(nation).treasury;
  }

  passedThroughInvestor(from, to) {
    switch (from) {
      case "maneuver1": {
        return ["import", "production2", "maneuver2", "taxation", "factory"].includes(to);
      }
      case "production1": {
        return ["import", "production2", "maneuver2", "taxation"].includes(to);
      }
      case "factory": {
        return ["import", "production2", "maneuver2"].includes(to);
      }
      case "taxation": {
        return ["import", "production2"].includes(to);
      }
      case "maneuver2": {
        return ["import"].includes(to);
      }
    }
  }

  occupiedHomeProvinces(nation) {
    let occupiedHomeProvinces = [];
    if (!!this.board.byNation.get(nation)) {
      for (const province of this.board.byNation.get(nation)) {
        if (this.provinceIsOccupied(province, nation)) {
          occupiedHomeProvinces.push(province);
        }
      }
    }
    return occupiedHomeProvinces;
  }

  provinceIsOccupied(province, nation) {
    let isOccupied = false;
    for (const [occupyingNation,] of this.nations) {
      const units = this.units.get(occupyingNation).get(province);
      if (units.armies > 0 && occupyingNation !== nation && units.friendly === false) {
        isOccupied = true;
      }
    }
    return isOccupied;
  }

  updateRawScores() {
    Object.keys(this.players).forEach((player) => {
      let score = 0;
      for (const bond of this.players[player].bonds) {
        const powerPoints = this.nations.get(bond.nation).powerPoints;
        score += bond.number * parseInt(powerPoints / 5);
      }
      this.players[player].rawScore = score;
    });
  }

  initializeUnits(units) {
    let out = new Map();
    for (const [nation, provinces] of units) {
      for (const [province, data] of provinces) {
        if (this.board.byNation.get(nation)?.has(province)) {
          provinces.set(province, Object.assign({}, data, { friendly: true })); 
        }
      }
      out.set(nation, provinces);
    }
    return out;
  }

  availableActionsWithUndo() {
    let availableActions = new Set([...this.availableActions]);
    if (this.log.length > 1) {
      if (this.log.slice(-1)[0].type !== "undo") {
        availableActions.add(Action.undo({ player: this.previousPlayerName }));
      }
    }
    return availableActions;
  }

  roundOfInvestment() {
    this.investing = true;
    this.firstInvestor = this.currentPlayerName;
    this.availableActions = availableBondPurchases(this.currentNation, this);
    while (this.availableActions.size <= 1 && this.investing) {
      this.annotatedLog.push(
        Action.playerAutoSkipsBondPurchase({
          player: this.currentPlayerName,
          bondNation: this.currentNation
        })
      );
      this.previousPlayerName = this.currentPlayerName;
      const currentPlayerIndex = this.order.indexOf(this.currentPlayerName);
      this.currentPlayerName = this.order[currentPlayerIndex + 1] || this.order[0];
      if (this.currentPlayerName === this.firstInvestor) {
        this.investing = false;
        for (const player in this.players) {
          this.checkForSwissBank(player);
        }
        this.handleAdvancePlayer();
        this.advanceInvestorCard();
        this.availableActions = new Set(this.rondelActions(this.currentNation));

        return;
      }
      if (this.swissBanks.includes(this.currentPlayerName)) {
        this.availableActions = this.bondPurchasesFromAllNations();
      } else {
        this.availableActions = availableBondPurchases(this.currentNation, this);
      }
    }
  }

  isEqual(action1, action2) {
    if (action1.type !== action2.type) return false;
    
    if (action1.payload && action2.payload) {
      if (action1.type === "import" && action2.type === "import") {
        return this.arraysAreEqual(action1.payload.placements, action2.payload.placements);
      }

      return Object.keys(action1.payload).every(key => {
        return action1.payload[key] === action2.payload[key]
      });
    } else {
      return true;
    }
  }

  arraysAreEqual(array1, array2) {
    if (array1.length !== array2.length) return false;

    for (let i=0; i < array1.length; i++) {
      const allAttributesMatch = Object.keys(array1[i]).every(key => {
        return array1[i][key] === array2[i][key]
      });
      if (!allAttributesMatch) return false;
    }

    return true;
  }
}

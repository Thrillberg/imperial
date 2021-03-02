import { Nation, Bond } from "./constants.js";
import Action from "./action.js";
import setup from "./auctionSetup.js";

export default class Auction {
  static fromLog(log, game) {
    let auction = new Auction();
    log.forEach(entry => auction.tick(entry, game));
    return auction
  }

  constructor() {
    this.log = [];
    this.annotatedLog = [];
  }

  tick(action, game) {
    if (action.type === "initialize") {
      this.log.push(action);
      this.annotatedLog.push(action);
      this.initialize(action);
      return;
    }

    this.log.push(action);
    this.annotatedLog.push(action);

    switch (action.type) {
      case "bondPurchase": {
        this.bondPurchase(action, game);
        return;
      }
    }
  }

  initialize(action) {
    const s = setup({ players: action.payload.players, provinceNames: [] });
    this.order = s.order;
    this.players = s.players;
    this.nations = s.nations;
    this.provinces = s.provinces;
    this.units = s.units;
    this.firstPlayer = this.order[0];
    this.currentPlayerName = this.order[0];
    this.soloMode = s.soloMode;
    this.availableBonds = s.availableBonds;
    this.availableActions = this.availableBondPurchases(Nation.AH);
  }

  availableBondPurchases(nation) {
    const bonds = [...this.availableBonds].filter(bond => {
      return bond.cost <= this.players[this.currentPlayerName].cash && bond.nation === nation
    })
    return new Set(
      bonds.map(bond => {
        return Action.bondPurchase({ nation, player: this.currentPlayerName, cost: bond.cost });
      })
    );
  }

  bondPurchase(action, game) {
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
    const nations = [Nation.AH, Nation.IT, Nation.FR, Nation.GB, Nation.GE, Nation.RU];

    this.nations.get(action.payload.nation).treasury += action.payload.cost;
    this.players[action.payload.player].cash -= action.payload.cost;

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

    this.handleAdvancePlayer();
    const nationIndex = nations.indexOf(action.payload.nation);
    let nextNation = action.payload.nation;
    if (this.currentPlayerName === this.firstPlayer) {
      nextNation = nations[nationIndex + 1]

      if (!nextNation) {
        game.availableBonds = this.availableBonds;
        game.currentNation = Nation.AH;
        game.investorCardHolder = this.order[-1];
        game.nations = this.nations;
        game.order = this.order;
        game.players = this.players;
        game.provinces = this.provinces;
        game.units = game.initializeUnits(this.units);
        game.currentPlayerName = this.currentPlayerName;
        for (const player in game.players) {
          game.checkForSwissBank(player);
        }

        this.availableActions = new Set(game.rondelActions(Nation.AH));
        return;
      }
    }
    this.availableActions = this.availableBondPurchases(nextNation);
  }

  handleAdvancePlayer() {
    const currentPlayerIndex = this.order.indexOf(this.currentPlayerName);
    this.currentPlayerName = this.order[currentPlayerIndex + 1] || this.order[0];
  }

  totalInvestmentInNation(player, nation) {
    if (!this.players[player]) {
      return 0
    }

    return [...this.players[player].bonds]
      .filter(bond => bond.nation === nation)
      .reduce((x, y) => x + y.cost, 0);
  }
};

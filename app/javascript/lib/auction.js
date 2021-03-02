import { Nation, Bond } from "./constants.js";
import Action from "./action.js";
import setup from "./auctionSetup.js";

export default class Auction {
  static fromLog(log) {
    let auction = new Auction();
    log.forEach(entry => auction.tick(entry));
    return auction
  }

  constructor() {
    this.log = [];
    this.annotatedLog = [];
  }

  tick(action) {
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
        this.bondPurchase(action);
        return;
      }
    }
  }

  initialize(action) {
    const s = setup({ players: action.payload.players, provinceNames: [] });
    this.order = s.order;
    this.players = s.players;
    this.nations = s.nations;
    this.currentPlayerName = this.order[0];
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

    this.nations.get(action.payload.nation).treasury += action.payload.cost;
    this.players[action.payload.player].cash -= action.payload.cost;

    const newBond = Bond(action.payload.nation, uncost[action.payload.cost]);
    if (!this.availableBonds.has(newBond)) {
      throw new Error(`${newBond} not available`);
    }
    this.players[action.payload.player].bonds.add(newBond);
    this.availableBonds.delete(newBond);
    this.handleAdvancePlayer();
    this.availableActions = this.availableBondPurchases(action.payload.nation);
  }

  handleAdvancePlayer() {
    const currentPlayerIndex = this.order.indexOf(this.currentPlayerName);
    this.currentPlayerName = this.order[currentPlayerIndex + 1] || this.order[0];
  }
};

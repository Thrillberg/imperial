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

    }
  }

  initialize(action) {
    const s = setup({ players: action.payload.players, provinceNames: [] });
    this.order = s.order;
    this.players = s.players;
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
};

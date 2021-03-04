import { Nation, Bond } from "./constants.js";
import Action from "./action.js";
import board from "./board.js";
import setup from "./auctionSetup.js";

export default class Auction {
  static fromLog(log, game) {
    let auction = new Auction();
    log.forEach(entry => auction.tick(entry, game));
    return auction
  }

  tick(action, game) {
    if (action.type === "initialize") {
      this.initialize(action);
      return;
    }

    switch (action.type) {
      case "bondPurchase": {
        this.bondPurchase(action, game);
        return;
      }
      case "skipBondPurchase": {
        this.skipBondPurchase(action, game);
        return;
      }
    }
  }

  initialize(action) {
    const s = setup({
      players: action.payload.players,
      provinceNames: Array.from(board.graph.keys())
    });
    this.inAuction = true;
    this.order = s.order;
    this.players = s.players;
    this.nations = s.nations;
    this.provinces = s.provinces;
    this.units = s.units;
    this.firstPlayerIndex = 0;
    this.currentPlayerName = this.order[0];
    this.soloMode = s.soloMode;
    this.availableBonds = s.availableBonds;
    this.availableActions = this.availableBondPurchases(Nation.AH);
  }

  availableBondPurchases(nation) {
    let out = new Set([Action.skipBondPurchase({ player: this.currentPlayerName, nation })]);
    const bonds = [...this.availableBonds].filter(bond => {
      return bond.cost <= this.players[this.currentPlayerName].cash && bond.nation === nation
    })
    bonds.map(bond => {
      out.add(Action.bondPurchase({ nation, player: this.currentPlayerName, cost: bond.cost }));
    })
    return out;
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

    game.availableBonds = this.availableBonds;
    game.nations = this.nations;
    game.players = this.players;

    this.setAvailableActions(action, game);
  }

  skipBondPurchase(action, game) {
    this.handleAdvancePlayer();
    this.setAvailableActions(action, game);
  }

  setAvailableActions(action, game) {
    const nations = [Nation.AH, Nation.IT, Nation.FR, Nation.GB, Nation.GE, Nation.RU];
    let nextNation = action.payload.nation;
    const nationIndex = nations.indexOf(nextNation);
    if (this.currentPlayerName === this.order[this.firstPlayerIndex]) {
      nextNation = nations[nationIndex + 1]
      this.firstPlayerIndex++;
      if (!this.order[this.firstPlayerIndex]) {
        this.firstPlayerIndex = 0;
      }
      this.currentPlayerName = this.order[this.firstPlayerIndex];

      if (!nextNation) {
        for (const player in game.players) {
          game.checkForSwissBank(player);
        }

        const [startingPlayer, startingNation] = this.getStartingPlayerAndNation();
        game.currentPlayerName = startingPlayer;
        this.currentNation = startingNation;
        this.availableActions = new Set(game.rondelActions(startingNation));
        this.inAuction = false;
        return;
      }
    }
    this.currentNation = nextNation;
    const ahControllerIndex = this.order.indexOf(game.nations.get(Nation.AH).controller);
    this.investorCardHolder = this.order[ahControllerIndex - 1] || this.order[this.order.length - 1];
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

  getStartingPlayerAndNation() {
    let nation = Nation.AH;
    let player = this.nations.get(nation).controller;
    if (!player) {
      nation = Nation.IT;
      player = this.nations.get(nation).controller;
    }
    if (!player) {
      nation = Nation.FR;
      player = this.nations.get(nation).controller;
    }
    if (!player) {
      nation = Nation.GB;
      player = this.nations.get(nation).controller;
    }
    if (!player) {
      nation = Nation.GE;
      player = this.nations.get(nation).controller;
    }
    if (!player) {
      nation = Nation.RU;
      player = this.nations.get(nation).controller;
    }
    return [player, nation];
  }
};

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
      this.initialize(action, game);
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

  initialize(action, game) {
    const s = setup({
      players: action.payload.players,
      provinceNames: Array.from(board.graph.keys())
    });
    this.inAuction = true;
    this.order = s.order;
    this.firstPlayerIndex = 0;
    game.currentNation = Nation.AH;
    game.availableActions = this.availableBondPurchases(
      Nation.AH,
      {
        availableBonds: s.availableBonds,
        players: s.players,
        currentPlayerName: this.order[0],
        previousPlayerName: this.order[0]
      }
    );
  }

  availableBondPurchases(nation, game) {
    let out = new Set([Action.skipBondPurchase({ player: game.currentPlayerName, nation })]);
    const bonds = [...game.availableBonds].filter(bond => {
      return bond.cost <= game.players[game.currentPlayerName].cash && bond.nation === nation
    })
    bonds.map(bond => {
      out.add(Action.bondPurchase({ nation, player: game.currentPlayerName, cost: bond.cost }));
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

    game.nations.get(action.payload.nation).treasury += action.payload.cost;
    game.players[action.payload.player].cash -= action.payload.cost;

    const newBond = Bond(action.payload.nation, uncost[action.payload.cost]);
    if (!game.availableBonds.has(newBond)) {
      throw new Error(`${newBond} not available`);
    }
    game.players[action.payload.player].bonds.add(newBond);
    game.availableBonds.delete(newBond);

    if (game.nations.get(action.payload.nation).controller === null) {
      game.nations.get(action.payload.nation).controller =
        action.payload.player;
    }

    if (
      this.totalInvestmentInNation(
        action.payload.player,
        action.payload.nation,
        game
      ) >
      this.totalInvestmentInNation(
        game.nations.get(action.payload.nation).controller,
        action.payload.nation,
        game
      )
    ) {
      game.nations.get(action.payload.nation).controller =
        action.payload.player;
    }
    this.handleAdvancePlayer(game);
    this.setAvailableActions(action, game);
  }

  skipBondPurchase(action, game) {
    this.handleAdvancePlayer(game);
    this.setAvailableActions(action, game);
  }

  setAvailableActions(action, game) {
    const nations = [Nation.AH, Nation.IT, Nation.FR, Nation.GB, Nation.GE, Nation.RU];
    let nextNation = action.payload.nation;
    const nationIndex = nations.indexOf(nextNation);
    if (game.currentPlayerName === this.order[this.firstPlayerIndex]) {
      nextNation = nations[nationIndex + 1]
      this.firstPlayerIndex++;
      if (!this.order[this.firstPlayerIndex]) {
        this.firstPlayerIndex = 0;
      }
      game.currentPlayerName = this.order[this.firstPlayerIndex];

      if (!nextNation) {
        for (const player in game.players) {
          game.checkForSwissBank(player);
        }

        const [startingPlayer, startingNation] = this.getStartingPlayerAndNation(game);
        game.currentPlayerName = startingPlayer;
        game.currentNation = startingNation;
        game.availableActions = new Set(game.rondelActions(startingNation));
        this.inAuction = false;
        return;
      }
    }
    game.currentNation = nextNation;
    const ahControllerIndex = this.order.indexOf(game.nations.get(Nation.AH).controller);
    if (game.variant !== "withoutInvestorCard") {
      game.investorCardHolder = this.order[ahControllerIndex - 1] || this.order[this.order.length - 1];
    }
    game.availableActions = this.availableBondPurchases(nextNation, game);
  }

  handleAdvancePlayer(game) {
    const currentPlayerIndex = this.order.indexOf(game.currentPlayerName);
    game.previousPlayerName = game.currentPlayerName;
    game.currentPlayerName = this.order[currentPlayerIndex + 1] || this.order[0];
  }

  totalInvestmentInNation(player, nation, game) {
    if (!game.players[player]) {
      return 0
    }

    return [...game.players[player].bonds]
      .filter(bond => bond.nation === nation)
      .reduce((x, y) => x + y.cost, 0);
  }

  getStartingPlayerAndNation(game) {
    let nation = Nation.AH;
    let player = game.nations.get(nation).controller;
    if (!player) {
      nation = Nation.IT;
      player = game.nations.get(nation).controller;
    }
    if (!player) {
      nation = Nation.FR;
      player = game.nations.get(nation).controller;
    }
    if (!player) {
      nation = Nation.GB;
      player = game.nations.get(nation).controller;
    }
    if (!player) {
      nation = Nation.GE;
      player = game.nations.get(nation).controller;
    }
    if (!player) {
      nation = Nation.RU;
      player = game.nations.get(nation).controller;
    }
    return [player, nation];
  }
};

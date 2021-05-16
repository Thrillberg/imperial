import { Nation, Nation2030, Bond } from "./constants.js";
import Action from "./action.js";
import board from "./board.js";

export default class Auction {
  static fromLog(log, game, auctionSetup) {
    let auction = new Auction();
    log.forEach(entry => auction.tick(entry, game, auctionSetup));
    return auction
  }

  tick(action, game, auctionSetup) {
    if (action.type === "initialize") {
      this.initialize(action, game, auctionSetup);
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

  initialize(action, game, auctionSetup) {
    const s = auctionSetup({
      players: action.payload.players,
      provinceNames: Array.from(board.graph.keys())
    });
    this.inAuction = true;
    this.order = s.order;
    this.firstPlayerIndex = 0;
    if (action.payload.baseGame === "imperial" || !action.payload.baseGame) {
      game.currentNation = Nation.AH;
    } else if (action.payload.baseGame === "imperial2030") {
      game.currentNation = Nation2030.RU;
    }
    game.availableActions = this.availableBondPurchases(
      {
        availableBonds: s.availableBonds,
        players: s.players,
        currentNation: game.currentNation,
        currentPlayerName: this.order[0],
        previousPlayerName: this.order[0]
      }
    );
  }

  availableBondPurchases(game) {
    let out = new Set([Action.skipBondPurchase({ player: game.currentPlayerName, nation: game.currentNation })]);
    const bonds = [...game.availableBonds].filter(bond => {
      return bond.cost <= game.players[game.currentPlayerName].cash && bond.nation === game.currentNation
    })
    bonds.map(bond => {
      out.add(Action.bondPurchase({
        nation: game.currentNation,
        player: game.currentPlayerName,
        cost: bond.cost,
        tradeInValue: 0
      }));
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
    this.setAvailableActions(action, game);
  }

  skipBondPurchase(action, game) {
    this.setAvailableActions(action, game);
  }

  setAvailableActions(action, game) {
    game.availableActions = new Set();
    // If there is one available action, it is the pass action and doesn't
    // count as a real action.
    while (game.availableActions.size <= 1) {
      const currentPlayerIndex = this.order.indexOf(game.currentPlayerName);
      const canPurchaseBonds = this.availableBondPurchases(game).size > 1;
      if (canPurchaseBonds) {
        game.previousPlayerName = game.currentPlayerName;
      }
      game.currentPlayerName = this.order[currentPlayerIndex + 1] || this.order[0];

      // Nation's bonds have been offered to all players
      if (this.shouldAdvanceNation(game)) {
        this.advanceNation(game);
        this.resetCurrentPlayer(game);

        // Auction is over and the game should start
        if (!game.currentNation) {
          this.prepareToStartGame(game);
          return;
        }
      }

      if (!canPurchaseBonds) {
        game.annotatedLog.push(
          Action.playerAutoSkipsBondPurchase({
            player: game.currentPlayerName,
            bondNation: game.currentNation
          })
        );
      }
      game.availableActions = this.availableBondPurchases(game);
    }
  }

  shouldAdvanceNation(game) {
    return game.currentPlayerName === this.order[this.firstPlayerIndex]
  }

  advanceNation(game) {
    let nations;
    if (game.baseGame === "imperial" || !game.baseGame) {
      nations = [Nation.AH, Nation.IT, Nation.FR, Nation.GB, Nation.GE, Nation.RU];
    } else if (game.baseGame === "imperial2030") {
      nations = [Nation2030.RU, Nation2030.CN, Nation2030.IN, Nation2030.BR, Nation2030.US, Nation2030.EU];
    }
    const nationIndex = nations.indexOf(game.currentNation);
    game.currentNation = nations[nationIndex + 1];
  }

  resetCurrentPlayer(game) {
    this.firstPlayerIndex++;
    if (!this.order[this.firstPlayerIndex]) {
      this.firstPlayerIndex = 0;
    }
    game.currentPlayerName = this.order[this.firstPlayerIndex];
  }

  prepareToStartGame(game) {
    for (const player in game.players) {
      game.checkForSwissBank(player);
    }

    const [startingPlayer, startingNation] = this.getStartingPlayerAndNation(game);
    game.currentPlayerName = startingPlayer;
    game.currentNation = startingNation;
    game.availableActions = new Set(game.rondelActions(startingNation));
    this.inAuction = false;
    let startingControllerIndex;
    if (game.baseGame === "imperial" || !game.baseGame) {
      startingControllerIndex = this.order.indexOf(game.nations.get(Nation.AH).controller);
    } else if (game.baseGame === "imperial2030") {
      startingControllerIndex = this.order.indexOf(game.nations.get(Nation2030.RU).controller);
    }
    if (game.variant !== "withoutInvestorCard") {
      game.investorCardHolder = this.order[startingControllerIndex - 1] || this.order[this.order.length - 1];
    }
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
    let nation, player;
    if (game.baseGame === "imperial" || !game.baseGame) {
      nation = Nation.AH;
      player = game.nations.get(nation).controller;
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
    } else if (game.baseGame === "imperial2030") {
      nation = Nation2030.RU;
      player = game.nations.get(nation).controller;
      if (!player) {
        nation = Nation2030.CN;
        player = game.nations.get(nation).controller;
      }
      if (!player) {
        nation = Nation2030.IN;
        player = game.nations.get(nation).controller;
      }
      if (!player) {
        nation = Nation2030.BR;
        player = game.nations.get(nation).controller;
      }
      if (!player) {
        nation = Nation2030.US;
        player = game.nations.get(nation).controller;
      }
      if (!player) {
        nation = Nation2030.EU;
        player = game.nations.get(nation).controller;
      }
    }
    return [player, nation];
  }
}

import { Nation, Nation2030, Bond } from './constants';
import Action from './action';
import board from './board';

export default class Auction {
  static fromLog(log, game, auctionSetup) {
    const auction = new Auction();
    log.forEach((entry) => auction.tick(entry, game, auctionSetup));
    return auction;
  }

  tick(action, game, auctionSetup) {
    if (action.type === 'initialize') {
      this.initialize(action, game, auctionSetup);
      return;
    }
    game.previousPlayerName = game.currentPlayerName;

    switch (action.type) {
      case 'bondPurchase': {
        this.bondPurchase(action, game);
        return;
      }
      case 'skipBondPurchase': {
        this.skipBondPurchase(action, game);
        break;
      }
      default: {
        break;
      }
    }
  }

  initialize(action, game, auctionSetup) {
    const s = auctionSetup({
      players: action.payload.players,
      provinceNames: Array.from(board.graph.keys()),
    });
    this.inAuction = true;
    this.order = s.order;
    this.firstPlayerIndex = 0;
    if (action.payload.baseGame === 'imperial' || !action.payload.baseGame) {
      game.currentNation = Nation.AH;
    } else if (action.payload.baseGame === 'imperial2030') {
      game.currentNation = Nation2030.RU;
    }
    game.availableActions = Auction.availableBondPurchases({
      availableBonds: s.availableBonds,
      players: s.players,
      currentNation: game.currentNation,
      currentPlayerName: this.order[0],
      previousPlayerName: this.order[0],
    });
    game.availableActions.add(Action.skipBondPurchase({
      player: this.order[0],
      nation: game.currentNation,
    }));
  }

  static availableBondPurchases(game) {
    const out = new Set();
    const bonds = [...game.availableBonds].filter((bond) => (
      bond.cost <= game.players[game.currentPlayerName].cash
        && bond.nation === game.currentNation
    ));
    bonds.forEach((bond) => {
      out.add(
        Action.bondPurchase({
          nation: game.currentNation,
          player: game.currentPlayerName,
          cost: bond.cost,
          tradeInValue: 0,
        }),
      );
    });
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
      30: 9,
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
      game.nations.get(action.payload.nation).controller = action.payload.player;
    }

    if (
      Auction.totalInvestmentInNation(
        action.payload.player,
        action.payload.nation,
        game,
      )
      > Auction.totalInvestmentInNation(
        game.nations.get(action.payload.nation).controller,
        action.payload.nation,
        game,
      )
    ) {
      game.nations.get(action.payload.nation).controller = action.payload.player;
    }
    this.setAvailableActions(game);
  }

  skipBondPurchase(action, game) {
    this.setAvailableActions(action, game);
  }

  setAvailableActions(game) {
    game.availableActions = new Set();
    // If there are two available actions, they are the pass action and undo and don't
    // count as real actions.
    while (game.availableActions.size <= 2) {
      const currentPlayerIndex = this.order.indexOf(game.currentPlayerName);
      game.currentPlayerName = this.order[currentPlayerIndex + 1] || this.order[0];
      game.availableActions.add(Action.undo({ player: game.previousPlayerName }));

      // Nation's bonds have been offered to all players
      if (this.shouldAdvanceNation(game)) {
        Auction.advanceNation(game);
        this.resetCurrentPlayer(game);

        // Auction is over and the game should start
        if (!game.currentNation) {
          this.prepareToStartGame(game);
          return;
        }
      }

      const availableBondPurchases = Auction.availableBondPurchases(game);
      if (availableBondPurchases.size === 0) {
        game.annotatedLog.push(
          Action.playerAutoSkipsBondPurchase({
            player: game.currentPlayerName,
            bondNation: game.currentNation,
          }),
        );
      } else {
        for (const bondPurchase of Auction.availableBondPurchases(game)) {
          game.availableActions.add(bondPurchase);
        }
        game.availableActions.add(Action.skipBondPurchase({
          player: game.currentPlayerName,
          nation: game.currentNation,
        }));
      }
    }
  }

  shouldAdvanceNation(game) {
    return game.currentPlayerName === this.order[this.firstPlayerIndex];
  }

  static advanceNation(game) {
    let nations;
    if (game.baseGame === 'imperial' || !game.baseGame) {
      nations = [
        Nation.AH,
        Nation.IT,
        Nation.FR,
        Nation.GB,
        Nation.GE,
        Nation.RU,
      ];
    } else if (game.baseGame === 'imperial2030') {
      nations = [
        Nation2030.RU,
        Nation2030.CN,
        Nation2030.IN,
        Nation2030.BR,
        Nation2030.US,
        Nation2030.EU,
      ];
    }
    const nationIndex = nations.indexOf(game.currentNation);
    game.currentNation = nations[nationIndex + 1];
  }

  resetCurrentPlayer(game) {
    this.firstPlayerIndex += 1;
    if (!this.order[this.firstPlayerIndex]) {
      this.firstPlayerIndex = 0;
    }
    game.currentPlayerName = this.order[this.firstPlayerIndex];
  }

  prepareToStartGame(game) {
    for (const player in game.players) {
      game.checkForSwissBank(player);
    }

    const [startingPlayer, startingNation] = Auction.getStartingPlayerAndNation(
      game,
    );
    game.currentPlayerName = startingPlayer;
    game.currentNation = startingNation;
    for (const rondelAction of game.rondelActions(startingNation)) {
      game.availableActions.add(rondelAction);
    }
    this.inAuction = false;
    let startingControllerIndex;
    if (game.baseGame === 'imperial' || !game.baseGame) {
      startingControllerIndex = this.order.indexOf(
        game.nations.get(Nation.AH).controller,
      );
    } else if (game.baseGame === 'imperial2030') {
      startingControllerIndex = this.order.indexOf(
        game.nations.get(Nation2030.RU).controller,
      );
    }
    if (game.variant !== 'withoutInvestorCard') {
      game.investorCardHolder = this.order[startingControllerIndex + 1] || this.order[0];
    }
  }

  static totalInvestmentInNation(player, nation, game) {
    if (!game.players[player]) {
      return 0;
    }

    return [...game.players[player].bonds]
      .filter((bond) => bond.nation === nation)
      .reduce((x, y) => x + y.cost, 0);
  }

  static getStartingPlayerAndNation(game) {
    let nation; let
      player;
    if (game.baseGame === 'imperial' || !game.baseGame) {
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
    } else if (game.baseGame === 'imperial2030') {
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

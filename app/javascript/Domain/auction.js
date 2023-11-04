import Action from './action';
import board from './board';
import {
  Bond, Nation, Nation2030, NationAsia,
} from './constants';

export default class Auction {
  static fromLog(log, game, auctionSetup) {
    const auction = new Auction();
    log.forEach((entry) => auction.tick(entry, game, auctionSetup));
    return auction;
  }

  tick(action, gameCoordinator, auctionSetup) {
    if (action.type === 'initialize') {
      this.initialize(action, gameCoordinator, auctionSetup);
      return;
    }
    gameCoordinator.previousPlayerName = gameCoordinator.currentPlayerName;

    switch (action.type) {
      case 'bondPurchase': {
        this.bondPurchase(action, gameCoordinator);
        return;
      }
      case 'skipBondPurchase': {
        this.skipBondPurchase(action, gameCoordinator);
        break;
      }
      default: {
        break;
      }
    }
  }

  initialize(action, gameCoordinator, auctionSetup) {
    const s = auctionSetup({
      players: action.payload.players,
      provinceNames: Array.from(board.graph.keys()),
    });
    this.inAuction = true;
    this.order = s.order;
    this.firstPlayerIndex = 0;
    switch (action.payload.baseGame) {
      case 'imperial2030':
        gameCoordinator.currentNation = Nation2030.RU;
        break;
      case 'imperialAsia':
        gameCoordinator.currentNation = NationAsia.CN;
        break;
      case 'imperial':
      case 'imperialEurope2030':
      default:
        gameCoordinator.currentNation = Nation.AH;
    }
    gameCoordinator.availableActions = Auction.availableBondPurchases({
      availableBonds: s.availableBonds,
      players: s.players,
      currentNation: gameCoordinator.currentNation,
      currentPlayerName: this.order[0],
      previousPlayerName: this.order[0],
    });
    gameCoordinator.availableActions.add(Action.skipBondPurchase({
      player: this.order[0],
      nation: gameCoordinator.currentNation,
    }));
  }

  static availableBondPurchases(gameCoordinator) {
    const out = new Set();
    const bonds = [...gameCoordinator.availableBonds].filter((bond) => (
      bond.cost <= gameCoordinator.players[gameCoordinator.currentPlayerName].cash
        && bond.nation === gameCoordinator.currentNation
    ));
    bonds.forEach((bond) => {
      out.add(
        Action.bondPurchase({
          nation: gameCoordinator.currentNation,
          player: gameCoordinator.currentPlayerName,
          cost: bond.cost,
          tradeInValue: 0,
        }),
      );
    });
    return out;
  }

  bondPurchase(action, gameCoordinator) {
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

    gameCoordinator.nations.get(action.payload.nation).treasury += action.payload.cost;
    gameCoordinator.players[action.payload.player].cash -= action.payload.cost;

    const newBond = Bond(action.payload.nation, uncost[action.payload.cost]);
    if (!gameCoordinator.availableBonds.has(newBond)) {
      throw new Error(`${newBond} not available`);
    }
    gameCoordinator.players[action.payload.player].bonds.add(newBond);
    gameCoordinator.availableBonds.delete(newBond);

    if (gameCoordinator.nations.get(action.payload.nation).controller === null) {
      gameCoordinator.nations.get(action.payload.nation).controller = action.payload.player;
    }

    if (
      Auction.totalInvestmentInNation(
        action.payload.player,
        action.payload.nation,
        gameCoordinator,
      )
      > Auction.totalInvestmentInNation(
        gameCoordinator.nations.get(action.payload.nation).controller,
        action.payload.nation,
        gameCoordinator,
      )
    ) {
      gameCoordinator.nations.get(action.payload.nation).controller = action.payload.player;
    }
    this.setAvailableActions(action, gameCoordinator);
  }

  skipBondPurchase(action, game) {
    this.setAvailableActions(action, game);
  }

  setAvailableActions(_, game) {
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
    return game.currentPlayerName === this.order[this.firstPlayerIndex || 0];
  }

  static advanceNation(game) {
    let nations = [];
    switch (game.baseGame) {
      case 'imperial2030':
        nations = [
          Nation2030.RU,
          Nation2030.CN,
          Nation2030.IN,
          Nation2030.BR,
          Nation2030.US,
          Nation2030.EU,
        ];
        break;
      case 'imperialAsia':
        nations = [
          NationAsia.CN,
          NationAsia.JP,
          NationAsia.FR,
          NationAsia.GB,
          NationAsia.TR,
          NationAsia.RU,
          NationAsia.GE,
        ];
        break;
      case 'imperial':
      case 'imperialEurope2030':
      default:
        nations = [
          Nation.AH,
          Nation.IT,
          Nation.FR,
          Nation.GB,
          Nation.GE,
          Nation.RU,
        ];
        break;
    }

    const nationIndex = nations.indexOf(game.currentNation);
    game.currentNation = nations[nationIndex + 1];

    if (!game.investorCardHolder && game.variant !== 'withoutInvestorCard') {
      let startingControllerIndex;
      switch (game.baseGame) {
        case 'imperial2030':
          startingControllerIndex = game.order.indexOf(
            game.nations.get(Nation2030.RU).controller,
          );
          break;
        case 'imperialAsia':
          startingControllerIndex = game.order.indexOf(
            game.nations.get(NationAsia.CN).controller,
          );
          break;
        case 'imperial':
        case 'imperialEurope2030':
        default:
          startingControllerIndex = game.order.indexOf(
            game.nations.get(Nation.AH).controller,
          );
      }

      game.investorCardHolder = game.order[startingControllerIndex + 1] || game.order[0];
    }
  }

  resetCurrentPlayer(game) {
    if (this.firstPlayerIndex) { this.firstPlayerIndex += 1; } else { this.firstPlayerIndex = 1; }
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
    for (const rondelAction of game.availableRondelActions(startingNation)) {
      game.availableActions.add(rondelAction);
    }
    this.inAuction = false;
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
    let nation;
    let player;
    switch (game.baseGame) {
      case 'imperial2030':
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
        break;
      case 'imperialAsia':
        nation = NationAsia.CN;
        player = game.nations.get(nation).controller;
        if (!player) {
          nation = NationAsia.JP;
          player = game.nations.get(nation).controller;
        }
        if (!player) {
          nation = NationAsia.FR;
          player = game.nations.get(nation).controller;
        }
        if (!player) {
          nation = NationAsia.GB;
          player = game.nations.get(nation).controller;
        }
        if (!player) {
          nation = NationAsia.TR;
          player = game.nations.get(nation).controller;
        }
        if (!player) {
          nation = NationAsia.RU;
          player = game.nations.get(nation).controller;
        }
        if (!player) {
          nation = NationAsia.GE;
          player = game.nations.get(nation).controller;
        }
        break;
      case 'imperial':
      case 'imperialEurope2030':
      default:
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
    }
    return [player, nation];
  }
}

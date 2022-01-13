import { Bond, Nation, Nation2030 } from "./constants.js";
import convertAction from "./convertAction.js";

export default (serializedGame) => {
  const parsedGame = eval('(' + serializedGame + ')');
  const baseGame = parsedGame.baseGame;
  if (parsedGame) {
    let game = Object.assign({}, parsedGame);
    game.availableActions = new Set();
    parsedGame.availableActions.forEach(action => {
      game.availableActions.add(convertAction(action, baseGame));
    });
    game.units = new Map();
    parsedGame.units.forEach(unit => {
      const [nation, nationsUnits] = unit;
      if (baseGame === "imperial") {
        game.units.set(Nation[nation.value], nationsUnits);
      } else if (baseGame === "imperial2030") {
        game.units.set(Nation2030[nation.value], nationsUnits);
      }
    });
    game.unitLimits = new Map();
    parsedGame.unitLimits.forEach(unitLimit => {
      const [nation, nationsUnitLimits] = unitLimit;
      if (baseGame === "imperial") {
        game.unitLimits.set(Nation[nation.value], nationsUnitLimits);
      } else if (baseGame === "imperial2030") {
        game.unitLimits.set(Nation2030[nation.value], nationsUnitLimits);
      }
    });
    game.nations = new Map();
    parsedGame.nations.forEach(nationData => {
      const [nation, data] = nationData;
      if (baseGame === "imperial") {
        game.nations.set(Nation[nation.value], data);
      } else if (baseGame === "imperial2030") {
        game.nations.set(Nation2030[nation.value], data);
      }
    });
    game.provinces = new Map();
    parsedGame.provinces.forEach(provinceData => {
      const [province, data] = provinceData;
      // Do we need to account for data.flag being a Nation??
      game.provinces.set(province, data);
    });
    game.availableBonds = new Set();
    parsedGame.availableBonds.forEach(bond => {
      const {nation, number, cost} = bond;
      if (baseGame === "imperial") {
        game.availableBonds.add(Bond(Nation[nation.value], number));
      } else if (baseGame === "imperial2030") {
        game.availableBonds.add(Bond(Nation2030[nation.value], number));
      }
    });
    game.players = {};
    Object.keys(parsedGame.players).forEach(player => {
      if (baseGame === "imperial") {
        let bonds = new Set();
        parsedGame.players[player].bonds.forEach(bond => {
          bonds.add(Bond(Nation[bond.nation.value], bond.number));
        });
        game.players[player] = {
          ...parsedGame.players[player],
          bonds
        }
      } else if (baseGame === "imperial2030") {
        let bonds = new Set();
        parsedGame.players[player].bonds.forEach(bond => {
          bonds.add(Bond(Nation2030[bond.nation.value], bond.number));
        });
        game.players[player] = {
          ...parsedGame.players[player],
          bonds
        }
      }
    });
    return game
  }
  return serializedGame;
}

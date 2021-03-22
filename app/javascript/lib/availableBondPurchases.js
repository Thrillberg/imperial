import Action from "./action.js";

export default (nation, game) => {
  const player = game.currentPlayerName;
  let out = new Set([Action.skipBondPurchase({ player, nation })]);
  const exchangeableBondCosts = [...game.players[player].bonds]
    .filter(exchangeableBond => {
      return exchangeableBond.nation === nation;
    })
    .map(x => x.cost);
  let topBondCost = Math.max(...exchangeableBondCosts);
  if (topBondCost === -Infinity) {
    topBondCost = 0
  }
  const bonds = [...game.availableBonds].filter(bond => {
    const playerCanBuyOutright = bond.cost <= game.players[player].cash;
    const playerCanTradeUp =
      bond.cost <= game.players[player].cash + topBondCost &&
      bond.cost > topBondCost
    const correctNation = nation === bond.nation
    return correctNation && (playerCanBuyOutright || playerCanTradeUp)
  })
  bonds.map(bond => {
    out.add(Action.bondPurchase({ nation, player: game.currentPlayerName, cost: bond.cost }));
  })
  return out;
}

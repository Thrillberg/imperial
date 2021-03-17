import Action from "./action.js";

export default (nation, game) => {
  const player = game.currentPlayerName;
  let out = new Set([Action.skipBondPurchase({ player, nation })]);
  const bonds = [...game.availableBonds].filter(bond => {
    const exchangeableBondCosts = [...game.players[player].bonds]
      .filter(exchangeableBond => {
        return exchangeableBond.nation === nation;
      })
      .map(x => x.cost);
    const topBondCost = Math.max(exchangeableBondCosts) || 0;
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

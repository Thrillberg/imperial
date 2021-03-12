import Action from "./action.js";

export default (nation, game) => {
  let out = new Set([Action.skipBondPurchase({ player: game.currentPlayerName, nation })]);
  const bonds = [...game.availableBonds].filter(bond => {
    const player = game.currentPlayerName;
    const exchangeableBondCosts = [...game.players[player].bonds]
      .filter(exchangeableBond => {
        return exchangeableBond.nation === nation;
      })
      .map(x => x.cost);
    const topBondCost = Math.max(exchangeableBondCosts) || 0;
    return(
      // Player can buy outright
      bond.cost <= game.players[player].cash || (
        // Player can trade up but not down
        bond.cost <= game.players[player].cash + topBondCost &&
        bond.cost > topBondCost
      )
    )
  })
  bonds.map(bond => {
    out.add(Action.bondPurchase({ nation, player: game.currentPlayerName, cost: bond.cost }));
  })
  return out;
}

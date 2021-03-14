import Action from "./action.js";

export default (nation, game) => {
  const player = game.currentPlayerName;
  let out = new Set([Action.skipBondPurchase({ player, nation })]);
  const bonds = [...game.availableBonds].filter(bond => {
    const exchangeableBondCosts = [...game.players[player].bonds]
      .filter(exchangeableBond => {
        if (game.swissBanks.includes(player)) {
          return true;
        }
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
    if (game.swissBanks.includes(player)) {
      nation = bond.nation;
    }
    out.add(Action.bondPurchase({ nation, player: game.currentPlayerName, cost: bond.cost }));
  })
  return out;
}

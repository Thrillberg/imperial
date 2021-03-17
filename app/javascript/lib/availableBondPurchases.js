import Action from "./action.js";

export default (inputNation, game) => {
  const player = game.currentPlayerName;
  let out = new Set([Action.skipBondPurchase({ player, nation: inputNation })]);
  const bonds = [...game.availableBonds].filter(bond => {
    const exchangeableBondCosts = [...game.players[player].bonds]
      .filter(exchangeableBond => {
        if (game.swissBanks.includes(player) || !inputNation) {
          return exchangeableBond.nation === bond.nation;
        }
        return exchangeableBond.nation === inputNation;
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
    let nation = inputNation;
    if (game.swissBanks.includes(player) || !inputNation) {
      nation = bond.nation;
    }
    out.add(Action.bondPurchase({ nation, player: game.currentPlayerName, cost: bond.cost }));
  })
  return out;
}

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
  [...game.availableBonds].map(bond => {
    const playerCanBuyOutright = bond.cost <= game.players[player].cash;
    const correctNation = nation === bond.nation
    if (correctNation) {
      if (playerCanBuyOutright) {
        out.add(Action.bondPurchase({
          nation,
          player: game.currentPlayerName,
          cost: bond.cost,
          tradeInValue: 0
        }));
      }
      exchangeableBondCosts.map(exchangedBondCost => {
        if (
          bond.cost <= game.players[player].cash + exchangedBondCost &&
          exchangedBondCost < bond.cost
        ) {
          out.add(Action.bondPurchase({
            nation,
            player: game.currentPlayerName,
            cost: bond.cost,
            tradeInValue: exchangedBondCost
          }));
        }
      });
    }
  })
  return out;
}

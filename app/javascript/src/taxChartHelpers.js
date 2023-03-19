export const nextTaxationPowerPoints = (game, nationName) => {
  nationName = nationName || game.currentNation;
  return game.nations.get(nationName).powerPoints + game.powerPointsGainedFrom(game.taxRevenueOf(nationName));
};

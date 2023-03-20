export const nextTaxationPowerPoints = (game, nationName) => {
  return game.nations.get(nationName).powerPoints + game.powerPointsGainedFrom(game.taxRevenueOf(nationName));
};

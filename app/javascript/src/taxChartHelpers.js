export const nextTaxChartPosition = (game, nationName) => {
  nationName = nationName || game.currentNation;
  return game.getTaxChartPosition(game.getTaxes(nationName));
};

export const nextTaxationPowerPoints = (game, nationName) => {
  nationName = nationName || game.currentNation;
  return game.nations.get(nationName).powerPoints + game.powerPointsGainedFrom(game.getTaxes(nationName));
};

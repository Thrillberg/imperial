export const nextTaxChartPosition = (game, nation) => {
  nation = nation || game.currentNation;

  return game.getTaxChartPosition(game.getTaxes(nation));
};

export const nextTaxationPowerPoints = (game, nation) => {
  nation = nation || game.currentNation;
  
  return game.powerPointsGainedFrom(game.getTaxes(nation));
};

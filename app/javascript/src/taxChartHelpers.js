export const nextTaxChartPosition = (game, nation) => {
  nation = nation || game.currentNation;

  return game.getTaxChartPosition(game.getTaxes(nation));
};

export const nextTaxationPowerPoints = (game, nation) => {
  nation = nation || game.currentNation;
  let powerPoints;

  if (game.baseGame === "imperial") {
    powerPoints = nextTaxChartPosition(game, nation) - 5;
    if (powerPoints < 0) powerPoints = 0;
  } else if (game.baseGame === "imperial2030") {
    const powerPointsByTax = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 1,
      7: 1,
      8: 2,
      9: 2,
      10: 3,
      11: 4,
      12: 5,
      13: 6,
      14: 7,
      15: 8,
      16: 9,
      17: 9,
      18: 9,
      19: 9,
      20: 9,
      21: 9,
      22: 9,
      23: 9,
    };
    powerPoints = powerPointsByTax[game.getTaxes(nation)];
  }

  const total = game.nations.get(nation).powerPoints + powerPoints;
  if (total >= 25) return 25;
  return total;
};

export default (game, nationName) => (
  game.nations.get(nationName).powerPoints + game.powerPointsGainedFrom(game.taxRevenueOf(nationName))
);

const { memoize } = require("./memo");

module.exports = {
  bondPurchase: memoize((nation, player, cost) => ({
    type: "bondPurchase",
    payload: { nation, player, cost },
  })),
  maneuver: memoize((origin, destination) => ({
    type: "maneuver",
    payload: { origin, destination },
  })),
};

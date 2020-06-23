const { memoize } = require("./memo");

const makeAction = (type, payloadKeys) =>
  memoize((obj) => {
    const payload = {};
    for (const key of payloadKeys) {
      payload[key] = obj[key];
    }
    return { type, payload };
  });

const specs = {
  bondPurchase: ["nation", "player", "cost"],
  buildFactory: ["province"],
  coexist: ["province", "incumbent", "challenger"],
  fight: ["province", "incumbent", "challenger"],
  import: ["province"],
  maneuver: ["origin", "destination"],
  playerSeating: ["order"],
  production: ["province"],
  rondel: ["nation", "cost", "slot"],
};

module.exports = {};
for (const type of Object.getOwnPropertyNames(specs)) {
  module.exports[type] = makeAction(type, specs[type]);
}

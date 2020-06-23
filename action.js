const { memoize } = require("./memo");

/* This deserves some explanation.
 *
 * Our memoize() function supports only primitive arguments; that
 * is, it cannot perform deep equality checks on objects. That's a
 * problem, because we want our action creation functions to accept
 * a single object as their argument. We hack around that with some
 * assumptions:
 *
 *   - our arguments are objects whose values are all primitives
 *     (ie. { huhu: 2 } instead of { huhu: { bebe: 2 } }
 *   - our objects' keys have a stable lexical sorting (ie. they
 *     are all strings)
 *
 * Those assumptions let us flatten the object in a stable way into
 * memoizable arguments:
 *
 *   1. sort the expected argument keys
 *   2. memoize a function that expects values in the order of those
 *      sorted keys
 *   3. wrap the memoized function in a function that translates a
 *      single, object argument into a list of sorted values
 */
const makeAction = (type, payloadKeys) => {
  payloadKeys.sort();
  const memoized = memoize((...values) => {
    const payload = {};
    values.forEach((v, i) => {
      payload[payloadKeys[i]] = v;
    });
    return { type, payload };
  });
  return (obj) => memoized(...payloadKeys.map((k) => obj[k]));
};

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

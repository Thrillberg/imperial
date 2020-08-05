import { memoize } from "./memo.js";

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
  if (payloadKeys) {
    payloadKeys.sort();
    const memoized = memoize((...values) => {
      const payload = {};
      values.forEach((v, i) => {
        payload[payloadKeys[i]] = v;
      });
      return { type, payload };
    });
    return (obj) => memoized(...payloadKeys.map((k) => obj[k]));
  } else {
    return (ary) => {
      return { type, payload: ary };
    };
  }
};

const noop = Object.freeze({ type: "noop" });

export default {
  noop,
  initialize: makeAction("initialize", ["players", "setup"]),
  blimport: makeAction("blimport"),
  bondPurchase: makeAction("bondPurchase", ["nation", "player", "cost"]),
  buildFactory: makeAction("buildFactory", ["province"]),
  coexist: makeAction("coexist", ["province", "incumbent", "challenger"]),
  fight: makeAction("fight", ["province", "incumbent", "challenger"]),
  import: makeAction("import", ["province", "unit"]),
  maneuver: makeAction("maneuver", ["origin", "destination"]),
  production: makeAction("production", ["province"]),
  rondel: makeAction("rondel", ["nation", "cost", "slot"]),
};

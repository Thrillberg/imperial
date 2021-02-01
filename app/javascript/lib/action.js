import { memoize } from "./memo.js";

// Given two sets, A and B, membership calculates a 3-tuple containing:
// [A - B, A & B, B - A]
//
// A and B are equal if A - B and B - A are both empty.
// A and B are disjoint if A & B is empty.
const membership = (a, b) => {
  const left = new Set();
  const both = new Set();
  const right = new Set();
  for (const e of a) {
    if (b.has(e)) {
      both.add(e);
    } else {
      left.add(e);
    }
  }
  for (const e of b) {
    if (a.has(e)) {
      both.add(e);
    } else {
      right.add(e);
    }
  }
  return [left, both, right];
};

const makeAction = (type, payloadKeys) => {
  const expected = new Set(payloadKeys);
  return memoize(payload => {
    // lightly validate the payload keys
    const [l, b, r] = membership(expected, new Set(Object.keys(payload || {})));
    if (l.size > 0 || r.size > 0) {
      throw new Error(
        JSON.stringify({
          expected: [...l],
          unexpected: [...r],
          ok: [...b],
          type: type
        })
      );
    }
    return { type, payload };
  });
};

const noop = Object.freeze({ type: "noop" });

export default {
  noop,
  initialize: makeAction("initialize", ["players", "soloMode"]),
  bondPurchase: makeAction("bondPurchase", ["nation", "player", "cost"]),
  buildFactory: makeAction("buildFactory", ["province"]),
  coexist: makeAction("coexist", ["province", "incumbent", "challenger"]),
  endGame: makeAction("endGame", []),
  endManeuver: makeAction("endManeuver", []),
  fight: makeAction("fight", [
    "province",
    "incumbent",
    "challenger",
    "targetType"
  ]),
  forceInvestor: makeAction("forceInvestor", ["player"]),
  import: makeAction("import", ["placements"]), // placement : { province: string, type: "army"|"fleet" }
  maneuver: makeAction("maneuver", ["origin", "destination"]),
  production: makeAction("production", ["province"]),
  rondel: makeAction("rondel", ["nation", "cost", "slot"]),
  skipBondPurchase: makeAction("skipBondPurchase", ["player"]),
  skipForceInvestor: makeAction("skipForceInvestor", ["player"])
};

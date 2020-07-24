import { Enum } from "./enum.js";
import { memoize } from "./memo.js";

const Nation = Enum.fromArray(["AH", "IT", "FR", "GB", "GE", "RU"], "Nation");

const cost = {
  1: 2,
  2: 4,
  3: 6,
  4: 9,
  5: 12,
  6: 16,
  7: 20,
  8: 25,
  9: 30,
};
export const Bond = memoize((nation, number) => ({
  nation,
  number,
  cost: cost[number],
}));

export { Nation };

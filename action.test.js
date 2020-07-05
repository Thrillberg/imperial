import Action from "./action";
import { Nation } from "./constants";

describe("Action.rondel", () => {
  test("memoization works", () => {
    const first = Action.rondel({
      nation: Nation.AH,
      cost: 42,
      slot: "maneuver1",
    });
    const second = Action.rondel({
      nation: Nation.AH,
      cost: 42,
      slot: "maneuver1",
    });

    expect(first).toBe(second);
  });
});

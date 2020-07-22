import { Bond, Nation } from "./constants.js";

describe("Bond", () => {
  test("access a bond", () => {
    expect(Bond.get(Nation.AH).get(1)).toEqual({
      cost: 2,
      nation: Nation.AH,
      number: 1,
    });
  });

  test("bond is frozen", () => {
    const bond = Bond.get(Nation.AH).get(1);
    expect(() => (bond = "crazy glue")).toThrowError;
  });

  test("equality", () => {
    expect(Bond.get(Nation.AH).get(1)).toBe(Bond.get(Nation.AH).get(1));
  });
});

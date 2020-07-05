import { memoize } from "./memo";

describe("memoize()", () => {
  test("one simple argument", () => {
    let callCount = 0;

    const fn = memoize((arg) => {
      callCount++;
      return arg + 1;
    });

    expect(callCount).toBe(0);
    expect(fn(42)).toBe(43);
    expect(callCount).toBe(1);
    expect(fn(42)).toBe(43);
    expect(callCount).toBe(1);
  });

  test("list of simple arguments", () => {
    let callCount = 0;

    const fn = memoize((arg1, arg2) => {
      callCount++;
      return [arg1 + 1, arg2.huhu + 2];
    });

    const obj = { huhu: 108 };

    expect(callCount).toBe(0);
    expect(fn(42, obj)).toEqual([43, 110]);
    expect(callCount).toBe(1);
    expect(fn(42, obj)).toEqual([43, 110]);
    expect(callCount).toBe(1);
  });

  /* This may seem like a bug instead of a feature.
   * This may be a correct assumption.
   */
  test("deep equality does not work", () => {
    let callCount = 0;

    const fn = memoize((arg1, arg2) => {
      callCount++;
      return [arg1 + 1, arg2.huhu + 2];
    });

    /* n.b. we create the object twice to get a different object id */
    expect(callCount).toBe(0);
    expect(fn(42, { huhu: 108 })).toEqual([43, 110]);
    expect(callCount).toBe(1);
    expect(fn(42, { huhu: 108 })).toEqual([43, 110]);
    expect(callCount).toBe(2);
  });
});

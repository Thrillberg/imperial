import memoize from './memo';

describe('memoize()', () => {
  test('one simple argument', () => {
    let callCount = 0;

    const fn = memoize((arg) => {
      callCount += 1;
      return arg + 1;
    });

    expect(callCount).toBe(0);
    expect(fn(42)).toBe(43);
    expect(callCount).toBe(1);
    expect(fn(42)).toBe(43);
    expect(callCount).toBe(1);
  });

  test('list of simple arguments', () => {
    let callCount = 0;

    const fn = memoize((arg1, arg2) => {
      callCount += 1;
      return [arg1 + 1, arg2.huhu + 2];
    });

    const obj = { huhu: 108 };

    expect(callCount).toBe(0);
    expect(fn(42, obj)).toEqual([43, 110]);
    expect(callCount).toBe(1);
    expect(fn(42, obj)).toEqual([43, 110]);
    expect(callCount).toBe(1);
  });

  test('arbitrary objects', () => {
    let callCount = 0;

    const fn = memoize((arg1, arg2) => {
      callCount += 1;
      return [arg1 + 1, arg2.huhu + 2];
    });

    expect(callCount).toBe(0);
    const out = fn(42, { huhu: 108 });
    expect(out).toEqual([43, 110]);
    expect(callCount).toBe(1);
    expect(fn(42, { huhu: 108 })).toBe(out);
    expect(callCount).toBe(1);
  });

  test('arrays', () => {
    let callCount = 0;

    const fn = memoize((ary) => {
      callCount += 1;
      return [...ary, 42];
    });

    expect(callCount).toBe(0);
    const out = fn([1, 2]);
    expect(callCount).toBe(1);
    expect(out).toEqual([1, 2, 42]);
    expect(fn([1, 2])).toBe(out);
    expect(callCount).toBe(1);
  });

  test('sets', () => {
    let callCount = 0;

    const fn = memoize((s) => {
      callCount += 1;
      return new Set([...s, 42]);
    });

    expect(callCount).toBe(0);
    const out = fn(new Set([1, 2]));
    expect(callCount).toBe(1);
    expect(out).toEqual(new Set([1, 2, 42]));
    expect(fn(new Set([2, 1]))).toBe(out);
    expect(callCount).toBe(1);
  });

  test('maps', () => {
    let callCount = 0;

    const fn = memoize((s) => {
      callCount += 1;
      return new Map([...s.entries(), ['the answer', 42]]);
    });

    expect(callCount).toBe(0);
    const out = fn(new Map([['the question', 2]]));
    expect(callCount).toBe(1);
    expect(out).toEqual(
      new Map([
        ['the question', 2],
        ['the answer', 42],
      ]),
    );
    expect(fn(new Map([['the question', 2]]))).toBe(out);
    expect(callCount).toBe(1);
  });

  test('deep collections', () => {
    let callCount = 0;

    const input1 = new Map([
      ['evens', [true, new Set([2, 4, 6])]],
      ['odds', [false, new Set([1, 3])]],
    ]);

    const input2 = new Map([
      ['odds', [false, new Set([3, 1])]],
      ['evens', [true, new Set([6, 2, 4])]],
    ]);

    const expected = new Map([
      ['odds', new Set([3])],
      ['evens', new Set([4, 6])],
    ]);

    const fn = memoize((m) => {
      callCount += 1;
      const out = new Map();
      for (const [k, [, v]] of m) {
        const newV = new Set();
        for (const e of v) {
          if (e > 2) {
            newV.add(e);
          }
        }
        out.set(k, newV);
      }
      return out;
    });

    expect(callCount).toBe(0);
    const result = fn(input1);
    expect(callCount).toBe(1);
    expect(result).toEqual(expected);
    expect(fn(input2)).toBe(result);
    expect(callCount).toBe(1);
  });
});

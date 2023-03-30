import Enum from './enum';

describe('Enum', () => {
  const MyEnum = Enum.fromArray(['HUHU', 'BEBE'], 'MyEnum');

  test('strict property access', () => {
    expect(() => MyEnum.BLORP).toThrowError(/BLORP/);
  });

  test('equality', () => {
    expect(MyEnum.HUHU).toBe(MyEnum.HUHU);
    expect(MyEnum.BEBE).not.toBe(MyEnum.HUHU);
  });

  describe('immutability', () => {
    test('of the collection', () => {
      expect(() => {
        MyEnum.HUHU = 42;
      }).toThrowError();
    });

    test('of instances', () => {
      expect(() => {
        MyEnum.HUHU.value = 42;
      }).toThrowError();
    });
  });

  test('set membership', () => {
    const s = new Set();
    s.add(MyEnum.HUHU);

    expect(s).toContain(MyEnum.HUHU);

    s.add(MyEnum.HUHU);

    expect(s.size).toBe(1);

    s.add(MyEnum.BEBE);

    expect(s.size).toBe(2);
  });

  test('#value', () => {
    expect(MyEnum.HUHU.value).toBe('HUHU');
  });

  test('iterability', () => {
    const actual = new Set();
    for (const value of MyEnum) {
      actual.add(value);
    }

    expect(actual).toEqual(new Set([MyEnum.HUHU, MyEnum.BEBE]));
  });

  test('stringification', () => {
    expect(String(MyEnum)).toBe('MyEnum(HUHU|BEBE)');
    expect(String(MyEnum.HUHU)).toBe('[object MyEnum.HUHU]');
  });

  describe('#when', () => {
    test('exhaustiveness', () => {
      expect(() => MyEnum.HUHU.when({
        HUHU: () => {},
      })).toThrowError(/BEBE/);
    });

    test('return value', () => {
      const fn = (e) => `value:${e.value}`;
      expect(
        MyEnum.HUHU.when({
          HUHU: fn,
          BEBE: fn,
        }),
      ).toBe('value:HUHU');
    });
  });
});

const { Enum } = require('./enum')

describe('Enum', () => {
  const MyEnum = Enum.fromArray(["HUHU", "BEBE"], "MyEnum")

  test('strict property access', () => {
    MyEnum.HUHU

    expect(() => MyEnum.BLORP).toThrowError(/BLORP/)
  })

  test('equality', () => {
    expect(MyEnum.HUHU).toBe(MyEnum.HUHU)
    expect(MyEnum.BEBE).not.toBe(MyEnum.HUHU)
  })

  describe('immutability', () => {
    test('of the collection', () => {
      expect(() => MyEnum.HUHU = 42).toThrowError()
    })

    test('of instances', () => {
      const currentValue = MyEnum.HUHU.unwrap()

      MyEnum.HUHU.value = 42

      expect(MyEnum.HUHU.unwrap()).toBe(currentValue)
    })
  })

  test('set membership', () => {
    const s = new Set()
    s.add(MyEnum.HUHU)

    expect(s.has(MyEnum.HUHU))

    s.add(MyEnum.HUHU)

    expect(s.size).toBe(1)

    s.add(MyEnum.BEBE)

    expect(s.size).toBe(2)
  })

  test('#unwrap', () => {
    expect(MyEnum.HUHU.unwrap()).toBe("HUHU")
  })

  test('iterability', () => {
    const actual = new Set()
    for (const value of MyEnum) {
      actual.add(value)
    }

    expect(actual).toEqual(new Set([MyEnum.HUHU, MyEnum.BEBE]))
  })

  test('stringification', () => {
    expect(String(MyEnum.HUHU)).toBe("[object MyEnum.HUHU]")
  })

  describe('#when', () => {
    test('exhaustiveness', () => {
      expect(() => MyEnum.HUHU.when({
        HUHU: () => {},
      })).toThrowError(/BEBE/)
    })

    test('return value', () => {
      expect(MyEnum.HUHU.when({
        HUHU: () => 1,
        BEBE: () => 2,
      })).toBe(1)
    })
  })
})

const { FrozenMap, FrozenSet } = require('./frozen')

describe('FrozenSet', () => {
  test('cannot be mutated', () => {
    const e = FrozenSet([])
    expect(() => e.KEY = "KEY").toThrowError()
  })

  test('throws error on missing keys', () => {
    expect(() => FrozenSet([]).MISSING).toThrowError(/MISSING/)
  })

  test('is a "key mirror"', () => {
    const e = FrozenSet(["FOO", "BAR"])

    expect(e.FOO).toEqual("FOO")
    expect(e.BAR).toEqual("BAR")
  })

  test('is iterable like an array', () => {
    const e = FrozenSet(["ONE", "TWO", "THREE"])

    const actual = []
    for (const key of e) {
      actual.push(key)
    }

    expect(actual).toEqual(["ONE", "TWO", "THREE"])
  })
})

describe('FrozenMap', () => {
  test('cannot be mutated', () => {
    const e = FrozenMap({})
    expect(() => e.key = 42).toThrowError()
  })

  test('throws error on missing keys', () => {
    expect(() => FrozenMap({}).MISSING).toThrowError(/MISSING/)
  })

  test('is a dictionary', () => {
    const e = FrozenMap({
      foo: 42,
      bar: 108,
    })

    expect(e.foo).toEqual(42)
    expect(e.bar).toEqual(108)
  })

  test('is iterable like a dictionary', () => {
    const e = FrozenMap({
      one: 1,
      two: 2,
      three: 3,
    })

    const actual = []
    for (const entry of e) {
      actual.push(entry)
    }

    expect(actual).toEqual([
      ["one", 1],
      ["two", 2],
      ["three", 3],
    ])
  })
})

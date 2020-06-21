const cleanroom = Object.freeze(Object.create(null))

class Enum {
  constructor (value, members, label) {
    Object.defineProperties(this, {
      value: { value: value, enumerable: true },
      members: { value: members, enumerable: false },
      label: { value: label, enumerable: true },
    })

    Object.freeze(this)
  }

  when (cases) {
    for (const member of this.members) {
      if (!cases.hasOwnProperty(member)) {
        throw new Error(`unhandled case ${member}`)
      }
    }
    for (const c of Object.getOwnPropertyNames(cases)) {
      if (Object.is(this.value, c)) {
        return cases[c]()
      }
    }
    throw new Error("unreachable")
  }

  get [Symbol.toStringTag] () {
    return `${this.label}.${this.value}`
  }

  static fromArray (ary, label) {
    const store = new Map()
    const members = new Set(ary)

    if (label === undefined) { label = "<anonymous>" }

    ary.forEach((element) => { store.set(element, new Enum(element, members, label)) })

    return new Proxy(cleanroom, {
      get (_target, property, _receiver) {
        if (store.has(property)) { return store.get(property) }

        if (property === Symbol.iterator) {
          return store.values.bind(store)
        }

        if (property === 'toString') {
          return () => `${label}(${Array.from(members).join('|')})`
        }

        /* escape hatch for properties like Symbol(nodejs.util.inspect.custom) */
        if (typeof property === 'symbol') {
          return Reflect.get(Object, property, _receiver)
        }

        throw new Error(`"${String(property)}" not found in ${label}`)
      },
      set () { throw new Error(`Enum ${label} cannot be mutated`) },
    })
  }
}

module.exports = { Enum }

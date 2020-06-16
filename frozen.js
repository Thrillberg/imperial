const cleanroom = () => Object.freeze(Object.create(null))
const id = x => x

const handlerFor = (store, { getter }) => ({
  get: (_target, property, _receiver) => {
    if (property === Symbol.iterator) {
      return store[Symbol.iterator].bind(store)
    }

    if (store.has(property)) {
      return getter(property)
    }

    throw new Error(`"${String(property)}" not found in this enum`)
  },
  set: () => { throw new Error("enums cannot be mutated") },
})

const FrozenSet = (ary) => {
  const store = new Set(ary)

  return new Proxy(cleanroom(), handlerFor(store, { getter: id }))
}

const FrozenMap = (obj) => {
  const store = new Map()

  for (const key of Object.getOwnPropertyNames(obj)) {
    store.set(key, obj[key])
  }

  return new Proxy(cleanroom(), handlerFor(store, { getter: store.get.bind(store) }))
}

module.exports = { FrozenSet, FrozenMap }

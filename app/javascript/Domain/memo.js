const NO_VALUE = Symbol('NO_VALUE');

const SET_START = Symbol('SET_START');
const ARY_START = Symbol('ARY_START');
const MAP_START = Symbol('MAP_START');
const OBJ_START = Symbol('OBJ_START');
const ITER_END = Symbol('ITER_END');

class Trie {
  constructor(value) {
    this.value = value;
    this.children = new Map();
  }

  getOrInsert(path, fn, args) {
    if (path.length === 0) {
      if (this.value === NO_VALUE) {
        this.value = fn(...args);
      }
      return this.value;
    }
    const [head, ...tail] = path;
    if (head instanceof Array) {
      return this.getOrInsert(
        [ARY_START, ...head, ITER_END, ...tail],
        fn,
        args,
      );
    }
    if (head instanceof Set) {
      const entries = [...head];
      entries.sort();
      return this.getOrInsert(
        [SET_START, ...entries, ITER_END, ...tail],
        fn,
        args,
      );
    }
    if (head instanceof Map) {
      const entries = [...head.entries()].sort();
      return this.getOrInsert(
        [MAP_START, ...entries, ITER_END, ...tail],
        fn,
        args,
      );
    }
    if (head instanceof Object) {
      const entries = Object.entries(head).sort();
      return this.getOrInsert(
        [OBJ_START, ...entries, ITER_END, ...tail],
        fn,
        args,
      );
    }
    if (!this.children.has(head)) {
      this.children.set(head, new Trie(NO_VALUE));
    }
    return this.children.get(head).getOrInsert(tail, fn, args);
  }
}

const memoize = (fn) => {
  const memory = new Trie(NO_VALUE);

  return (...args) => memory.getOrInsert(args, fn, args);
};

export const memoizePath = (fn) => {
  const cache = {};
  return (...args) => {
    const {
      origin,
      nation,
      isFleet,
      friendlyFleets,
      occupiedHomeProvinces,
      hasMoved,
    } = args[0];
    const currentPath = args[1];
    const graph = args[2];
    const paths = args[3];
    let stringifiedArgs = JSON.stringify(origin)
      + JSON.stringify(nation)
      + JSON.stringify(isFleet)
      + JSON.stringify([...friendlyFleets])
      + JSON.stringify(occupiedHomeProvinces)
      + JSON.stringify(hasMoved)
      + JSON.stringify(currentPath)
      + JSON.stringify(graph);
    if (paths) {
      stringifiedArgs += JSON.stringify(paths);
    }
    if (stringifiedArgs in cache) {
      return cache[stringifiedArgs];
    }
    const result = fn({
      origin,
      nation,
      isFleet,
      friendlyFleets,
      occupiedHomeProvinces,
      hasMoved,
    }, currentPath, graph, paths);
    cache[stringifiedArgs] = result;
    return result;
  };
};

export default memoize;

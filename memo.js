const NO_VALUE = Symbol("NO_VALUE");

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

export { memoize };

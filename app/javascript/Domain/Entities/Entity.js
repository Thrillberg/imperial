export default class Entity {
  #id;

  constructor(id) {
    this.#id = id;
  }

  get id() {
    return this.#id;
  }
}

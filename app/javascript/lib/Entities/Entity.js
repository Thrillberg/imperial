export default class Entity {
    #representation;

    constructor(representation) {
        this.#representation = representation;
    }

    get representation() {
        return this.#representation;
    }
}
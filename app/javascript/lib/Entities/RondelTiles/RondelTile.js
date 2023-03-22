export default class RondelTile {
    #representation;

    constructor(representation) {
        this.#representation = representation;
    }

    get representation() {
        return this.#representation;
    }
};
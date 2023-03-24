import Entity from "../Entity";

export default class RondelSlot extends Entity {
    static get classId() {
        return 'RondelSlot';
    }

    constructor(id) {
        super(id);
    }
}
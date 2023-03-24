import Entity from './Entity'

export default class AbstractImperialGame extends Entity {
    static get classId() {
        return 'AbstractImperialGame';
    }

    constructor(id) {
        super(id);
    }
}
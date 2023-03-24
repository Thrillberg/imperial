import AbstractImperialGame from './AbstractImperialGame'

export default class ImperialAsiaGame extends AbstractImperialGame {
    static get classId() {
        return 'imperialAsia';
    }

    constructor(id) {
        super(id);
    }
}
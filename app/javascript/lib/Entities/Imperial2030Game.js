import AbstractImperialGame from './AbstractImperialGame'

export default class Imperial2030Game extends AbstractImperialGame {
    static get classId() {
        return 'imperial2030';
    }

    constructor(id) {
        super(id);
    }
}
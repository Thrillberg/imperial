export default class Province {
    constructor(hasFactory, ownership) {
        this.hasFactory = hasFactory;
        this.ownership = ownership;

        this.friendlyUnits = new Map();
        this.hostileUnits = new Map();
    }

    get isDevoidOfFactory() {
        return ! this.hasFactory;
    }
    get isOccupiedByHostiles() {
        return this.hostileUnits.size > 0;
    }
    get isNotOccupiedByHostiles() {
        return ! this.isOccupiedByHostiles;
    }
};
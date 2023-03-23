import Entity from "../Entity.js"

export default class Province extends Entity {
    constructor(isLand, representation) {
        super(representation);

        this.isLand = isLand;

        this.hasFactory = false;
        this.ownership = ownership;

        this.friendlyUnits = new Map();
        this.hostileUnits = new Map();
    }

    get isOcean() {
        return this.isLand === false;
    }
    set isOcean(bool) {
        this.isLand = bool === false;
    }

    get isDevoidOfFactory() {
        return this.hasFactory === false;
    }
    get isOccupiedByHostiles() {
        return this.hostileUnits.size > 0;
    }
    get isNotOccupiedByHostiles() {
        return this.isOccupiedByHostiles === false;
    }
};

export const translateOldModel = (oldProvinceModel, representation, nation, allUnits) => {
    // temporary until migration is complete
    const province = new Province(oldProvinceModel.isOcean === false, representation);

    province.hasFactory = oldProvinceModel.factory !== '';
    province.ownership = nation;

    for (const [occupyingNation] of allUnits) {
        const { armies, friendly } = allUnits
            .get(occupyingNation)
            .get(representation);

        if (armies > 0) {
            const unitPool = friendly ? province.friendlyUnits : province.hostileUnits;
            unitPool.set(occupyingNation, armies);
        }
    }

    return province;
};
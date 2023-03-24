import Entity from "../Entity.js"

export default class Province extends Entity {
    constructor(isLand, representation) {
        super(representation);

        this.isLand = isLand;

        this.ownership = null;
        this.hasArmsFactory = false;
        this.hasNavalFactory = false;

        this.friendlyUnits = new Map();
        this.hostileUnits = new Map();
    }

    get isOcean() {
        return this.isLand === false;
    }
    set isOcean(bool) {
        this.isLand = bool === false;
    }

    get hasFactory() {
        return this.hasArmsFactory || this.hasNavalFactory;
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

export const translateProvinceModel = (representation, allProvinces, allUnits, gameBoard) => {
    // temporary until migration is complete
    const oldProvinceModel = allProvinces.get(representation)
    const geographicModel = gameBoard.graph.get(representation)

    const province = new Province(geographicModel.isOcean === false || geographicModel.isOcean === undefined, representation);

    province.ownership = geographicModel.nation;
    province.hasArmsFactory = oldProvinceModel.factory === 'armaments';
    province.hasNavalFactory = oldProvinceModel.factory === 'shipyard';

    for (const [occupyingNation] of allUnits) {
        const { armies, fleets, friendly } = allUnits
            .get(occupyingNation)
            .get(representation);

        if (armies > 0 || fleets > 0) {
            const unitPool = friendly ? province.friendlyUnits : province.hostileUnits;
            unitPool.set(occupyingNation, armies + fleets);
        }
    }

    return province;
};
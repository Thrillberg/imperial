import FactoryTile from "./RondelTiles/FactoryTile";
import RondelTile from "./RondelTiles/RondelTile";

const Production1 = 'production1';
const Maneuver1 = 'maneuver1';
const Investor = 'investor';
const Import = 'import';
const Production2 = 'production2';
const Maneuver2 = 'maneuver2';
const Taxation = 'taxation';

export default class Rondel {
    #translator;

    constructor() {
        this.#translator = new Map();
        this.#translator.set(FactoryTile.Representation, new FactoryTile(5));
        this.#translator.set(Production1, new RondelTile(Production1));
        this.#translator.set(Maneuver1, new RondelTile(Maneuver1));
        this.#translator.set(Investor, new RondelTile(Investor));
        this.#translator.set(Import, new RondelTile(Import));
        this.#translator.set(Production2, new RondelTile(Production2));
        this.#translator.set(Maneuver2, new RondelTile(Maneuver2));
        this.#translator.set(Taxation, new RondelTile(Taxation));

        this.tileOrder = [
            this.factoryTile,
            this.production1Tile,
            this.maneuver1Tile,
            this.investorTile,
            this.importTile,
            this.production2Tile,
            this.maneuver2Tile,
            this.taxationTile,
        ];
    }

    get factoryTile() {
        return this.representationToEntity(FactoryTile.Representation);
    }
    get production1Tile() {
        return this.representationToEntity(Production1);
    }
    get maneuver1Tile() {
        return this.representationToEntity(Maneuver1);
    }
    get investorTile() {
        return this.representationToEntity(Investor);
    }
    get importTile() {
        return this.representationToEntity(Import);
    }
    get production2Tile() {
        return this.representationToEntity(Production2);
    }
    get maneuver2Tile() {
        return this.representationToEntity(Maneuver2);
    }
    get taxationTile() {
        return this.representationToEntity(Taxation);
    }

    representationToEntity(string) {
        return this.#translator.get(string)
    }

    tileClockwiseTo(tile, tileCounts) {
        let tileIndex = this.tileOrder.indexOf(tile); 
        tileIndex += tileCounts;

        tileIndex %= this.tileOrder.length;
        return this.tileOrder[tileIndex];
    }

    passedInvestor(exclusiveFromTile, exclusiveToTile) {
        exclusiveFromTile = this.tileClockwiseTo(exclusiveToTile, 1);

        while (exclusiveFromTile != exclusiveToTile) {
            exclusiveFromTile = this.tileClockwiseTo(exclusiveToTile, 1);

            if (exclusiveFromTile == this.investorTile) {
                return true;
            }
        }

        return false;
    }
};
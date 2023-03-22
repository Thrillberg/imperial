export default class Rondel {
    constructor() {
        this.tiles = [
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
        return 'factory';
    }
    get production1Tile() {
        return 'production1';
    }
    get maneuver1Tile() {
        return 'maneuver1';
    }
    get investorTile() {
        return 'investor';
    }
    get importTile() {
        return 'import';
    }
    get production2Tile() {
        return 'production2';
    }
    get maneuver2Tile() {
        return 'maneuver2';
    }
    get taxationTile() {
        return 'taxation';
    }
};
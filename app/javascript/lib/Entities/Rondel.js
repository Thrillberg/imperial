export default class Rondel {
    constructor(availableFreeActionsTileCount, availablePaidActionsTileCount, costPerPaidTileDistance) {
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

        this.availableFreeActionsTileCount = availableFreeActionsTileCount;
        this.availablePaidActionsTileCount = availablePaidActionsTileCount;

        this.costPerPaidTileDistance = costPerPaidTileDistance;
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

    nextAvailableFreeActionTiles(currentTile) {
        const availableFreeActions = new Set();

        if (currentTile) {
            const firstAvailableFreeTileIndex = this.tiles.indexOf(currentTile) + 1;

            for (let i = 0; i < this.availableFreeActionsTileCount; i++) {
                let availableIndex = firstAvailableFreeTileIndex + i;
                if (availableIndex >= this.tiles.length) {
                    availableIndex -= this.tiles.length;
                }

                availableFreeActions.add(this.tiles[availableIndex]);
            }
        } else {
            for (const availableTile of this.tiles) {
                availableFreeActions.add(availableTile);
            }
        }

        return availableFreeActions;
    };

    nextAvailablePaidActionTiles(currentTile) {
        const availablePaidActions = new Map();

        if (currentTile) {
            const firstAvailablePaidTileIndex = this.tiles.indexOf(currentTile) + 1 + this.availableFreeActionsTileCount;

            for (let i = 0; i < this.availablePaidActionsTileCount; i++) {
                const cost = (i + 1) * this.costPerPaidTileDistance;

                let availableIndex = firstAvailablePaidTileIndex + i;
                if (availableIndex >= this.tiles.length) {
                    availableIndex -= this.tiles.length;
                }

                availablePaidActions.set(this.tiles[availableIndex], cost);
            }
        }

        return availablePaidActions;
    };
};
export default class Rondel_SelectNextTile_AvailableTiles {
    constructor(rondel, availableFreeActionsTileCount, availablePaidActionsTileCount, costPerPaidTileDistance) {
        this.rondel = rondel;

        this.availableFreeActionsTileCount = availableFreeActionsTileCount;
        this.availablePaidActionsTileCount = availablePaidActionsTileCount;

        this.costPerPaidTileDistance = costPerPaidTileDistance;
    }

    
    nextAvailableFreeActionTiles(currentTile) {
        const availableFreeActions = new Set();

        if (currentTile) {
            const firstAvailableFreeTileIndex = this.rondel.tiles.indexOf(currentTile) + 1;

            for (let i = 0; i < this.availableFreeActionsTileCount; i++) {
                let availableIndex = firstAvailableFreeTileIndex + i;
                if (availableIndex >= this.rondel.tiles.length) {
                    availableIndex -= this.rondel.tiles.length;
                }

                availableFreeActions.add(this.rondel.tiles[availableIndex]);
            }
        } else {
            for (const availableTile of this.rondel.tiles) {
                availableFreeActions.add(availableTile);
            }
        }

        return availableFreeActions;
    };

    nextAvailablePaidActionTiles(currentTile) {
        const availablePaidActions = new Map();

        if (currentTile) {
            const firstAvailablePaidTileIndex = this.rondel.tiles.indexOf(currentTile) + 1 + this.availableFreeActionsTileCount;

            for (let i = 0; i < this.availablePaidActionsTileCount; i++) {
                const cost = (i + 1) * this.costPerPaidTileDistance;

                let availableIndex = firstAvailablePaidTileIndex + i;
                if (availableIndex >= this.rondel.tiles.length) {
                    availableIndex -= this.rondel.tiles.length;
                }

                availablePaidActions.set(this.rondel.tiles[availableIndex], cost);
            }
        }

        return availablePaidActions;
    };
};
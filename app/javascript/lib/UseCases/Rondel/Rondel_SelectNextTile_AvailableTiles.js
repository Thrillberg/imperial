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
            for (let i = 0; i < this.availableFreeActionsTileCount; i++) {
                currentTile = this.rondel.tileClockwiseTo(currentTile, 1);
                availableFreeActions.add(currentTile);
            }
        } else {
            for (const availableTile of this.rondel.tileOrder) {
                availableFreeActions.add(availableTile);
            }
        }

        return availableFreeActions;
    }

    nextAvailablePaidActionTiles(currentTile) {
        const availablePaidActions = new Map();

        if (currentTile) {
            currentTile = this.rondel.tileClockwiseTo(currentTile, this.availableFreeActionsTileCount);

            for (let i = 0; i < this.availablePaidActionsTileCount; i++) {
                const cost = (i + 1) * this.costPerPaidTileDistance;

                currentTile = this.rondel.tileClockwiseTo(currentTile, 1);
                availablePaidActions.set(currentTile, cost);
            }
        }

        return availablePaidActions;
    }
};
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
            const firstAvailableFreeTileIndex = this.rondel.tileOrder.indexOf(currentTile) + 1;

            for (let i = 0; i < this.availableFreeActionsTileCount; i++) {
                let availableIndex = firstAvailableFreeTileIndex + i;
                if (availableIndex >= this.rondel.tileOrder.length) {
                    availableIndex -= this.rondel.tileOrder.length;
                }

                availableFreeActions.add(this.rondel.tileOrder[availableIndex]);
            }
        } else {
            for (const availableTile of this.rondel.tileOrder) {
                availableFreeActions.add(availableTile);
            }
        }

        return availableFreeActions;
    };

    nextAvailablePaidActionTiles(currentTile) {
        const availablePaidActions = new Map();

        if (currentTile) {
            const firstAvailablePaidTileIndex = this.rondel.tileOrder.indexOf(currentTile) + 1 + this.availableFreeActionsTileCount;

            for (let i = 0; i < this.availablePaidActionsTileCount; i++) {
                const cost = (i + 1) * this.costPerPaidTileDistance;

                let availableIndex = firstAvailablePaidTileIndex + i;
                if (availableIndex >= this.rondel.tileOrder.length) {
                    availableIndex -= this.rondel.tileOrder.length;
                }

                availablePaidActions.set(this.rondel.tileOrder[availableIndex], cost);
            }
        }

        return availablePaidActions;
    };
};
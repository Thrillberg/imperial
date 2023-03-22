export default class rondel {
    constructor(availableFreeActionsTileCount, availablePaidActionsTileCount, costPerPaidTileDistance) {
        this.tiles = [
            this.factoryAction,
            this.production1Action,
            this.maneuver1Action,
            this.investorAction,
            this.importAction,
            this.production2Action,
            this.maneuver2Action,
            this.taxationAction,
        ];

        this.availableFreeActionsTileCount = availableFreeActionsTileCount;
        this.availablePaidActionsTileCount = availablePaidActionsTileCount;

        this.costPerPaidTileDistance = costPerPaidTileDistance;
    }

    get factoryAction() {
        return 'factory';
    }
    get production1Action() {
        return 'production1';
    }
    get maneuver1Action() {
        return 'maneuver1';
    }
    get investorAction() {
        return 'investor';
    }
    get importAction() {
        return 'import';
    }
    get production2Action() {
        return 'production2';
    }
    get maneuver2Action() {
        return 'maneuver2';
    }
    get taxationAction() {
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
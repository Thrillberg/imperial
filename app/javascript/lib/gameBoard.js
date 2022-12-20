import MapWithDefault from './mapWithDefault';

export default class GameBoard {
  constructor({ nodes, edges }) {
    this.graph = new Map();
    this.byNation = new MapWithDefault();

    this.setupGraph(nodes);
    this.setImmediateNeighbors(edges);
  }

  setupGraph(nodes) {
    for (const {
      name: province,
      nation,
      isOcean,
      factoryType,
      egress,
    } of nodes) {
      this.graph.set(province, {
        nation,
        neighbors: new Set(),
        isOcean,
        factoryType,
        egress,
      });

      if (!this.byNation.has(nation)) {
        this.byNation.set(nation, new Set());
      }
      this.byNation.get(nation).add(province);
    }
  }

  setImmediateNeighbors(edges) {
    edges.forEach(([a, b]) => {
      this.graph.get(a).neighbors.add(b);
      this.graph.get(b).neighbors.add(a);
    });
  }

  neighborsFor(originData) {
    const allPaths = this.pathsFrom(originData);
    return allPaths.map((path) => path[path.length - 1]);
  }

  pathsFrom(originData) {
    this.validate(originData.origin);
    let paths = this.getPathsToNeighbors(originData, [[originData.origin]]);

    // Armies cannot end up on the ocean
    paths = paths.filter((path) => {
      if (!originData.isFleet && this.graph.get(path[path.length - 1]).isOcean) {
        return false;
      }
      return true;
    });

    // Units cannot begin and end in the same spot
    paths = paths.filter((path) => path.length > 1);

    // Fleets can only exit a home province into one particular egress
    paths = paths.filter((path) => {
      const destinationIsNotCorrectEgress = (
        path[path.length - 1] !== this.graph.get(originData.origin).egress
      );
      if (
        originData.isFleet
        && this.graph.get(originData.origin).nation
        && destinationIsNotCorrectEgress
      ) {
        return false;
      }
      return true;
    });
    return paths;
  }

  getPathsToNeighbors(
    {
      origin,
      nation,
      isFleet,
      friendlyFleets,
      occupiedHomeProvinces = [],
      hasMoved = false,
    },
    paths,
  ) {
    const currentPath = paths[paths.length - 1];
    // Add all immediate neighbors
    [...this.graph.get(origin).neighbors]
      .filter((province) => !currentPath.includes(province))
      .forEach((province) => {
        if (isFleet && this.graph.get(province).isOcean) {
          // Fleet maneuvering to the ocean
          paths.push(currentPath.concat([province]));
        } else if (
          !isFleet
            && !this.graph.get(province).isOcean
            && this.graph.get(origin).nation === nation
            && this.graph.get(province).nation === nation
            && !occupiedHomeProvinces.includes(province)
        ) {
        // Army maneuvering from its own unoccupied land to its own unoccupied land
          paths.push(currentPath.concat([province]));
          return this.getPathsToNeighbors(
            {
              origin: province,
              nation,
              isFleet,
              friendlyFleets,
              occupiedHomeProvinces,
              hasMoved,
            },
            paths,
          );
        } else if (
          !isFleet
            && !this.graph.get(province).isOcean
            && this.graph.get(origin).nation !== nation
            && this.graph.get(province).nation === nation
            && !occupiedHomeProvinces.includes(province)
        ) {
        // Army maneuvering from foreign land to its own unoccupied land
          paths.push(currentPath.concat([province]));
          return this.getPathsToNeighbors(
            {
              origin: province,
              nation,
              isFleet,
              friendlyFleets,
              occupiedHomeProvinces,
              hasMoved: true,
            },
            paths,
          );
        } else if (
          !isFleet
            && !this.graph.get(province).isOcean
            && this.graph.get(origin).nation === nation
            && this.graph.get(province).nation !== nation
            && !hasMoved
        ) {
          // Army maneuvering from its own unoccupied land to foreign land
          paths.push(currentPath.concat([province]));
        } else if (
          !isFleet
            && !this.graph.get(province).isOcean
            && this.graph.get(province).nation === nation
            && occupiedHomeProvinces.includes(province)
            && !hasMoved
        ) {
          // Army maneuvering to its own occupied land
          paths.push(currentPath.concat([province]));
        } else if (!isFleet && !this.graph.get(province).isOcean && !hasMoved) {
          // Army maneuvering to foreign land
          paths.push(currentPath.concat([province]));
        } else if (
          !isFleet
            && this.graph.get(province).isOcean
            && friendlyFleets.has(province)
        ) {
        // Army convoying over ocean
          paths.push(currentPath.concat([province]));
          return this.getPathsToNeighbors(
            {
              origin: province,
              nation,
              isFleet,
              friendlyFleets,
              occupiedHomeProvinces,
            },
            paths,
          );
        }
        return paths;
      });

    return paths;
  }

  validate(origin) {
    if (!this.graph.has(origin)) {
      throw new Error(
        `province ${origin} not found. Available provinces are: ${[
          ...this.graph.keys(),
        ]}`,
      );
    }
  }
}

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
    const allPaths = this.pathsFrom(originData, [originData.origin]);
    return allPaths.map((path) => path[path.length - 1]);
  }

  pathsFrom(
    {
      origin,
      nation,
      isFleet,
      friendlyFleets,
      occupiedHomeProvinces = [],
      hasMoved = false,
    },
    currentPath,
  ) {
    this.validate(origin);
    let paths = [currentPath];

    // Add all immediate neighbors
    for (const province of this.graph.get(origin).neighbors) {
      // Don't repeat ourselves
      if (currentPath.includes(province)) {
        continue; // eslint-disable-line no-continue
      }
      // Fleet maneuvering to the ocean
      if (isFleet && this.graph.get(province).isOcean) {
        paths.push(currentPath.concat([province]));
        // Army maneuvering from its own unoccupied land to its own unoccupied land
      } else if (
        !isFleet
        && !this.graph.get(province).isOcean
        && this.graph.get(origin).nation === nation
        && this.graph.get(province).nation === nation
        && !occupiedHomeProvinces.includes(province)
      ) {
        const newPaths = this.pathsFrom(
          {
            origin: province,
            nation,
            isFleet,
            friendlyFleets,
            occupiedHomeProvinces,
            hasMoved,
          },
          currentPath.concat([province]),
        );
        paths = paths.concat(newPaths);
        // Army maneuvering from foreign land to its own unoccupied land
      } else if (
        !isFleet
        && !this.graph.get(province).isOcean
        && this.graph.get(origin).nation !== nation
        && this.graph.get(province).nation === nation
        && !occupiedHomeProvinces.includes(province)
      ) {
        const newPaths = this.pathsFrom(
          {
            origin: province,
            nation,
            isFleet,
            friendlyFleets,
            occupiedHomeProvinces,
            hasMoved: true,
          },
          currentPath.concat([province]),
        );

        return this.validatePaths(paths.concat(newPaths), isFleet, origin);
        // Army maneuvering from its own unoccupied land to foreign land
      } else if (
        !isFleet
        && !this.graph.get(province).isOcean
        && this.graph.get(origin).nation === nation
        && this.graph.get(province).nation !== nation
        && !hasMoved
      ) {
        paths.push(currentPath.concat([province]));
        // Army maneuvering to its own occupied land
      } else if (
        !isFleet
        && !this.graph.get(province).isOcean
        && this.graph.get(province).nation === nation
        && occupiedHomeProvinces.includes(province)
        && !hasMoved
      ) {
        paths.push(currentPath.concat([province]));
        // Army maneuvering to foreign land
      } else if (!isFleet && !this.graph.get(province).isOcean && !hasMoved) {
        paths.push(currentPath.concat([province]));
        // Army convoying over ocean
      } else if (
        !isFleet
        && this.graph.get(province).isOcean
        && friendlyFleets.has(province)
        && !hasMoved
      ) {
        const newPaths = this.pathsFrom(
          {
            origin: province,
            nation,
            isFleet,
            friendlyFleets,
            occupiedHomeProvinces,
          },
          currentPath.concat([province]),
        );
        paths = paths.concat(newPaths);
      }
    }

    return this.validatePaths(paths, isFleet, origin);
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

  validatePaths(paths, isFleet, origin) {
    let validPaths = [];
    // Armies cannot end up on the ocean
    validPaths = paths.filter((path) => {
      if (!isFleet && this.graph.get(path[path.length - 1]).isOcean) {
        return false;
      }
      return true;
    });

    // Units cannot begin and end in the same spot
    validPaths = validPaths.filter((path) => path.length > 1);

    // Fleets can only exit a home province into one particular egress
    validPaths = validPaths.filter((path) => {
      const destinationIsNotCorrectEgress = path[path.length - 1] !== this.graph.get(origin).egress;
      if (
        isFleet
        && this.graph.get(origin).nation
        && destinationIsNotCorrectEgress
      ) {
        return false;
      }
      return true;
    });

    return validPaths;
  }
}

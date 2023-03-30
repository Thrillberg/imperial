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
    const allPaths = this.validatePaths(
      this.pathsFrom(originData, [originData.origin]),
      originData.isFleet,
      originData.origin,
    );
    return [...new Set(allPaths.map((path) => path[path.length - 1]))];
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
    paths = [],
  ) {
    this.validate(origin);

    for (const province of this.graph.get(origin).neighbors) {
      // Add all immediate neighbors
      if (currentPath.includes(province)) {
        // Don't repeat ourselves
        continue; // eslint-disable-line no-continue
      }

      const newPath = currentPath.concat(province);

      if (
        !isFleet
        && !this.graph.get(province).isOcean
        && !occupiedHomeProvinces.includes(province)
        && this.graph.get(province).nation === nation
      ) {
        if (currentPath[currentPath.length - 1] === province) {
          paths.push(currentPath);
        } else {
          paths.push(newPath);
        }
        this.pathsFrom(
          {
            origin: province,
            nation,
            isFleet,
            friendlyFleets,
            occupiedHomeProvinces,
            hasMoved: this.graph.get(origin).nation === nation ? hasMoved : true,
          },
          newPath,
          paths,
        );
      }

      if (
        !isFleet
        && this.graph.get(province).isOcean
        && friendlyFleets.has(province)
        && !hasMoved
      ) {
        // Army convoying over ocean
        paths.push(newPath);
        this.pathsFrom(
          {
            origin: province,
            nation,
            isFleet,
            friendlyFleets,
            occupiedHomeProvinces,
            hasMoved: false,
          },
          newPath,
          paths,
        );
      } else if (isFleet && this.graph.get(province).isOcean) {
        // Fleet maneuvering to the ocean
        paths.push(newPath);
      } else if (
        !isFleet
        && !this.graph.get(province).isOcean
        && this.graph.get(origin).nation === nation
        && this.graph.get(province).nation !== nation
        && !hasMoved
      ) {
        // Army maneuvering from its own unoccupied land to foreign land
        paths.push(newPath);
      } else if (
        !isFleet
        && !this.graph.get(province).isOcean
        && this.graph.get(province).nation === nation
        && occupiedHomeProvinces.includes(province)
        && !hasMoved
      ) {
        // Army maneuvering to its own occupied land
        paths.push(newPath);
      } else if (!isFleet && !this.graph.get(province).isOcean && !hasMoved) {
        // Army maneuvering to foreign land
        paths.push(newPath);
      }
    }

    return paths;
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

export default class GameBoard {
  constructor({ nodes, edges }) {
    this.graph = new Map();
    this.byNation = new Map();

    this.setupGraph(nodes);
    this.setImmediateNeighbors(edges);
  }

  setupGraph(nodes) {
    for (const { name: province, nation, isOcean, factoryType } of nodes) {
      this.graph.set(province, {
        nation,
        neighbors: new Set(),
        isOcean,
        factoryType
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
    return allPaths.map(path => path[path.length - 1])
  }

  pathsFrom({ origin, nation, isFleet, friendlyFleets, occupiedHomeProvinces = [] }, currentPath) {
    this.validate(origin);
    let paths = [currentPath];

    // Add all immediate neighbors
    for (const province of this.graph.get(origin).neighbors) {
      // Don't repeat ourselves
      if (currentPath.includes(province)) {
        continue;
      }
      // Fleet maneuvering to the ocean
      if (isFleet && this.graph.get(province).isOcean) {
        paths.push(currentPath.concat([province]));
      // Army maneuvering to its own unoccupied land
      } else if (!isFleet && !this.graph.get(province).isOcean && this.graph.get(province).nation === nation && !occupiedHomeProvinces.includes(province)) {
        const newPaths = this.pathsFrom(
          { origin: province, nation, isFleet, friendlyFleets, occupiedHomeProvinces },
          currentPath.concat([province])
        );
        paths = paths.concat(newPaths);
      // Army maneuvering to its own occupied land
      } else if (!isFleet && !this.graph.get(province).isOcean && this.graph.get(province).nation === nation && occupiedHomeProvinces.includes(province)) {
        paths.push(currentPath.concat([province]));
      // Army maneuvering to foreign land
      } else if (!isFleet && !this.graph.get(province).isOcean) {
        paths.push(currentPath.concat([province]));
      // Army convoying over ocean
      } else if (!isFleet && this.graph.get(province).isOcean && friendlyFleets.has(province)) {
        const newPaths = this.pathsFrom(
          { origin: province, nation, isFleet, friendlyFleets, occupiedHomeProvinces },
          currentPath.concat([province])
        );
        paths = paths.concat(newPaths);
      }
    }

    // Armies cannot end up on the ocean
    paths = paths.filter((path) => {
      if (!isFleet && this.graph.get(path[path.length - 1]).isOcean) {
        return false;
      }
      return true;
    });

    // Units cannot begin and end in the same spot
    paths = paths.filter(path => path.length > 1);

    return paths;
  }

  validate(origin) {
    if (!this.graph.has(origin))
      throw new Error(
        `province ${origin} not found. Available provinces are: ${[
          ...this.graph.keys()
        ]}`
      );
  }
}

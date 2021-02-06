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

  neighborsFor({ origin, nation, isFleet, friendlyFleets, isOccupied }) {
    this.validate(origin);

    const out = new Set();

    // Add all immediate neighbors
    for (const n of this.graph.get(origin).neighbors) {
      out.add(n);
    }

    // Add all home provinces if origin is in their home nation
    if (nation === this.graph.get(origin).nation && !isFleet && !isOccupied) {
      for (const n of this.byNation.get(nation)) {
        for (const x of this.graph.get(n).neighbors) {
          out.add(x);
        }
      }
    }

    // Convoy
    if (!isFleet) {
      for (const n of out) {
        if (this.graph.get(n).isOcean) {
          if (friendlyFleets.has(n)) {
            for (const neighbor of this.graph.get(n).neighbors) {
              out.add(neighbor);
            }
          }
        }
      }
    }

    // Armies can not swim
    // We all dwell where we belong
    // Navies can not walk
    for (const n of out) {
      if (this.graph.get(n).isOcean ^ isFleet) {
        out.delete(n);
      }
    }

    // Selflessness is a virtue
    out.delete(origin);

    return out;
  }

  pathsFrom({ origin, nation, isFleet, friendlyFleets, isOccupied }, out) {
    this.validate(origin);

    // Add all immediate neighbors
    for (const n of this.graph.get(origin).neighbors) {
      // Don't repeat ourselves
      if (origin === "london") {
        console.log(isFleet, n, this.graph.get("london").neighbors)
      }
      if (out.includes(n)) {
        return out;
      }
      // Fleet maneuvering to the ocean
      if (isFleet && this.graph.get(n).isOcean) {
        return out.concat([n]);
      // Army maneuvering to its own land
      } else if (!isFleet && !this.graph.get(n).isOcean && this.graph.get(n).nation === nation) {
        return out.concat(this.pathsFrom({ origin: n, nation, isFleet, friendlyFleets, isOccupied }, out.concat([n])));
      // Army maneuvering to foreign land
      } else if (!isFleet && !this.graph.get(n).isOcean) {
        return out.concat([n]);
      // Army convoying over ocean
      } else if (!isFleet && this.graph.get(n).isOcean && friendlyFleets.has(n)) {
        console.log("HI")
        return out.concat(this.pathsFrom({ origin: n, nation, isFleet, friendlyFleets, isOccupied }, out.concat([n])));
      }
    }

    return out;
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

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

  neighborsFor({ origin, nation, isFleet, friendlyFleets }) {
    this.validate(origin);

    const out = new Set();

    // Add all immediate neighbors
    for (const n of this.graph.get(origin).neighbors) {
      out.add(n);
    }

    // Add all home provinces if origin is in their home nation
    if (nation === this.graph.get(origin).nation && !isFleet) {
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

  validate(origin) {
    if (!this.graph.has(origin))
      throw new Error(
        `province ${origin} not found. Available provinces are: ${[
          ...this.graph.keys()
        ]}`
      );
  }
}

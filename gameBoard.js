export default class GameBoard {
  constructor({ nodes, edges }) {
    this.graph = new Map();
    this.byNation = new Map();

    for (const [province, nation] of nodes) {
      this.graph.set(province, {
        nation,
        neighbors: new Set(),
      });
      if (!this.byNation.has(nation)) {
        this.byNation.set(nation, new Set());
      }
      this.byNation.get(nation).add(province);
    }
    edges.forEach(([a, b]) => {
      this.graph.get(a).neighbors.add(b);
      this.graph.get(b).neighbors.add(a);
    });
  }

  neighborsFor({ province, nation }) {
    if (!this.graph.has(province))
      throw new Error(`province ${province} not found`);

    let out = new Set();
    for (const neighbor of this.graph.get(province).neighbors) {
      out.add(neighbor);

      for (const neighborOfNeighbor of this.graph.get(neighbor).neighbors) {
        if (this.byNation.get(nation).has(neighbor)) {
          out.add(neighborOfNeighbor);

          out = this.addNeighbor(nation, neighborOfNeighbor, out);
        }
      }
    }

    out.delete(province);

    return out;
  }

  addNeighbor(nation, neighbor, out) {
    for (const neighborOfNeighbor of this.graph.get(neighbor).neighbors) {
      if (this.byNation.get(nation).has(neighbor)) {
        out.add(neighborOfNeighbor);
      }
    }
    return out;
    // this.addNeighbor(nation);
  }
}

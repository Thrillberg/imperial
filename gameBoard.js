export default class GameBoard {
  constructor(nodes, edges) {
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
    if (!this.byNation.has(nation))
      throw new Error(`nation ${nation} not found`);

    const out = new Set();
    for (const p of this.byNation.get(nation)) {
      for (const n of this.graph.get(p).neighbors) {
        out.add(n);
      }
    }
    out.delete(province);

    return out;
  }
}

export default class GameBoard {
  constructor(nodes, edges) {
    this.graph = new Map();
    for (const [province, nation] of nodes) {
      this.graph.set(province, new Set());
    }
    edges.forEach(([a, b]) => {
      this.graph.get(a).add(b);
      this.graph.get(b).add(a);
    });
  }

  neighborsFor({ province }) {
    return this.graph.get(province);
  }
}

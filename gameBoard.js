import Neighbors from "./neighbors";

export default class GameBoard {
  constructor({ nodes, edges }) {
    this.graph = new Map();
    this.byNation = new Map();

    this.setupGraph(nodes);
    this.setImmediateNeighbors(edges);
  }

  setupGraph(nodes) {
    for (const { name: province, nation, isOcean } of nodes) {
      this.graph.set(province, {
        nation,
        neighbors: new Set(),
        isOcean,
        units: null,
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

  neighborsFor(province) {
    this.validate(province);

    const neighbors = new Neighbors(province);
    neighbors.populate(this.graph, this.byNation);
    neighbors.addConvoyDestinations(this.graph);
    neighbors.removeImpassableDestinations(this.graph);

    return neighbors.toSet;
  }

  validate({ province }) {
    if (!this.graph.has(province))
      throw new Error(`province ${province} not found`);
  }
}

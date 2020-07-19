export default class GameBoard {
  constructor({ nodes, edges, units }) {
    this.graph = new Map();
    this.byNation = new Map();

    for (const { name: province, nation, isOcean } of nodes) {
      this.graph.set(province, {
        nation,
        neighbors: new Set(),
        isOcean,
        units,
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

  neighborsFor({ province, nation, isFleet }) {
    if (!this.graph.has(province))
      throw new Error(`province ${province} not found`);

    const currentProvince = this.graph.get(province);
    let out = new Set();
    if (currentProvince.nation !== nation) {
      out = currentProvince.neighbors;
    } else {
      const nationProvinces = this.byNation.get(nation);
      for (const nationProvince of nationProvinces) {
        const nationNeighbors = this.graph.get(nationProvince).neighbors;
        for (const neighbor of nationNeighbors) {
          out.add(neighbor);
        }
      }
    }

    if (!isFleet) {
      for (const province of out) {
        if (this.graph.get(province).isOcean) {
          for (const neighbor of this.graph.get(province).neighbors) {
            out.add(neighbor);
          }
        }
      }
    }

    for (const province of out) {
      if (isFleet ^ this.graph.get(province).isOcean) {
        out.delete(province);
      }
    }

    out.delete(province);
    return out;
  }
}

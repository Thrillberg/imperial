export default class Neighbors {
  constructor({ province, nation, isFleet }) {
    this.province = province;
    this.nation = nation;
    this.isFleet = isFleet;
    this.toSet = new Set();
  }

  populate(graph, byNation) {
    const currentProvince = graph.get(this.province);

    if (currentProvince.nation !== this.nation) {
      this.toSet = currentProvince.neighbors;
    } else {
      const nationProvinces = byNation.get(this.nation);
      for (const nationProvince of nationProvinces) {
        const nationNeighbors = graph.get(nationProvince).neighbors;
        for (const neighbor of nationNeighbors) {
          this.toSet.add(neighbor);
        }
      }
    }
  }

  addConvoyDestinations(graph) {
    if (!this.isFleet) {
      for (const province of this.toSet) {
        if (
          graph.get(province).isOcean &&
          graph.get(province).units.find((unit) => unit.nation === this.nation)
        ) {
          for (const neighbor of graph.get(province).neighbors) {
            this.toSet.add(neighbor);
          }
        }
      }
    }
  }

  removeImpassableDestinations(graph) {
    for (const province of this.toSet) {
      if (this.isFleet ^ graph.get(province).isOcean) {
        this.toSet.delete(province);
      }
    }

    this.toSet.delete(this.province);
  }
}

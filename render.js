export default ({ nodes, edges }) => {
  console.log(`strict graph board {
node [style=filled,fillcolor=black]; overlap=false; splines=true;`);

  for (const { nation, isOcean, factoryType, isHome, name } of nodes) {
    if (isOcean !== undefined) {
      // neutral province
      if (isOcean) {
        console.log(`${name} [fillcolor=azure,id=${name}];`);
      } else {
        console.log(`${name} [fillcolor=whitesmoke,id=${name}];`);
      }
    } else {
      // national province
      const fill = nation.when({
        IT: () => "lightgreen",
        RU: () => "orchid",
        GE: () => "silver",
        GB: () => "salmon",
        FR: () => "deepskyblue",
        AH: () => "yellow",
      });
      const components = [`fillcolor=${fill}`, `id=${name}`];
      switch (factoryType) {
        case "armaments":
          components.push("shape=box");
          break;
        case "shipyard":
          components.push("shape=diamond");
          break;
        default:
          throw new Error(`unhandled: ${factoryType}`);
      }
      if (isHome) {
        components.push("peripheries=2");
      }
      console.log(`${name} [${components.join(",")}];`);
    }
  }

  for (const [a, b] of edges) {
    console.log(`${a} -- ${b};`);
  }

  console.log("}");
};

import { Nation } from "./constants";

export default () => {
  const provinces = [
    "algeria",
    "baltic sea",
    "bay of biscay",
    "berlin",
    "black sea",
    "bordeaux",
    "brest",
    "budapest",
    "bulgaria",
    "cologne",
    "danzig",
    "dijon",
    "dublin",
    "edinburgh",
    "english channel",
    "florence",
    "genoa",
    "hamburg",
    "ionian sea",
    "kiev",
    "lemberg",
    "liverpool",
    "london",
    "marseille",
    "morocco",
    "moscow",
    "munich",
    "naples",
    "north atlantic",
    "north sea",
    "norway",
    "odessa",
    "paris",
    "prague",
    "romania",
    "rome",
    "sheffield",
    "spain",
    "st. petersburg",
    "sweden",
    "trieste",
    "tunis",
    "turkey",
    "venice",
    "vienna",
    "warsaw",
    "west balkan",
    "western mediterranean sea",
  ];
  const nations = ["AH", "IT", "FR", "GB", "GE", "RU"];

  const out = new Map();

  const unitlessNations = () => {
    const map = new Map();
    for (const n of nations) {
      map.set(n, { fleets: 0, armies: 0 });
    }
    return map;
  };

  const hasFactory = (p) => {
    const factoryProvinces = [
      "vienna",
      "budapest",
      "paris",
      "bordeaux",
      "london",
      "liverpool",
      "berlin",
      "hamburg",
      "rome",
      "naples",
      "odessa",
      "moscow",
    ];

    if (factoryProvinces.includes(p)) {
      return true;
    }

    return false;
  };

  const homeNation = (p) => {
    if (["vienna", "budapest", "prague", "lemberg", "trieste"].includes(p)) {
      return Nation.AH;
    } else if (["rome", "naples", "genoa", "venice", "florence"].includes(p)) {
      return Nation.IT;
    } else if (
      ["paris", "bordeaux", "marseille", "dijon", "brest"].includes(p)
    ) {
      return Nation.FR;
    } else if (
      ["london", "liverpool", "dublin", "edinburgh", "sheffield"].includes(p)
    ) {
      return Nation.GB;
    } else if (
      ["berlin", "hamburg", "munich", "danzig", "cologne"].includes(p)
    ) {
      return Nation.GE;
    } else if (
      ["moscow", "st. petersburg", "odessa", "kiev", "warsaw"].includes(p)
    ) {
      return Nation.RU;
    } else {
      return null;
    }
  };

  const isOcean = (p) => {
    const oceanProvinces = [
      "baltic sea",
      "bay of biscay",
      "black sea",
      "english channel",
      "ionian sea",
      "north atlantic",
      "north sea",
      "western mediterranean sea",
    ];

    if (oceanProvinces.includes(p)) {
      return true;
    }

    return false;
  };

  for (const p of provinces) {
    out.set(p, {
      flag: null,
      hasFactory: hasFactory(p),
      homeNation: homeNation(p),
      isOcean: isOcean(p),
      // TODO: Remove unitCount
      unitCount: 0,
      units: unitlessNations(),
    });
  }

  return out;
};

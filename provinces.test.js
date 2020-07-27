import { Nation } from "./constants";
import Provinces from "./provinces";

describe("provinces", () => {
  const nations = ["AH", "IT", "FR", "GB", "GE", "RU"];

  test("units", () => {
    const unitlessNations = new Map();
    for (const n of nations) {
      unitlessNations.set(n, { fleets: 0, armies: 0 });
    }

    const provinces = new Map();
    for (const p of [
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
    ]) {
      provinces.set(p, { units: unitlessNations });
    }

    expect(Provinces).toEqual(new Map(provinces));
  });
});

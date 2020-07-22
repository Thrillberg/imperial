import { Enum } from "./enum.js";

const Nation = Enum.fromArray(["AH", "IT", "FR", "GB", "GE", "RU"], "Nation");

const bondCosts = { 1: 2, 2: 4, 3: 6, 4: 9, 5: 12, 6: 16, 7: 20, 8: 25, 9: 30 };
const bonds = (nation) =>
  new Map(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => [
      number,
      Object.freeze({ nation, number, cost: bondCosts[number] }),
    ])
  );

const Bond = new Map(
  [
    Nation.AH,
    Nation.IT,
    Nation.FR,
    Nation.GB,
    Nation.GE,
    Nation.RU,
  ].map((nation) => [nation, bonds(nation)])
);

export { Bond, Nation };

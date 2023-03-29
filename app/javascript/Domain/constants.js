import Enum from './enum';
import memoize from './memo';

const Nation = Enum.fromArray(['AH', 'IT', 'FR', 'GB', 'GE', 'RU'], 'Nation');
const Nation2030 = Enum.fromArray(['RU', 'CN', 'IN', 'BR', 'US', 'EU'], 'Nation2030');
const NationAsia = Enum.fromArray(['CN', 'JP', 'FR', 'GB', 'TR', 'RU', 'GE'], 'NationAsia');

const cost = {
  1: 2,
  2: 4,
  3: 6,
  4: 9,
  5: 12,
  6: 16,
  7: 20,
  8: 25,
  9: 30,
};
export const Bond = memoize((nation, number) => ({
  nation,
  number,
  cost: cost[number],
}));
export const AllBonds = () => new Set(
  ['AH', 'IT', 'FR', 'GB', 'GE', 'RU']
    .map((nation) => Object.keys(cost).map((number) => Bond(Nation[nation], parseInt(number, 10))))
    .flat(),
);
export const AllBonds2030 = () => new Set(
  ['RU', 'CN', 'IN', 'BR', 'US', 'EU']
    .map((nation) => Object.keys(cost).map(
      (number) => Bond(Nation2030[nation], parseInt(number, 10)),
    ))
    .flat(),
);
export const AllBondsAsia = () => new Set(
  ['CN', 'JP', 'FR', 'GB', 'TR', 'RU', 'GE']
    .map((nation) => Object.keys(cost).map(
      (number) => Bond(NationAsia[nation], parseInt(number, 10)),
    ))
    .flat(),
);

export { Nation, Nation2030, NationAsia };

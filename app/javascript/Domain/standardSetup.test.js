import setup from './standardSetup';
import { AllBonds, Bond, Nation } from './constants';

describe('Imperial', () => {
  describe('constructor', () => {
    describe('six players', () => {
      const payload = {
        players: [
          { id: 'a', nation: Nation.RU },
          { id: 'b', nation: Nation.FR },
          { id: 'c', nation: Nation.GB },
          { id: 'd', nation: Nation.AH },
          { id: 'e', nation: Nation.IT },
          { id: 'f', nation: Nation.GE },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order mirrors players array', () => {
        expect(actual.order).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
      });

      test('bond assignments', () => {
        expect(actual.players).toEqual({
          a: {
            name: 'a',
            cash: 2,
            bonds: new Set([Bond(Nation.RU, 4), Bond(Nation.FR, 1)]),
            rawScore: 0,
          },
          b: {
            name: 'b',
            cash: 2,
            bonds: new Set([Bond(Nation.FR, 4), Bond(Nation.AH, 1)]),
            rawScore: 0,
          },
          c: {
            name: 'c',
            cash: 2,
            bonds: new Set([Bond(Nation.GB, 4), Bond(Nation.RU, 1)]),
            rawScore: 0,
          },
          d: {
            name: 'd',
            cash: 2,
            bonds: new Set([Bond(Nation.AH, 4), Bond(Nation.GE, 1)]),
            rawScore: 0,
          },
          e: {
            name: 'e',
            cash: 2,
            bonds: new Set([Bond(Nation.IT, 4), Bond(Nation.GB, 1)]),
            rawScore: 0,
          },
          f: {
            name: 'f',
            cash: 2,
            bonds: new Set([Bond(Nation.GE, 4), Bond(Nation.IT, 1)]),
            rawScore: 0,
          },
        });
      });

      test('nations', () => {
        const expected = new Map(
          [
            [Nation.RU, 'a'],
            [Nation.FR, 'b'],
            [Nation.GB, 'c'],
            [Nation.AH, 'd'],
            [Nation.IT, 'e'],
            [Nation.GE, 'f'],
          ].map(([k, v]) => [
            k,
            {
              controller: v,
              treasury: 11,
              rondelPosition: null,
              taxChartPosition: 5,
              flagCount: 0,
              powerPoints: 0,
            },
          ]),
        );
        expect(actual.nations).toEqual(expected);
      });

      test('investor card holder', () => {
        expect(actual.investorCardHolder).toEqual('e');
      });

      test('available bonds', () => {
        const expected = AllBonds();
        for (const n of Nation) {
          n.when({
            IT: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            FR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            AH: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GE: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GB: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            RU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
          });
        }
        expect(actual.availableBonds).toEqual(expected);
      });
    });

    describe('five players', () => {
      const payload = {
        players: [
          { id: 'a', nation: Nation.RU },
          { id: 'b', nation: Nation.FR },
          { id: 'c', nation: Nation.GB },
          { id: 'd', nation: Nation.GE },
          { id: 'e', nation: Nation.IT },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order', () => {
        expect(actual.order).toEqual(['a', 'b', 'c', 'd', 'e']);
      });

      test('bond assignments', () => {
        expect(actual.players).toEqual({
          a: {
            name: 'a',
            cash: 2,
            bonds: new Set([Bond(Nation.RU, 4), Bond(Nation.FR, 1)]),
            rawScore: 0,
          },
          b: {
            name: 'b',
            cash: 2,
            bonds: new Set([Bond(Nation.FR, 4), Bond(Nation.AH, 1)]),
            rawScore: 0,
          },
          c: {
            name: 'c',
            cash: 2,
            bonds: new Set([Bond(Nation.GB, 4), Bond(Nation.RU, 1)]),
            rawScore: 0,
          },
          d: {
            name: 'd',
            cash: 2,
            bonds: new Set([Bond(Nation.GE, 4), Bond(Nation.IT, 1)]),
            rawScore: 0,
          },
          e: {
            name: 'e',
            cash: 2,
            bonds: new Set([Bond(Nation.IT, 4), Bond(Nation.GB, 1)]),
            rawScore: 0,
          },
        });
      });

      test('nations', () => {
        const expected = new Map(
          [
            [Nation.RU, 'a', 11],
            [Nation.FR, 'b', 11],
            [Nation.GB, 'c', 11],
            [Nation.GE, 'd', 9], // Nobody bought GE 2
            [Nation.IT, 'e', 11],
            [Nation.AH, 'b', 2], // FR controller bought AH 2
          ].map(([nation, controller, treasury]) => [
            nation,
            {
              controller,
              treasury,
              rondelPosition: null,
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
            },
          ]),
        );
        expect(actual.nations).toEqual(expected);
      });

      test('investor card holder', () => {
        expect(actual.investorCardHolder).toEqual('c');
      });

      test('available bonds', () => {
        const expected = AllBonds();
        for (const n of Nation) {
          n.when({
            IT: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            FR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            AH: () => {
              expected.delete(Bond(n, 1));
              // Nobody bought AH 9
            },
            GE: () => {
              // Nobody bought GE 2
              expected.delete(Bond(n, 4));
            },
            GB: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            RU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
          });
        }
        expect(actual.availableBonds).toEqual(expected);
      });
    });

    describe('four players', () => {
      const payload = {
        players: [
          { id: 'a', nation: Nation.IT },
          { id: 'b', nation: Nation.FR },
          { id: 'c', nation: Nation.AH },
          { id: 'd', nation: Nation.GE },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order', () => {
        expect(actual.order).toEqual(['a', 'b', 'c', 'd']);
      });

      test('bond assignments', () => {
        expect(actual.players).toEqual({
          a: {
            name: 'a',
            cash: 2,
            bonds: new Set([Bond(Nation.IT, 4), Bond(Nation.GB, 1)]),
            rawScore: 0,
          },
          b: {
            name: 'b',
            cash: 2,
            bonds: new Set([Bond(Nation.FR, 4), Bond(Nation.AH, 1)]),
            rawScore: 0,
          },
          c: {
            name: 'c',
            cash: 2,
            bonds: new Set([Bond(Nation.AH, 4), Bond(Nation.GE, 1)]),
            rawScore: 0,
          },
          d: {
            name: 'd',
            cash: 2,
            bonds: new Set([Bond(Nation.GE, 4), Bond(Nation.IT, 1)]),
            rawScore: 0,
          },
        });
      });

      test('nations', () => {
        const expected = new Map(
          [
            [Nation.IT, 'a', 11],
            [Nation.FR, 'b', 9], // Nobody bought FR 2
            [Nation.AH, 'c', 11],
            [Nation.GE, 'd', 11],
            [Nation.GB, 'a', 2], // IT controller bought GB 2
            [Nation.RU, null, 0], // Nobody bought RU 2 or RU 9
          ].map(([nation, controller, treasury]) => [
            nation,
            {
              controller,
              treasury,
              rondelPosition: null,
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
            },
          ]),
        );
        expect(actual.nations).toEqual(expected);
      });

      test('investor card holder', () => {
        expect(actual.investorCardHolder).toEqual('d');
      });

      test('available bonds', () => {
        const expected = AllBonds();
        for (const n of Nation) {
          n.when({
            IT: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            FR: () => {
              // Nobody bought FR 2
              expected.delete(Bond(n, 4));
            },
            AH: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GE: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GB: () => {
              expected.delete(Bond(n, 1));
              // Nobody bought GB 9
            },
            RU: () => {
              // Nobody bought RU 2
              // Nobody bought RU 9
            },
          });
        }
        expect(actual.availableBonds).toEqual(expected);
      });
    });

    describe('three players', () => {
      const payload = {
        players: [
          { id: 'a', nation: Nation.IT },
          { id: 'b', nation: Nation.FR },
          { id: 'c', nation: Nation.AH },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order', () => {
        expect(actual.order).toEqual(['a', 'b', 'c']);
      });

      test('bond assignments', () => {
        expect(actual.players).toEqual({
          a: {
            name: 'a',
            cash: 2,
            bonds: new Set([
              Bond(Nation.IT, 4),
              Bond(Nation.GB, 1),
              Bond(Nation.RU, 4),
              Bond(Nation.FR, 1),
            ]),
            rawScore: 0,
          },
          b: {
            name: 'b',
            cash: 2,
            bonds: new Set([
              Bond(Nation.FR, 4),
              Bond(Nation.AH, 1),
              Bond(Nation.GE, 4),
              Bond(Nation.IT, 1),
            ]),
            rawScore: 0,
          },
          c: {
            name: 'c',
            cash: 2,
            bonds: new Set([
              Bond(Nation.AH, 4),
              Bond(Nation.GE, 1),
              Bond(Nation.GB, 4),
              Bond(Nation.RU, 1),
            ]),
            rawScore: 0,
          },
        });
      });

      // Great Britain to Austria-Hungary
      // Russia to Italy
      // Germany to France
      test('nations', () => {
        const expected = new Map(
          [
            [Nation.IT, 'a', 11],
            [Nation.FR, 'b', 11],
            [Nation.AH, 'c', 11],
            [Nation.RU, 'a', 11],
            [Nation.GE, 'b', 11],
            [Nation.GB, 'c', 11],
          ].map(([nation, controller, treasury]) => [
            nation,
            {
              controller,
              treasury,
              rondelPosition: null,
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
            },
          ]),
        );
        expect(actual.nations).toEqual(expected);
      });

      test('investor card holder', () => {
        expect(actual.investorCardHolder).toEqual('a');
      });

      test('available bonds', () => {
        const expected = AllBonds();
        for (const n of Nation) {
          n.when({
            IT: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            FR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            AH: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GE: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GB: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            RU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
          });
        }
        expect(actual.availableBonds).toEqual(expected);
      });
    });

    describe('two players', () => {
      const payload = {
        players: [
          { id: 'b', nation: Nation.AH },
          { id: 'a', nation: Nation.IT },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order', () => {
        expect(actual.order).toEqual(['b', 'a']);
      });

      test('bond assignments', () => {
        expect(actual.players).toEqual({
          a: {
            name: 'a',
            cash: 2,
            bonds: new Set([
              Bond(Nation.IT, 4),
              Bond(Nation.GB, 1),
              Bond(Nation.RU, 4),
              Bond(Nation.FR, 1),
              Bond(Nation.GB, 4),
              Bond(Nation.RU, 1),
            ]),
            rawScore: 0,
          },
          b: {
            name: 'b',
            cash: 2,
            bonds: new Set([
              Bond(Nation.AH, 4),
              Bond(Nation.GE, 1),
              Bond(Nation.FR, 4),
              Bond(Nation.AH, 1),
              Bond(Nation.GE, 4),
              Bond(Nation.IT, 1),
            ]),
            rawScore: 0,
          },
        });
      });

      // France and Germany to Austria-Hungary
      // Russia and Great Britain to Italy
      test('nations', () => {
        const expected = new Map(
          [
            [Nation.IT, 'a', 11],
            [Nation.RU, 'a', 11],
            [Nation.GB, 'a', 11],
            [Nation.AH, 'b', 11],
            [Nation.FR, 'b', 11],
            [Nation.GE, 'b', 11],
          ].map(([nation, controller, treasury]) => [
            nation,
            {
              controller,
              treasury,
              rondelPosition: null,
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
            },
          ]),
        );
        expect(actual.nations).toEqual(expected);
      });

      test('investor card holder', () => {
        expect(actual.investorCardHolder).toEqual('a');
      });

      test('available bonds', () => {
        const expected = AllBonds();
        for (const n of Nation) {
          n.when({
            IT: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            FR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            AH: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GE: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GB: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            RU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
          });
        }
        expect(actual.availableBonds).toEqual(expected);
      });
    });
  });
});

import setup from './standard2030Setup';
import { AllBonds2030, Bond, Nation2030 } from './constants';

describe('Imperial 2030', () => {
  describe('constructor', () => {
    describe('six players', () => {
      const payload = {
        players: [
          { id: 'a', nation: Nation2030.US },
          { id: 'b', nation: Nation2030.IN },
          { id: 'c', nation: Nation2030.BR },
          { id: 'd', nation: Nation2030.CN },
          { id: 'e', nation: Nation2030.RU },
          { id: 'f', nation: Nation2030.EU },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order mirrors players array', () => {
        expect(actual.order).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
      });

      test('bond assignments', () => {
        expect(actual.players.size === 6);

        for (const player of actual.players.values()) {
          expect(player.cash).toEqual(2);
          expect(player.score).toEqual(0);
          expect(player.bonds.size).toEqual(2);

          switch (player.id) {
            case 'a':
              expect(player.bonds.has(Bond(Nation2030.US, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.RU, 1))).toEqual(true);
              break;

            case 'b':
              expect(player.bonds.has(Bond(Nation2030.IN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.BR, 1))).toEqual(true);
              break;

            case 'c':
              expect(player.bonds.has(Bond(Nation2030.BR, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.CN, 1))).toEqual(true);
              break;

            case 'd':
              expect(player.bonds.has(Bond(Nation2030.CN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.US, 1))).toEqual(true);
              break;

            case 'e':
              expect(player.bonds.has(Bond(Nation2030.RU, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.EU, 1))).toEqual(true);
              break;

            case 'f':
              expect(player.bonds.has(Bond(Nation2030.EU, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.IN, 1))).toEqual(true);
              break;

            default:
              expect(false).toEqual(true);
              break;
          }
        }
      });

      test('nations', () => {
        const expected = new Map(
          [
            [Nation2030.US, 'a'],
            [Nation2030.IN, 'b'],
            [Nation2030.BR, 'c'],
            [Nation2030.CN, 'd'],
            [Nation2030.RU, 'e'],
            [Nation2030.EU, 'f'],
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
        expect(actual.investorCardHolder).toEqual('f');
      });

      test('available bonds', () => {
        const expected = AllBonds2030();
        for (const n of Nation2030) {
          n.when({
            US: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            IN: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            BR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            CN: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            RU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            EU: () => {
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
          { id: 'a', nation: Nation2030.US },
          { id: 'b', nation: Nation2030.IN },
          { id: 'c', nation: Nation2030.BR },
          { id: 'd', nation: Nation2030.CN },
          { id: 'e', nation: Nation2030.RU },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order', () => {
        expect(actual.order).toEqual(['a', 'b', 'c', 'd', 'e']);
      });

      test('bond assignments', () => {
        expect(actual.players.size === 5);

        for (const player of actual.players.values()) {
          expect(player.cash).toEqual(2);
          expect(player.score).toEqual(0);
          expect(player.bonds.size).toEqual(2);

          switch (player.id) {
            case 'a':
              expect(player.bonds.has(Bond(Nation2030.US, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.RU, 1))).toEqual(true);
              break;

            case 'b':
              expect(player.bonds.has(Bond(Nation2030.IN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.BR, 1))).toEqual(true);
              break;

            case 'c':
              expect(player.bonds.has(Bond(Nation2030.BR, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.CN, 1))).toEqual(true);
              break;

            case 'd':
              expect(player.bonds.has(Bond(Nation2030.CN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.US, 1))).toEqual(true);
              break;

            case 'e':
              expect(player.bonds.has(Bond(Nation2030.RU, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.EU, 1))).toEqual(true);
              break;

            default:
              expect(false).toEqual(true);
              break;
          }
        }
      });

      test('nations', () => {
        const expected = new Map(
          [
            [Nation2030.US, 'a', 11],
            [Nation2030.BR, 'c', 11],
            [Nation2030.CN, 'd', 11],
            [Nation2030.IN, 'b', 9], // Nobody bought IN 2
            [Nation2030.RU, 'e', 11],
            [Nation2030.EU, 'e', 2], // RU controller bought EU 2
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
        const expected = AllBonds2030();
        for (const n of Nation2030) {
          n.when({
            US: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            BR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            EU: () => {
              expected.delete(Bond(n, 1));
              // Nobody bought EU 9
            },
            IN: () => {
              // Nobody bought IN 2
              expected.delete(Bond(n, 4));
            },
            CN: () => {
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
          { id: 'a', nation: Nation2030.US },
          { id: 'b', nation: Nation2030.IN },
          { id: 'c', nation: Nation2030.BR },
          { id: 'd', nation: Nation2030.CN },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order', () => {
        expect(actual.order).toEqual(['a', 'b', 'c', 'd']);
      });

      test('bond assignments', () => {
        expect(actual.players.size === 4);

        for (const player of actual.players.values()) {
          expect(player.cash).toEqual(2);
          expect(player.score).toEqual(0);
          expect(player.bonds.size).toEqual(2);

          switch (player.id) {
            case 'a':
              expect(player.bonds.has(Bond(Nation2030.US, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.RU, 1))).toEqual(true);
              break;

            case 'b':
              expect(player.bonds.has(Bond(Nation2030.IN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.BR, 1))).toEqual(true);
              break;

            case 'c':
              expect(player.bonds.has(Bond(Nation2030.BR, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.CN, 1))).toEqual(true);
              break;

            case 'd':
              expect(player.bonds.has(Bond(Nation2030.CN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.US, 1))).toEqual(true);
              break;

            default:
              expect(false).toEqual(true);
              break;
          }
        }
      });

      test('nations', () => {
        const expected = new Map(
          [
            [Nation2030.US, 'a', 11],
            [Nation2030.IN, 'b', 9], // Nobody bought IN 2
            [Nation2030.BR, 'c', 11],
            [Nation2030.CN, 'd', 11],
            [Nation2030.RU, 'a', 2], // US controller bought RU 2
            [Nation2030.EU, null, 0], // Nobody bought EU 2 or EU 9
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
        expect(actual.investorCardHolder).toEqual('b');
      });

      test('available bonds', () => {
        const expected = AllBonds2030();
        for (const n of Nation2030) {
          n.when({
            US: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            IN: () => {
              // Nobody bought IN 2
              expected.delete(Bond(n, 4));
            },
            BR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            CN: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            RU: () => {
              expected.delete(Bond(n, 1));
              // Nobody bought RU 9
            },
            EU: () => {
              // Nobody bought EU 2
              // Nobody bought EU 9
            },
          });
        }
        expect(actual.availableBonds).toEqual(expected);
      });
    });

    describe('three players', () => {
      const payload = {
        players: [
          { id: 'a', nation: Nation2030.RU },
          { id: 'b', nation: Nation2030.CN },
          { id: 'c', nation: Nation2030.IN },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order', () => {
        expect(actual.order).toEqual(['a', 'b', 'c']);
      });

      test('bond assignments', () => {
        expect(actual.players.size === 3);

        for (const player of actual.players.values()) {
          expect(player.cash).toEqual(2);
          expect(player.score).toEqual(0);
          expect(player.bonds.size).toEqual(2);

          switch (player.id) {
            case 'a':
              expect(player.bonds.has(Bond(Nation2030.RU, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.EU, 1))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.BR, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.CN, 1))).toEqual(true);
              break;

            case 'b':
              expect(player.bonds.has(Bond(Nation2030.CN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.US, 1))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.EU, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.IN, 1))).toEqual(true);
              break;

            case 'c':
              expect(player.bonds.has(Bond(Nation2030.IN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.BR, 1))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.US, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.RU, 1))).toEqual(true);
              break;

            default:
              expect(false).toEqual(true);
              break;
          }
        }
      });

      test('nations', () => {
        const expected = new Map(
          [
            [Nation2030.RU, 'a', 11],
            [Nation2030.CN, 'b', 11],
            [Nation2030.IN, 'c', 11],
            [Nation2030.BR, 'a', 11],
            [Nation2030.EU, 'b', 11],
            [Nation2030.US, 'c', 11],
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
        expect(actual.investorCardHolder).toEqual('b');
      });

      test('available bonds', () => {
        const expected = AllBonds2030();
        for (const n of Nation2030) {
          n.when({
            RU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            CN: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            IN: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            BR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            EU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            US: () => {
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
          { id: 'b', nation: Nation2030.RU },
          { id: 'a', nation: Nation2030.CN },
        ],
        provinceNames: new Set(['1', '2']),
      };
      const actual = setup(payload);

      test('seating order', () => {
        expect(actual.order).toEqual(['b', 'a']);
      });

      test('bond assignments', () => {
        expect(actual.players.size === 2);

        for (const player of actual.players.values()) {
          expect(player.cash).toEqual(2);
          expect(player.score).toEqual(0);
          expect(player.bonds.size).toEqual(2);

          switch (player.id) {
            case 'a':
              expect(player.bonds.has(Bond(Nation2030.CN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.US, 1))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.EU, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.IN, 1))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.BR, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.CN, 1))).toEqual(true);
              break;

            case 'b':
              expect(player.bonds.has(Bond(Nation2030.RU, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.EU, 1))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.IN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.BR, 1))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.US, 4))).toEqual(true);
              expect(player.bonds.has(Bond(Nation2030.RU, 1))).toEqual(true);
              break;

            default:
              expect(false).toEqual(true);
              break;
          }
        }
      });

      test('nations', () => {
        const expected = new Map(
          [
            [Nation2030.CN, 'a', 11],
            [Nation2030.BR, 'a', 11],
            [Nation2030.EU, 'a', 11],
            [Nation2030.RU, 'b', 11],
            [Nation2030.IN, 'b', 11],
            [Nation2030.US, 'b', 11],
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
        const expected = AllBonds2030();
        for (const n of Nation2030) {
          n.when({
            RU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            CN: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            IN: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            BR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            EU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            US: () => {
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

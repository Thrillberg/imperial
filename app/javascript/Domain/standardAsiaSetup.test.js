import setup from './standardAsiaSetup';
import { AllBondsAsia, Bond, NationAsia } from './constants';

describe('Imperial Asia', () => {
  describe('constructor', () => {
    describe('six players', () => {
      const payload = {
        players: [
          { id: 'a', nation: NationAsia.CN },
          { id: 'b', nation: NationAsia.JP },
          { id: 'c', nation: NationAsia.FR },
          { id: 'd', nation: NationAsia.GB },
          { id: 'e', nation: NationAsia.TR },
          { id: 'f', nation: NationAsia.RU },
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
              expect(player.bonds.has(Bond(NationAsia.CN, 4))).toEqual(true);
              expect(player.bonds.has(Bond(NationAsia.GE, 1))).toEqual(true);
              break;

            case 'b':
              expect(player.bonds.has(Bond(NationAsia.JP, 4))).toEqual(true);
              expect(player.bonds.has(Bond(NationAsia.CN, 1))).toEqual(true);
              break;

            case 'c':
              expect(player.bonds.has(Bond(NationAsia.FR, 4))).toEqual(true);
              expect(player.bonds.has(Bond(NationAsia.TR, 1))).toEqual(true);
              break;

            case 'd':
              expect(player.bonds.has(Bond(NationAsia.GB, 4))).toEqual(true);
              expect(player.bonds.has(Bond(NationAsia.RU, 1))).toEqual(true);
              break;

            case 'e':
              expect(player.bonds.has(Bond(NationAsia.TR, 4))).toEqual(true);
              expect(player.bonds.has(Bond(NationAsia.JP, 1))).toEqual(true);
              break;

            case 'f':
              expect(player.bonds.has(Bond(NationAsia.RU, 4))).toEqual(true);
              expect(player.bonds.has(Bond(NationAsia.FR, 1))).toEqual(true);
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
            [NationAsia.CN, 'a'],
            [NationAsia.JP, 'b'],
            [NationAsia.FR, 'c'],
            [NationAsia.GB, 'd'],
            [NationAsia.TR, 'e'],
            [NationAsia.RU, 'f'],
            [NationAsia.GE, 'a'],
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
        // We make the following modifications because GE is a 7th Nation
        // but we still only have 6 players
        expected.get(NationAsia.GB).treasury = 9;
        expected.get(NationAsia.GE).treasury = 2;

        expect(actual.nations).toEqual(expected);
      });

      test('investor card holder', () => {
        expect(actual.investorCardHolder).toEqual('b');
      });

      test('available bonds', () => {
        const expected = AllBondsAsia();
        for (const n of NationAsia) {
          n.when({
            CN: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            JP: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            FR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GB: () => {
              expected.delete(Bond(n, 4));
            },
            TR: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            RU: () => {
              expected.delete(Bond(n, 1));
              expected.delete(Bond(n, 4));
            },
            GE: () => {
              expected.delete(Bond(n, 1));
            },
          });
        }
        expect(actual.availableBonds).toEqual(expected);
      });
    });

    // TODO: Fix these tests!

    // describe('five players', () => {
    //   const payload = {
    //     players: [
    //       { id: 'a', nation: NationAsia.US },
    //       { id: 'b', nation: NationAsia.IN },
    //       { id: 'c', nation: NationAsia.BR },
    //       { id: 'd', nation: NationAsia.CN },
    //       { id: 'e', nation: NationAsia.RU },
    //     ],
    //     provinceNames: new Set(['1', '2']),
    //   };
    //   const actual = setup(payload);

    //   test('seating order', () => {
    //     expect(actual.order).toEqual(['a', 'b', 'c', 'd', 'e']);
    //   });

    //   test('bond assignments', () => {
    //     expect(actual.players).toEqual({
    //       a: {
    //         name: 'a',
    //         cash: 2,
    //         bonds: new Set([Bond(NationAsia.US, 4), Bond(NationAsia.RU, 1)]),
    //         rawScore: 0,
    //       },
    //       b: {
    //         name: 'b',
    //         cash: 2,
    //         bonds: new Set([Bond(NationAsia.IN, 4), Bond(NationAsia.BR, 1)]),
    //         rawScore: 0,
    //       },
    //       c: {
    //         name: 'c',
    //         cash: 2,
    //         bonds: new Set([Bond(NationAsia.BR, 4), Bond(NationAsia.CN, 1)]),
    //         rawScore: 0,
    //       },
    //       d: {
    //         name: 'd',
    //         cash: 2,
    //         bonds: new Set([Bond(NationAsia.CN, 4), Bond(NationAsia.US, 1)]),
    //         rawScore: 0,
    //       },
    //       e: {
    //         name: 'e',
    //         cash: 2,
    //         bonds: new Set([Bond(NationAsia.RU, 4), Bond(NationAsia.EU, 1)]),
    //         rawScore: 0,
    //       },
    //     });
    //   });

    //   test('nations', () => {
    //     const expected = new Map(
    //       [
    //         [NationAsia.US, 'a', 11],
    //         [NationAsia.BR, 'c', 11],
    //         [NationAsia.CN, 'd', 11],
    //         [NationAsia.IN, 'b', 9], // Nobody bought IN 2
    //         [NationAsia.RU, 'e', 11],
    //         [NationAsia.EU, 'e', 2], // RU controller bought EU 2
    //       ].map(([nation, controller, treasury]) => [
    //         nation,
    //         {
    //           controller,
    //           treasury,
    //           rondelPosition: null,
    //           flagCount: 0,
    //           powerPoints: 0,
    //           taxChartPosition: 5,
    //         },
    //       ]),
    //     );
    //     expect(actual.nations).toEqual(expected);
    //   });

    //   test('investor card holder', () => {
    //     expect(actual.investorCardHolder).toEqual('a');
    //   });

    //   test('available bonds', () => {
    //     const expected = AllBondsAsia();
    //     for (const n of NationAsia) {
    //       n.when({
    //         US: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         BR: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         EU: () => {
    //           expected.delete(Bond(n, 1));
    //           // Nobody bought EU 9
    //         },
    //         IN: () => {
    //           // Nobody bought IN 2
    //           expected.delete(Bond(n, 4));
    //         },
    //         CN: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         RU: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //       });
    //     }
    //     expect(actual.availableBonds).toEqual(expected);
    //   });
    // });

    // describe('four players', () => {
    //   const payload = {
    //     players: [
    //       { id: 'a', nation: NationAsia.US },
    //       { id: 'b', nation: NationAsia.IN },
    //       { id: 'c', nation: NationAsia.BR },
    //       { id: 'd', nation: NationAsia.CN },
    //     ],
    //     provinceNames: new Set(['1', '2']),
    //   };
    //   const actual = setup(payload);

    //   test('seating order', () => {
    //     expect(actual.order).toEqual(['a', 'b', 'c', 'd']);
    //   });

    //   test('bond assignments', () => {
    //     expect(actual.players).toEqual({
    //       a: {
    //         name: 'a',
    //         cash: 2,
    //         bonds: new Set([Bond(NationAsia.US, 4), Bond(NationAsia.RU, 1)]),
    //         rawScore: 0,
    //       },
    //       b: {
    //         name: 'b',
    //         cash: 2,
    //         bonds: new Set([Bond(NationAsia.IN, 4), Bond(NationAsia.BR, 1)]),
    //         rawScore: 0,
    //       },
    //       c: {
    //         name: 'c',
    //         cash: 2,
    //         bonds: new Set([Bond(NationAsia.BR, 4), Bond(NationAsia.CN, 1)]),
    //         rawScore: 0,
    //       },
    //       d: {
    //         name: 'd',
    //         cash: 2,
    //         bonds: new Set([Bond(NationAsia.CN, 4), Bond(NationAsia.US, 1)]),
    //         rawScore: 0,
    //       },
    //     });
    //   });

    //   test('nations', () => {
    //     const expected = new Map(
    //       [
    //         [NationAsia.US, 'a', 11],
    //         [NationAsia.IN, 'b', 9], // Nobody bought IN 2
    //         [NationAsia.BR, 'c', 11],
    //         [NationAsia.CN, 'd', 11],
    //         [NationAsia.RU, 'a', 2], // US controller bought RU 2
    //         [NationAsia.EU, null, 0], // Nobody bought EU 2 or EU 9
    //       ].map(([nation, controller, treasury]) => [
    //         nation,
    //         {
    //           controller,
    //           treasury,
    //           rondelPosition: null,
    //           flagCount: 0,
    //           powerPoints: 0,
    //           taxChartPosition: 5,
    //         },
    //       ]),
    //     );
    //     expect(actual.nations).toEqual(expected);
    //   });

    //   test('investor card holder', () => {
    //     expect(actual.investorCardHolder).toEqual('b');
    //   });

    //   test('available bonds', () => {
    //     const expected = AllBondsAsia();
    //     for (const n of NationAsia) {
    //       n.when({
    //         US: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         IN: () => {
    //           // Nobody bought IN 2
    //           expected.delete(Bond(n, 4));
    //         },
    //         BR: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         CN: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         RU: () => {
    //           expected.delete(Bond(n, 1));
    //           // Nobody bought RU 9
    //         },
    //         EU: () => {
    //           // Nobody bought EU 2
    //           // Nobody bought EU 9
    //         },
    //       });
    //     }
    //     expect(actual.availableBonds).toEqual(expected);
    //   });
    // });

    // describe('three players', () => {
    //   const payload = {
    //     players: [
    //       { id: 'a', nation: NationAsia.RU },
    //       { id: 'b', nation: NationAsia.CN },
    //       { id: 'c', nation: NationAsia.IN },
    //     ],
    //     provinceNames: new Set(['1', '2']),
    //   };
    //   const actual = setup(payload);

    //   test('seating order', () => {
    //     expect(actual.order).toEqual(['a', 'b', 'c']);
    //   });

    //   test('bond assignments', () => {
    //     expect(actual.players).toEqual({
    //       a: {
    //         name: 'a',
    //         cash: 2,
    //         bonds: new Set([
    //           Bond(NationAsia.RU, 4),
    //           Bond(NationAsia.EU, 1),
    //           Bond(NationAsia.BR, 4),
    //           Bond(NationAsia.CN, 1),
    //         ]),
    //         rawScore: 0,
    //       },
    //       b: {
    //         name: 'b',
    //         cash: 2,
    //         bonds: new Set([
    //           Bond(NationAsia.CN, 4),
    //           Bond(NationAsia.US, 1),
    //           Bond(NationAsia.EU, 4),
    //           Bond(NationAsia.IN, 1),
    //         ]),
    //         rawScore: 0,
    //       },
    //       c: {
    //         name: 'c',
    //         cash: 2,
    //         bonds: new Set([
    //           Bond(NationAsia.IN, 4),
    //           Bond(NationAsia.BR, 1),
    //           Bond(NationAsia.US, 4),
    //           Bond(NationAsia.RU, 1),
    //         ]),
    //         rawScore: 0,
    //       },
    //     });
    //   });

    //   test('nations', () => {
    //     const expected = new Map(
    //       [
    //         [NationAsia.RU, 'a', 11],
    //         [NationAsia.CN, 'b', 11],
    //         [NationAsia.IN, 'c', 11],
    //         [NationAsia.BR, 'a', 11],
    //         [NationAsia.EU, 'b', 11],
    //         [NationAsia.US, 'c', 11],
    //       ].map(([nation, controller, treasury]) => [
    //         nation,
    //         {
    //           controller,
    //           treasury,
    //           rondelPosition: null,
    //           flagCount: 0,
    //           powerPoints: 0,
    //           taxChartPosition: 5,
    //         },
    //       ]),
    //     );
    //     expect(actual.nations).toEqual(expected);
    //   });

    //   test('investor card holder', () => {
    //     expect(actual.investorCardHolder).toEqual('b');
    //   });

    //   test('available bonds', () => {
    //     const expected = AllBondsAsia();
    //     for (const n of NationAsia) {
    //       n.when({
    //         RU: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         CN: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         IN: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         BR: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         EU: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         US: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //       });
    //     }
    //     expect(actual.availableBonds).toEqual(expected);
    //   });
    // });

    // describe('two players', () => {
    //   const payload = {
    //     players: [
    //       { id: 'b', nation: NationAsia.RU },
    //       { id: 'a', nation: NationAsia.CN },
    //     ],
    //     provinceNames: new Set(['1', '2']),
    //   };
    //   const actual = setup(payload);

    //   test('seating order', () => {
    //     expect(actual.order).toEqual(['b', 'a']);
    //   });

    //   test('bond assignments', () => {
    //     expect(actual.players).toEqual({
    //       a: {
    //         name: 'a',
    //         cash: 2,
    //         bonds: new Set([
    //           Bond(NationAsia.CN, 4),
    //           Bond(NationAsia.US, 1),
    //           Bond(NationAsia.BR, 4),
    //           Bond(NationAsia.CN, 1),
    //           Bond(NationAsia.EU, 4),
    //           Bond(NationAsia.IN, 1),
    //         ]),
    //         rawScore: 0,
    //       },
    //       b: {
    //         name: 'b',
    //         cash: 2,
    //         bonds: new Set([
    //           Bond(NationAsia.RU, 4),
    //           Bond(NationAsia.EU, 1),
    //           Bond(NationAsia.IN, 4),
    //           Bond(NationAsia.BR, 1),
    //           Bond(NationAsia.US, 4),
    //           Bond(NationAsia.RU, 1),
    //         ]),
    //         rawScore: 0,
    //       },
    //     });
    //   });

    //   test('nations', () => {
    //     const expected = new Map(
    //       [
    //         [NationAsia.CN, 'a', 11],
    //         [NationAsia.BR, 'a', 11],
    //         [NationAsia.EU, 'a', 11],
    //         [NationAsia.RU, 'b', 11],
    //         [NationAsia.IN, 'b', 11],
    //         [NationAsia.US, 'b', 11],
    //       ].map(([nation, controller, treasury]) => [
    //         nation,
    //         {
    //           controller,
    //           treasury,
    //           rondelPosition: null,
    //           flagCount: 0,
    //           powerPoints: 0,
    //           taxChartPosition: 5,
    //         },
    //       ]),
    //     );
    //     expect(actual.nations).toEqual(expected);
    //   });

    //   test('investor card holder', () => {
    //     expect(actual.investorCardHolder).toEqual('a');
    //   });

    //   test('available bonds', () => {
    //     const expected = AllBondsAsia();
    //     for (const n of NationAsia) {
    //       n.when({
    //         RU: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         CN: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         IN: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         BR: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         EU: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //         US: () => {
    //           expected.delete(Bond(n, 1));
    //           expected.delete(Bond(n, 4));
    //         },
    //       });
    //     }
    //     expect(actual.availableBonds).toEqual(expected);
    //   });
    // });
  });
});

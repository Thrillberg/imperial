import GameBoard from './gameBoard';

describe('GameBoard', () => {
  test('empty', () => {
    const gameBoard = new GameBoard({
      nodes: new Map(),
      edges: [],
    });
    expect(() => gameBoard.neighborsFor({
      origin: 'oops',
      nation: 'big oops',
      friendlyFleets: new Set(),
    })).toThrowError('not found');
  });

  test('edges are undirected', () => {
    const gameBoard = new GameBoard({
      nodes: [
        { name: 'p1', nation: 'n1', isOcean: false },
        { name: 'p2', nation: 'n1', isOcean: false },
      ],
      edges: [['p1', 'p2']],
    });

    expect(
      gameBoard.neighborsFor({
        origin: 'p1',
        nation: 'n1',
        isFleet: false,
        friendlyFleets: new Set(),
      }),
    ).toEqual(['p2']);
    expect(
      gameBoard.neighborsFor({
        origin: 'p2',
        nation: 'n1',
        isFleet: false,
        friendlyFleets: new Set(),
      }),
    ).toEqual(['p1']);
  });

  describe('railroad rule', () => {
    const gameBoard = new GameBoard({
      nodes: [
        { name: '1', nation: 'a', isOcean: false },
        { name: '2', nation: 'a', isOcean: false },
        { name: '3', nation: 'a', isOcean: false },
        { name: '4', nation: 'b', isOcean: false },
        { name: '5', nation: 'b', isOcean: false },
        { name: '6', nation: 'b', isOcean: false },
        { name: '7', isOcean: false },
        { name: '8', isOcean: true },
        { name: '9', isOcean: false },
      ],
      edges: [
        ['1', '2'],
        ['2', '3'],
        ['3', '4'],
        ['4', '5'],
        ['6', '1'],
        ['7', '2'],
        ['8', '3'],
        ['8', '9'],
      ],
      //                     "8" - "9"
      //                     /
      // "1(a)" - "2(a)" - "3(a)" - "4(b)" - "5(b)"
      //    \        \
      //    "6(b)"   "7"
    });

    test('home unit can use railroads', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '1',
          nation: 'a',
          isFleet: false,
          friendlyFleets: new Set(),
        }),
      ).toEqual(['2', '3', '4', '7', '6']);
    });

    test('foreign unit cannot use railroads', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '1',
          nation: 'b',
          isFleet: false,
          friendlyFleets: new Set(),
        }),
      ).toEqual(['2', '6']);
    });

    test('home unit in the middle can go places', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '3',
          nation: 'a',
          isFleet: false,
          friendlyFleets: new Set(),
        }),
      ).toEqual(['2', '1', '6', '7', '4']);
    });

    test('foreign unit in the middle can go fewer places', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '3',
          nation: 'b',
          isFleet: false,
          friendlyFleets: new Set(),
        }),
      ).toEqual(['2', '4', '5']);
    });

    test('when occupied, railroad rule is not in effect', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '1',
          nation: 'a',
          isFleet: false,
          friendlyFleets: new Set(),
          occupiedHomeProvinces: ['2'],
        }),
      ).toEqual(['2', '6']);
    });

    test('cannot enter and exit on railroad', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '6',
          nation: 'a',
          isFleet: false,
          friendlyFleets: new Set(),
        }),
      ).toEqual(['1', '2', '3']);
    });

    test('cannot enter and exit on occupied province', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '6',
          nation: 'a',
          isFleet: false,
          friendlyFleets: new Set(),
          occupiedHomeProvinces: ['2'],
        }),
      ).toEqual(['1']);
    });

    test('cannot enter and exit on railroad from neutral province and then take a convoy', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '7',
          nation: 'a',
          isFleet: false,
          friendlyFleets: new Set(['8']),
        }),
      ).toEqual(['2', '1', '3']);
    });
  });

  describe('fleets', () => {
    const gameBoard = new GameBoard({
      nodes: [
        {
          name: '1', nation: 'a', isOcean: false, egress: '2',
        },
        { name: '2', nation: null, isOcean: true },
        { name: '3', nation: 'a', isOcean: false },
        { name: '4', nation: null, isOcean: true },
      ],
      edges: [
        ['1', '2'],
        ['1', '3'],
        ['1', '4'],
      ],
    });

    test('fleet can move from land to sea, but only to the correct egress', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '1',
          nation: 'a',
          isFleet: true,
          friendlyFleets: new Set(),
        }),
      ).toEqual(['2']);
    });

    test('fleets cannot use railroad rule', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '3',
          nation: 'a',
          isFleet: true,
          friendlyFleets: new Set(),
        }),
      ).toEqual([]);
    });

    test('army cannot move from land to sea', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '1',
          nation: 'a',
          isFleet: false,
          friendlyFleets: new Set(),
        }),
      ).toEqual(['3']);
    });

    test('fleet cannot move from sea to land', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '2',
          nation: 'a',
          isFleet: true,
          friendlyFleets: new Set(),
        }),
      ).toEqual([]);
    });
  });

  describe('convoy', () => {
    const gameBoard = new GameBoard({
      nodes: [
        { name: '1', nation: 'a', isOcean: false },
        {
          name: '2',
          nation: null,
          isOcean: true,
        },
        {
          name: '3',
          nation: null,
          isOcean: true,
        },
        { name: '4', nation: 'b', isOcean: false },
        { name: '5', nation: 'a', isOcean: false },
      ],
      edges: [
        ['1', '2'],
        ['2', '3'],
        ['3', '4'],
        ['4', '5'],
      ],
    });

    test('army can move across multiple ocean provinces if friendly fleets are there', () => {
      expect(
        gameBoard.neighborsFor({
          origin: '1',
          nation: 'a',
          isFleet: false,
          friendlyFleets: new Set(['2', '3']),
        }),
      ).toEqual(['4']);
    });

    test('army cannot move across ocean in the absence of a friendly fleet', () => {
      expect(
        gameBoard.neighborsFor(
          {
            origin: '1',
            nation: 'b',
            isFleet: false,
            friendlyFleets: new Set(),
          },
          new Set(),
        ),
      ).toEqual([]);
    });
  });
});

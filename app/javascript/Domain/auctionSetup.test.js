import setup from './auctionSetup';
import { Nation } from './constants';

describe('Imperial constructor', () => {
  describe('six players', () => {
    const payload = {
      players: [
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
        { id: 'd' },
        { id: 'e' },
        { id: 'f' },
      ],
      provinceNames: new Set(['1', '2']),
    };
    const actual = setup(payload);

    test('seating order mirrors players array', () => {
      expect(actual.order).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });

    test('cash assignment', () => {
      for (const player of actual.players.values()) {
        expect(player.cash).toEqual(15);
        expect(player.bonds.size).toEqual(0);
        expect(player.score).toEqual(0);
      }
    });

    test('nations', () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE,
        ].map((nationName) => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0,
          },
        ]),
      );
      expect(actual.nations).toEqual(expected);
    });
  });

  describe('five players', () => {
    const payload = {
      players: [
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
        { id: 'd' },
        { id: 'e' },
      ],
      provinceNames: new Set(['1', '2']),
    };
    const actual = setup(payload);

    test('seating order mirrors players array', () => {
      expect(actual.order).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    test('cash assignment', () => {
      for (const player of actual.players.values()) {
        expect(player.cash).toEqual(18);
        expect(player.bonds.size).toEqual(0);
        expect(player.score).toEqual(0);
      }
    });

    test('nations', () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE,
        ].map((nationName) => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0,
          },
        ]),
      );
      expect(actual.nations).toEqual(expected);
    });
  });

  describe('four players', () => {
    const payload = {
      players: [
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
        { id: 'd' },
      ],
      provinceNames: new Set(['1', '2']),
    };
    const actual = setup(payload);

    test('seating order mirrors players array', () => {
      expect(actual.order).toEqual(['a', 'b', 'c', 'd']);
    });

    test('cash assignment', () => {
      for (const player of actual.players.values()) {
        expect(player.cash).toEqual(22);
        expect(player.bonds.size).toEqual(0);
        expect(player.score).toEqual(0);
      }
    });

    test('nations', () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE,
        ].map((nationName) => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0,
          },
        ]),
      );
      expect(actual.nations).toEqual(expected);
    });
  });

  describe('three players', () => {
    const payload = {
      players: [
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
      ],
      provinceNames: new Set(['1', '2']),
    };
    const actual = setup(payload);

    test('seating order mirrors players array', () => {
      expect(actual.order).toEqual(['a', 'b', 'c']);
    });

    test('cash assignment', () => {
      for (const player of actual.players.values()) {
        expect(player.cash).toEqual(15);
        expect(player.bonds.size).toEqual(0);
        expect(player.score).toEqual(0);
      }
    });

    test('nations', () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE,
        ].map((nationName) => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0,
          },
        ]),
      );
      expect(actual.nations).toEqual(expected);
    });
  });

  describe('two players', () => {
    const payload = {
      players: [
        { id: 'a' },
        { id: 'b' },
      ],
      provinceNames: new Set(['1', '2']),
    };
    const actual = setup(payload);

    test('seating order mirrors players array', () => {
      expect(actual.order).toEqual(['a', 'b']);
    });

    test('cash assignment', () => {
      for (const player of actual.players.values()) {
        expect(player.cash).toEqual(40);
        expect(player.bonds.size).toEqual(0);
        expect(player.score).toEqual(0);
      }
    });

    test('nations', () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE,
        ].map((nationName) => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0,
          },
        ]),
      );
      expect(actual.nations).toEqual(expected);
    });
  });
});

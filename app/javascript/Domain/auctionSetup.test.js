import setup from "./auctionSetup";
import { Nation } from "./constants.js";

describe("Imperial constructor", () => {
  describe("six players", () => {
    const payload = {
      players: [
        { id: "a" },
        { id: "b" },
        { id: "c" },
        { id: "d" },
        { id: "e" },
        { id: "f" }
      ],
      provinceNames: new Set(["1", "2"])
    };
    const actual = setup(payload);

    test("seating order mirrors players array", () => {
      expect(actual.order).toEqual(["a", "b", "c", "d", "e", "f"]);
    });

    test("cash assignment", () => {
      expect(actual.players).toEqual({
        a: {
          name: "a",
          cash: 15,
          bonds: new Set(),
          rawScore: 0
        },
        b: {
          name: "b",
          cash: 15,
          bonds: new Set(),
          rawScore: 0
        },
        c: {
          name: "c",
          cash: 15,
          bonds: new Set(),
          rawScore: 0
        },
        d: {
          name: "d",
          cash: 15,
          bonds: new Set(),
          rawScore: 0
        },
        e: {
          name: "e",
          cash: 15,
          bonds: new Set(),
          rawScore: 0
        },
        f: {
          name: "f",
          cash: 15,
          bonds: new Set(),
          rawScore: 0
        },
      });
    });

    test("nations", () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE
        ].map(nationName => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0
          }
        ])
      );
      expect(actual.nations).toEqual(expected);
    });
  });

  describe("five players", () => {
    const payload = {
      players: [
        { id: "a" },
        { id: "b" },
        { id: "c" },
        { id: "d" },
        { id: "e" }
      ],
      provinceNames: new Set(["1", "2"])
    };
    const actual = setup(payload);

    test("seating order mirrors players array", () => {
      expect(actual.order).toEqual(["a", "b", "c", "d", "e"]);
    });

    test("cash assignment", () => {
      expect(actual.players).toEqual({
        a: {
          name: "a",
          cash: 18,
          bonds: new Set(),
          rawScore: 0
        },
        b: {
          name: "b",
          cash: 18,
          bonds: new Set(),
          rawScore: 0
        },
        c: {
          name: "c",
          cash: 18,
          bonds: new Set(),
          rawScore: 0
        },
        d: {
          name: "d",
          cash: 18,
          bonds: new Set(),
          rawScore: 0
        },
        e: {
          name: "e",
          cash: 18,
          bonds: new Set(),
          rawScore: 0
        }
      });
    });

    test("nations", () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE
        ].map(nationName => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0
          }
        ])
      );
      expect(actual.nations).toEqual(expected);
    });
  });

  describe("four players", () => {
    const payload = {
      players: [
        { id: "a" },
        { id: "b" },
        { id: "c" },
        { id: "d" }
      ],
      provinceNames: new Set(["1", "2"])
    };
    const actual = setup(payload);

    test("seating order mirrors players array", () => {
      expect(actual.order).toEqual(["a", "b", "c", "d"]);
    });

    test("cash assignment", () => {
      expect(actual.players).toEqual({
        a: {
          name: "a",
          cash: 22,
          bonds: new Set(),
          rawScore: 0
        },
        b: {
          name: "b",
          cash: 22,
          bonds: new Set(),
          rawScore: 0
        },
        c: {
          name: "c",
          cash: 22,
          bonds: new Set(),
          rawScore: 0
        },
        d: {
          name: "d",
          cash: 22,
          bonds: new Set(),
          rawScore: 0
        }
      });
    });

    test("nations", () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE
        ].map(nationName => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0
          }
        ])
      );
      expect(actual.nations).toEqual(expected);
    });
  });

  describe("three players", () => {
    const payload = {
      players: [
        { id: "a" },
        { id: "b" },
        { id: "c" }
      ],
      provinceNames: new Set(["1", "2"])
    };
    const actual = setup(payload);

    test("seating order mirrors players array", () => {
      expect(actual.order).toEqual(["a", "b", "c"]);
    });

    test("cash assignment", () => {
      expect(actual.players).toEqual({
        a: {
          name: "a",
          cash: 28,
          bonds: new Set(),
          rawScore: 0
        },
        b: {
          name: "b",
          cash: 28,
          bonds: new Set(),
          rawScore: 0
        },
        c: {
          name: "c",
          cash: 28,
          bonds: new Set(),
          rawScore: 0
        }
      });
    });

    test("nations", () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE
        ].map(nationName => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0
          }
        ])
      );
      expect(actual.nations).toEqual(expected);
    });
  });

  describe("two players", () => {
    const payload = {
      players: [
        { id: "a" },
        { id: "b" }
      ],
      provinceNames: new Set(["1", "2"])
    };
    const actual = setup(payload);

    test("seating order mirrors players array", () => {
      expect(actual.order).toEqual(["a", "b"]);
    });

    test("cash assignment", () => {
      expect(actual.players).toEqual({
        a: {
          name: "a",
          cash: 40,
          bonds: new Set(),
          rawScore: 0
        },
        b: {
          name: "b",
          cash: 40,
          bonds: new Set(),
          rawScore: 0
        }
      });
    });

    test("nations", () => {
      const expected = new Map(
        [
          Nation.RU,
          Nation.FR,
          Nation.GB,
          Nation.AH,
          Nation.IT,
          Nation.GE
        ].map(nationName => [
          nationName,
          {
            controller: null,
            treasury: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            flagCount: 0,
            powerPoints: 0
          }
        ])
      );
      expect(actual.nations).toEqual(expected);
    });
  });
});

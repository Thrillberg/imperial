import Imperial from "./imperial";
import { Nation } from "./constants.js";
import Action from "./action";

describe("Imperial", () => {
  describe("constructor", () => {
    describe("six players", () => {
      const state = {
        players: [
          { id: "a", nation: Nation.RU },
          { id: "b", nation: Nation.FR },
          { id: "c", nation: Nation.GB },
          { id: "d", nation: Nation.AH },
          { id: "e", nation: Nation.IT },
          { id: "f", nation: Nation.GE },
        ],
      };
      const game = Imperial.fromLog([Action.init(state)]);

      test("seating order mirrors players array", () => {
        expect(game.order).toEqual(["a", "b", "c", "d", "e", "f"]);
      });

      test("bond assignments", () => {
        expect(game.players).toEqual({
          a: {
            name: "a",
            cash: 2,
            bonds: [
              { nation: Nation.RU, cost: 9 },
              { nation: Nation.FR, cost: 2 },
            ],
          },
          b: {
            name: "b",
            cash: 2,
            bonds: [
              { nation: Nation.FR, cost: 9 },
              { nation: Nation.AH, cost: 2 },
            ],
          },
          c: {
            name: "c",
            cash: 2,
            bonds: [
              { nation: Nation.GB, cost: 9 },
              { nation: Nation.RU, cost: 2 },
            ],
          },
          d: {
            name: "d",
            cash: 2,
            bonds: [
              { nation: Nation.AH, cost: 9 },
              { nation: Nation.GE, cost: 2 },
            ],
          },
          e: {
            name: "e",
            cash: 2,
            bonds: [
              { nation: Nation.IT, cost: 9 },
              { nation: Nation.GB, cost: 2 },
            ],
          },
          f: {
            name: "f",
            cash: 2,
            bonds: [
              { nation: Nation.GE, cost: 9 },
              { nation: Nation.IT, cost: 2 },
            ],
          },
        });
      });

      test("nations", () => {
        const expected = new Map(
          [
            [Nation.RU, "a"],
            [Nation.FR, "b"],
            [Nation.GB, "c"],
            [Nation.AH, "d"],
            [Nation.IT, "e"],
            [Nation.GE, "f"],
          ].map(([k, v]) => [
            k,
            { controller: v, treasury: 11, rondelPosition: null },
          ])
        );
        expect(game.nations).toEqual(expected);
      });
    });

    describe("five players", () => {
      const state = {
        players: [
          { id: "a", nation: Nation.RU },
          { id: "b", nation: Nation.FR },
          { id: "c", nation: Nation.GB },
          { id: "d", nation: Nation.GE },
          { id: "e", nation: Nation.IT },
        ],
      };
      const game = Imperial.fromLog([Action.init(state)]);

      test("seating order", () => {
        expect(game.order).toEqual(["a", "b", "c", "d", "e"]);
      });

      test("bond assignments", () => {
        expect(game.players).toEqual({
          a: {
            name: "a",
            cash: 2,
            bonds: [
              { nation: Nation.RU, cost: 9 },
              { nation: Nation.FR, cost: 2 },
            ],
          },
          b: {
            name: "b",
            cash: 2,
            bonds: [
              { nation: Nation.FR, cost: 9 },
              { nation: Nation.AH, cost: 2 },
            ],
          },
          c: {
            name: "c",
            cash: 2,
            bonds: [
              { nation: Nation.GB, cost: 9 },
              { nation: Nation.RU, cost: 2 },
            ],
          },
          d: {
            name: "d",
            cash: 2,
            bonds: [
              { nation: Nation.GE, cost: 9 },
              { nation: Nation.IT, cost: 2 },
            ],
          },
          e: {
            name: "e",
            cash: 2,
            bonds: [
              { nation: Nation.IT, cost: 9 },
              { nation: Nation.GB, cost: 2 },
            ],
          },
        });
      });

      test("nations", () => {
        const expected = new Map(
          [
            [Nation.RU, "a", 11],
            [Nation.FR, "b", 11],
            [Nation.GB, "c", 11],
            [Nation.GE, "d", 9], // AH controller would have bought GE 2
            [Nation.IT, "e", 11],
            [Nation.AH, "b", 2], // FR controller bought AH 2
          ].map(([nation, controller, treasury]) => [
            nation,
            { controller, treasury, rondelPosition: null },
          ])
        );
        expect(game.nations).toEqual(expected);
      });
    });

    describe("four players", () => {
      const state = {
        players: [
          { id: "a", nation: Nation.IT },
          { id: "b", nation: Nation.FR },
          { id: "c", nation: Nation.AH },
          { id: "d", nation: Nation.GE },
        ],
      };
      const game = Imperial.fromLog([Action.init(state)]);

      test("seating order", () => {
        expect(game.order).toEqual(["a", "b", "c", "d"]);
      });

      test("bond assignments", () => {
        expect(game.players).toEqual({
          a: {
            name: "a",
            cash: 2,
            bonds: [
              { nation: Nation.IT, cost: 9 },
              { nation: Nation.GB, cost: 2 },
            ],
          },
          b: {
            name: "b",
            cash: 2,
            bonds: [
              { nation: Nation.FR, cost: 9 },
              { nation: Nation.AH, cost: 2 },
            ],
          },
          c: {
            name: "c",
            cash: 2,
            bonds: [
              { nation: Nation.AH, cost: 9 },
              { nation: Nation.GE, cost: 2 },
            ],
          },
          d: {
            name: "d",
            cash: 2,
            bonds: [
              { nation: Nation.GE, cost: 9 },
              { nation: Nation.IT, cost: 2 },
            ],
          },
        });
      });

      test("nations", () => {
        const expected = new Map(
          [
            [Nation.IT, "a", 11],
            [Nation.FR, "b", 9], // RU controller would have bought FR 2
            [Nation.AH, "c", 11],
            [Nation.GE, "d", 11],
            [Nation.GB, "a", 2], // IT controller bought GB 2
            [Nation.RU, null, 0], // nobody has RU bond
          ].map(([nation, controller, treasury]) => [
            nation,
            { controller, treasury, rondelPosition: null },
          ])
        );
        expect(game.nations).toEqual(expected);
      });
    });

    describe("three players", () => {
      const state = {
        players: [
          { id: "a", nation: Nation.IT },
          { id: "b", nation: Nation.FR },
          { id: "c", nation: Nation.AH },
        ],
      };
      const game = Imperial.fromLog([Action.init(state)]);

      test("seating order", () => {
        expect(game.order).toEqual(["a", "b", "c"]);
      });

      test("bond assignments", () => {
        expect(game.players).toEqual({
          a: {
            name: "a",
            cash: 2,
            bonds: [
              { nation: Nation.IT, cost: 9 },
              { nation: Nation.GB, cost: 2 },
              { nation: Nation.RU, cost: 9 },
              { nation: Nation.FR, cost: 2 },
            ],
          },
          b: {
            name: "b",
            cash: 2,
            bonds: [
              { nation: Nation.FR, cost: 9 },
              { nation: Nation.AH, cost: 2 },
              { nation: Nation.GE, cost: 9 },
              { nation: Nation.IT, cost: 2 },
            ],
          },
          c: {
            name: "c",
            cash: 2,
            bonds: [
              { nation: Nation.AH, cost: 9 },
              { nation: Nation.GE, cost: 2 },
              { nation: Nation.GB, cost: 9 },
              { nation: Nation.RU, cost: 2 },
            ],
          },
        });
      });

      // Great Britain to Austria-Hungary
      // Russia to Italy
      // Germany to France
      test("nations", () => {
        const expected = new Map(
          [
            [Nation.IT, "a", 11],
            [Nation.FR, "b", 11],
            [Nation.AH, "c", 11],
            [Nation.RU, "a", 11],
            [Nation.GE, "b", 11],
            [Nation.GB, "c", 11],
          ].map(([nation, controller, treasury]) => [
            nation,
            { controller, treasury, rondelPosition: null },
          ])
        );
        expect(game.nations).toEqual(expected);
      });
    });

    describe("two players", () => {
      const state = {
        players: [
          { id: "a", nation: Nation.IT },
          { id: "b", nation: Nation.AH },
        ],
      };
      const game = Imperial.fromLog([Action.init(state)]);

      test("seating order", () => {
        expect(game.order).toEqual(["a", "b"]);
      });

      test("bond assignments", () => {
        expect(game.players).toEqual({
          a: {
            name: "a",
            cash: 2,
            bonds: [
              { nation: Nation.IT, cost: 9 },
              { nation: Nation.GB, cost: 2 },
              { nation: Nation.RU, cost: 9 },
              { nation: Nation.FR, cost: 2 },
              { nation: Nation.GB, cost: 9 },
              { nation: Nation.RU, cost: 2 },
            ],
          },
          b: {
            name: "b",
            cash: 2,
            bonds: [
              { nation: Nation.AH, cost: 9 },
              { nation: Nation.GE, cost: 2 },
              { nation: Nation.FR, cost: 9 },
              { nation: Nation.AH, cost: 2 },
              { nation: Nation.GE, cost: 9 },
              { nation: Nation.IT, cost: 2 },
            ],
          },
        });
      });

      // France and Germany to Austria-Hungary
      // Russia and Great Britain to Italy
      test("nations", () => {
        const expected = new Map(
          [
            [Nation.IT, "a", 11],
            [Nation.RU, "a", 11],
            [Nation.GB, "a", 11],
            [Nation.AH, "b", 11],
            [Nation.FR, "b", 11],
            [Nation.GE, "b", 11],
          ].map(([nation, controller, treasury]) => [
            nation,
            { controller, treasury, rondelPosition: null },
          ])
        );
        expect(game.nations).toEqual(expected);
      });
    });
  });
});

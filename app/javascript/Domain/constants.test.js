import { Bond, Nation } from './constants';

describe('Bond', () => {
  test('strict equality', () => {
    const a = Bond(Nation.AH, 2);
    const b = Bond(Nation.AH, 2);

    expect(a).toBe(b);
  });

  describe('value', () => {
    [
      { number: 1, cost: 2 },
      { number: 2, cost: 4 },
      { number: 3, cost: 6 },
      { number: 4, cost: 9 },
      { number: 5, cost: 12 },
      { number: 6, cost: 16 },
      { number: 7, cost: 20 },
      { number: 8, cost: 25 },
      { number: 9, cost: 30 },
    ].forEach(({ number, cost }) => {
      test(`#${number} bond`, () => {
        expect(Bond(Nation.FR, number)).toStrictEqual({
          nation: Nation.FR,
          number,
          cost,
        });
      });
    });
  });
});

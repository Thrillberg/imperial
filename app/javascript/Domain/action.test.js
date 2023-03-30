import Action from './action';
import { Nation } from './constants';

describe('Action.rondel', () => {
  test('memoization works', () => {
    const first = Action.rondel({
      nation: Nation.AH,
      cost: 42,
      slot: 'maneuver1',
    });
    const second = Action.rondel({
      nation: Nation.AH,
      cost: 42,
      slot: 'maneuver1',
    });

    expect(first).toBe(second);
  });

  describe('validation', () => {
    test('missing keys', () => {
      expect(() => Action.rondel({})).toThrowError();
    });

    test('extra keys', () => {
      expect(() => Action.rondel({
        nation: Nation.AH,
        cost: 42,
        slot: 'maneuver1',
        blimport: true,
      })).toThrowError();
    });
  });
});

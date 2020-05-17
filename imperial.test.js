const imperial = require('./imperial');

test('adds 1 + 2 to equal 3', () => {
  expect(imperial(1, 2)).toBe(3);
});


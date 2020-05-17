const imperial = require('./imperial');

test('gets the player who owns Austria-Hungary', () => {
  expect(imperial()).toBe("franzJosef");
});


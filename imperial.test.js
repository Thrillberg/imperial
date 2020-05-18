const imperial = require('./imperial');

test('puts Austria-Hungary on "production" in the rondel', () => {
  expect(imperial().rondel[0][0]).toEqual("franzJosef");
});


const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      /* eslint-disable global-require */
      return require('./cypress/plugins/index')(on, config);
      /* eslint-enable global-require */
    },
    baseUrl: 'http://localhost:5002',
  },
});

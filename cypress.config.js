const { defineConfig } = require("cypress");

module.exports = defineConfig({
  retries: {
    runMode: 1,
    openMode: 0,
  },
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'https://www.businessinsider.com/',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/integration/spec**/*.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // modify config values
      config.defaultCommandTimeout = 10000;
      return config;
    },
  },




});

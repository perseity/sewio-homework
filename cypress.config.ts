import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    specPattern: 'cypress/specs/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts'
  },
  env: {
    wssUrl: 'wss://demo.sewio.net',
    baseUrl: 'https://demo.sewio.net',

    apiKey: 'dummy',
  }
});

import { defineConfig } from "cypress";

export default defineConfig({
  // responseTimeout: 60000,
  // defaultCommandTimeout: 10000,
  e2e: {
    specPattern: 'cypress/specs/**/*.cy.ts',
  },
  env: {
    username: 'default',
    password: 'default'
  }
});

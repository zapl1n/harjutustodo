import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("before:run", () => {
        // This event is triggered before the tests start running
        console.log("Running Cypress tests...");
      });

      on("after:run", (results) => {
        // This event is triggered after the tests finish running
        console.log("Cypress tests completed.");
        console.log("Test results:", results);
      });
    },
  },
});

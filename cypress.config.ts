import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  clientCertificates: [
    {
      url: 'https://localhost:3000/**',
      ca: ['cert.pem'],
      certs: [
        {
          cert: 'cert.pem',
          key: 'key.pem',
          // passphrase: 'certs/pem-passphrase.txt',
        },
      ],
    },
  ],
});

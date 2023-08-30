import cucumber from 'cypress-cucumber-preprocessor';

module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
    on('file:preprocessor', cucumber());
};

import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { signIn } from './loginhelper';

Given('I am signed in', () => {
    signIn();
});

When('I add an item with the name {string}', (itemName) => {
    cy.get('[data-cy=add-item-input]').type(itemName);
    cy.get('[data-cy=add-item-button]').click();
});

Then('I should see the item {string} in the item list', (itemName) => {
    cy.get('[data-cy=item-container]').contains(itemName);
});

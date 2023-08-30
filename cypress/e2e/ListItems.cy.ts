import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { signIn } from './loginhelper';

Given('I am not signed in', () => {
    // Perform actions to sign out or ensure not signed in
});

Then('I should not see any items in the item list', () => {
    cy.get('[data-cy=item-container]').should('not.exist');
});

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

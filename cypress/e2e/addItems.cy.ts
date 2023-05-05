/// <reference types="cypress" />

import { signIn } from './loginhelper';

describe('Add Items', () => {

    it('should add an item', () => {
        signIn();

        // Add an item
        cy.get('[data-cy=add-item-input]').type('Cypress Test Item');
        cy.get('[data-cy=add-item-button]').click();

        // Verify that the item is visible
        cy.get('[data-cy=item-container]').contains('Cypress Test Item');
    });
});
/// <reference types="cypress" />

import { signIn } from './loginhelper';

describe('List Items', () => {
    it('should not list items when not signed in', () => {
        cy.visit('http://localhost:3000/');
        // Verify that the items are not visible
        cy.get('[data-cy=item-container]').should('not.exist');
    });

    it('should list items when signed in', () => {
        signIn();

        // Verify that the items are visible
        cy.get('[data-cy=item-container]').should('be.visible');
    });
});
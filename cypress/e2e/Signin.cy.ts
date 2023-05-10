/// <reference types="cypress" />

import { signIn } from './loginhelper';

// Test sign in 
describe('Signin', () => {

    it('should signin a user', () => {
        signIn();
    });

    it('should not signin a user with wrong password', () => {
        const alertStub = cy.stub()
        cy.on('window:alert', alertStub)
        cy.visit('http://localhost:3000/');
        cy.contains('button', 'Sign In').click();
        cy.get('#signin-email').type('test@test.ee');
        cy.get('#signin-password').click();
        cy.get('#signin-password').type('wrongpassword');
        cy.get('#signin-submit').click();

        // Check that alert "Invalid email or password" is visible
        cy.wrap(alertStub).should('be.calledWith', 'Error code 401:\nInvalid email or password')
    });
});



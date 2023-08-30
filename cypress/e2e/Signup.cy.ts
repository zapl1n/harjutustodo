/// <reference types="cypress" />
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the homepage', () => {
  cy.visit('https://localhost:3000/');
});

When('I click the "Sign Up" button', () => {
  cy.contains('button', 'Sign Up').click();
});

When('I enter a random email', () => {
  const randomEmail = Math.random().toString(36).substring(2) + '@example.com';
  cy.get('#signup-email').click().type(randomEmail, { force: true });
  cy.get('#signup-email').should('have.value', randomEmail);
});

When('I enter a random password', () => {
  const randomPassword = Math.random().toString(36).substring(2);
  cy.get('#signup-password').click().type(randomPassword, { force: true });
  cy.get('#signup-password').should('have.value', randomPassword);
});

When('I click the "Submit" button', () => {
  cy.get('#signup-submit').click();
});

Then('I should see the "Sign Out" button', () => {
  cy.contains('button', 'Sign Out').should('be.visible');
});

Then('I should see an error message with code {int} and text {string}', (errorCode, errorMessage) => {
  cy.on('window:alert', (alertText) => {
    expect(alertText).to.equal(`Error code ${errorCode}:\n${errorMessage}`);
  });
});

describe('Signup', () => {
  it('should signup a new user', () => {
    cy.visit('https://localhost:3000/');
    cy.contains('button', 'Sign Up').click();
    const randomEmail = Math.random().toString(36).substring(2) + '@example.com';
    const randomPassword = Math.random().toString(36).substring(2);
    cy.get('#signup-email').click().type(randomEmail, { force: true });
    cy.get('#signup-email').should('have.value', randomEmail);
    cy.get('#signup-password').click().type(randomPassword, { force: true });
    cy.get('#signup-password').should('have.value', randomPassword);
    cy.get('#signup-submit').click();

    cy.contains('button', 'Sign Out').should('be.visible');
  });
});

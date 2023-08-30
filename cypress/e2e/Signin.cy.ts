import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the homepage', () => {
  cy.visit('https://localhost:3000/');
});

When('I click the "Sign In" button', () => {
  cy.contains('button', 'Sign In').click();
});

When('I enter my email and password', () => {
  cy.get('#signin-email').type('your-email@example.com');
  cy.get('#signin-password').type('your-password');
});

When('I submit the signin form', () => {
  cy.get('#signin-submit').click();
});

Then('I should be signed in', () => {
  cy.contains('button', 'Sign Out').should('be.visible');
});

Then('I should see an error message', () => {
  const alertStub = cy.stub();
  cy.on('window:alert', alertStub);
  cy.wrap(alertStub).should(
    'be.calledWith',
    'Error code 401:\nInvalid email or password'
  );
});

export const signIn = () => {
    const email = 'test@test.ee';
    const password = 'test123';

    cy.visit('https://localhost:3000/'); // Adjust this according to your login page route
    cy.get('[data-cy=open-signin-modal-button]').click();
    cy.get('[data-cy=email-input]').type(email, { force: true });
    cy.get('[data-cy=password-input]').type(password, { force: true });
    cy.get('[data-cy=signin-submit]').click();

    // verify that the signout button is visible
    cy.get('[data-cy=signout-button]').should('be.visible');
};


declare global {
    namespace Cypress {
        interface Chainable {
            given: typeof given;
            when: typeof when;
            thenStep: typeof thenStep;
        }
    }
}

const given = (description: string, fn: () => void) => {
    Cypress.Commands.add('given', { prevSubject: false }, fn);
};

const when = (description: string, fn: () => void) => {
    Cypress.Commands.add('when', { prevSubject: false }, fn);
};

const thenStep = (description: string, fn: () => void) => {
    Cypress.Commands.add('thenStep', { prevSubject: false }, fn);
};

export { given, when, thenStep };

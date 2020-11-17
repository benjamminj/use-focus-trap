describe('useFocusTrap', () => {
  it('should return focus to the first focusable element', () => {
    cy.visit('/');
    cy.get('body').tab();
    cy.focused().tab();
    cy.focused().tab();

    cy.focused().should('contain.text', 'inside #3');

    cy.focused().tab();
    cy.focused().should('contain.text', 'inside #1');
  });
});

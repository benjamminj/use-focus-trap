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

  it('should properly handle input elements', () => {
    cy.visit('/elements/input');
    cy.get('body').tab();
    cy.focused().should('have.id', '1');
    cy.focused().tab();
    cy.focused().should('have.id', '2');
    cy.focused().tab();
    cy.focused().should('have.id', '1');
  });

  it('should properly handle select elements', () => {
    cy.visit('/elements/select');
    cy.get('body').tab();
    cy.focused().should('have.id', 'number');
    cy.focused().tab();
    cy.focused().should('have.id', 'letter');
    cy.focused().tab();
    cy.focused().should('have.id', 'number');
  });

  it('should properly handle select elements', () => {
    cy.visit('/elements/textarea');
    cy.get('body').tab();
    cy.focused().should('have.id', '1');
    cy.focused().tab();
    cy.focused().should('have.id', '2');
    cy.focused().tab();
    cy.focused().should('have.id', '1');
  });

  it('should properly handle anchor elements', () => {
    cy.visit('/elements/anchor');
    cy.get('body').tab();
    cy.focused().should('contain', 'google');
    cy.focused().tab();
    cy.focused().should('contain', 'amazon');
    cy.focused().tab();
    cy.focused().should('contain', 'google');
  });

  it('should skip anchor elements w/o an href', () => {
    cy.visit('/elements/anchor-no-href');
    cy.get('body').tab();
    cy.focused().should('contain', 'google');
    cy.focused().tab();
    cy.focused().should('contain', 'amazon');
    cy.focused().tab();
    cy.focused().should('contain', 'google');
  });

  it('should handle tabindex=0', () => {
    cy.visit('/elements/zero-tabindex');
    cy.get('body').tab();
    cy.focused().should('have.id', '1');
    cy.focused().tab();
    cy.focused().should('have.id', '2');
    cy.focused().tab();
    cy.focused().should('have.id', '1');
  });

  it('should skip tabindex=-1', () => {
    cy.visit('/elements/negative-tabindex');
    cy.get('body').tab();
    cy.focused().should('have.id', '2');
    cy.focused().tab();
    cy.focused().should('have.id', '3');
    cy.focused().tab();
    cy.focused().should('have.id', '2');
  });

  it('should skip disabled elements', () => {
    cy.visit('/elements/disabled');
    cy.get('body').tab();
    cy.focused().should('have.id', '2');
    cy.focused().tab();
    cy.focused().should('have.id', '3');
    cy.focused().tab();
    cy.focused().should('have.id', '2');
  });

  it('should allow manually controlling whether the trap is on/off', () => {
    cy.visit('/controlled');

    const tabThruTrapContent = () => {
      cy.get('body').tab();
      cy.focused().should('contain', '1');
      cy.focused().tab();
      cy.focused().should('contain', '2');
      cy.focused().tab();
      cy.focused().should('contain', 'toggle');
      cy.focused().tab();
    };

    tabThruTrapContent();
    cy.focused().should('contain', '1');

    cy.contains('toggle').click();
    cy.contains('Focus trap is off').should('exist');

    tabThruTrapContent();
    cy.focused().should('contain', 'outside');
  });
});

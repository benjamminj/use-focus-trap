describe('useFocusTrap', () => {
  const tabTimes = (times: number) => {
    const range = Array.from({ length: times }, (_, i) => i + 1);
    cy.wrap(range).each(() => {
      cy.focused().tab();
    });
  };

  it('should return focus to the first focusable element', () => {
    cy.visit('/');

    cy.get('body').tab();
    tabTimes(2);

    cy.focused().should('contain.text', 'inside #3');

    tabTimes(1);
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

  it('should return focus to the attached trigger when closing the trap', () => {
    cy.visit('/return-focus-to-trigger');

    cy.contains('trigger on').click();
    cy.focused().tab();
    cy.focused().should('contain', 'inside #1');
    cy.focused().tab();
    cy.focused().should('contain', 'inside #2');
    cy.focused().tab();
    cy.focused().should('contain', 'trigger off');
    cy.focused().click();
    cy.focused().should('contain', 'trigger on');
  });

  it('should return focus to the attached trigger then the trap unmounts', () => {
    cy.visit('/return-focus-on-unmount');

    cy.contains('toggle').click();
    cy.focused().tab();
    cy.focused().should('contain', 'inside #1');
    cy.focused().tab();
    cy.focused().should('contain', 'inside #2');
    cy.focused().tab();
    cy.focused().should('contain', 'close');
    cy.focused().click();
    cy.focused().should('contain', 'toggle');
  });

  it('should trap focus when the trap contains the last element in the DOM', () => {
    cy.visit('/last-dom-element');
    cy.get('body').tab();
    cy.focused().should('contain', 'inside #1');
    cy.focused().tab();
    cy.focused().should('contain', 'inside #2');
    cy.focused().tab();
    cy.focused().should('contain', 'inside #1');
  });

  it('should handle multiple focus traps without trigger refs', () => {
    cy.visit('/multiple-traps-no-trigger-refs');

    cy.contains('First is off').should('exist');
    cy.contains('Second is off').should('exist');

    // Navigate thru the first focus trap, turn it on.
    cy.get('body').tab();
    cy.focused().click();
    cy.contains('First is on').should('exist');

    // Now that the first trap is on, tab thru it to make sure it's working
    tabTimes(2);
    cy.focused().should('contain', 'toggle second on');
    cy.focused().tab();
    cy.focused().should('contain', 'toggle first');

    // Toggle the second trap on
    cy.contains('toggle second on')
      .focus()
      .click();

    // Another tab should now enter the second trap
    // Tab all the way around this trap to make sure it's working
    cy.focused().tab();
    cy.focused().should('contain', 'second #1');
    tabTimes(2);
    cy.focused().should('contain', 'toggle second off');
    cy.focused().tab();
    cy.focused().should('contain', 'second #1');

    // Now turn the second trap off, the first should still be on
    cy.contains('toggle second off').click();
    cy.contains('Second is off').should('exist');
    cy.contains('First is on').should('exist');

    // Tab again, and we should be back in the first trap
    cy.focused().tab();
    cy.focused().should('contain', 'toggle first');
    tabTimes(3);
    cy.focused().should('contain', 'toggle first');
    cy.focused().click();
    tabTimes(3);
    cy.focused().should('contain', 'second #1');
  });

  it('should handle multiple focus traps and return focus to the appropriate trigger', () => {
    cy.visit('/multiple-traps-trigger-refs');

    cy.contains('First is off').should('exist');
    cy.contains('Second is off').should('exist');

    // Navigate thru the first focus trap, turn it on.
    cy.get('body').tab();
    cy.focused().click();
    cy.contains('First is on').should('exist');

    // Now that the first trap is on, tab thru it to make sure it's working
    tabTimes(3);
    cy.focused().should('contain', 'toggle first');

    // Toggle the second trap on
    cy.contains('toggle second on')
      .focus()
      .click();

    // Another tab should now enter the second trap
    // Tab all the way around this trap to make sure it's working
    cy.focused().tab();
    cy.focused().should('contain', 'second #1');
    tabTimes(3);
    cy.focused().should('contain', 'second #1');

    // Now turn the second trap off, the first should still be on
    cy.contains('toggle second off').click();
    cy.contains('Second is off').should('exist');
    cy.contains('First is on').should('exist');

    cy.focused().should('contain', 'toggle second on');
  });

  it('should loop to last element if tabbing backward through the trap', () => {
    cy.visit('/loop-backwards');
    cy.contains('inside #2').focus();
    cy.focused().tab({ shift: true });
    cy.focused().should('contain', 'inside #1');
    cy.focused().tab({ shift: true });
    cy.focused().should('contain', 'inside #3');
  });

  it('should handle nested focus traps', () => {
    cy.visit('/nested-traps');
    cy.get('body').tab();
    cy.focused()
      .should('contain', 'enable outer')
      .click();
    cy.contains('Outer trap is on').should('exist');
    tabTimes(3);
    cy.focused().should('contain', 'enable outer');
    cy.contains('enable inner').click();
    cy.focused().tab();
    cy.focused().should('contain', 'inner #1');
    tabTimes(2);
    cy.focused().should('contain', 'inner #1');
    cy.contains('close inner').click();
    cy.focused().should('contain', 'enable inner');
    tabTimes(2);
    cy.focused().should('contain', 'enable outer');
  });

  it('should handle additions from the focusable content', () => {
    cy.visit('/adding-nodes');
    cy.get('body').tab();
    tabTimes(2);
    cy.focused().should('contain', 'first');
    cy.contains('show hidden items').click();
    cy.focused().tab();
    cy.focused().should('contain', 'hidden #1');
    cy.focused().tab();
    cy.focused().should('contain', 'hidden #2');
    cy.focused().tab();
    cy.focused().should('contain', 'first');
  });

  it('should handle removals from the focusable content', () => {
    cy.visit('/removing-nodes');
    cy.get('body').tab();
    tabTimes(2);
    cy.focused().should('contain', 'hidden #1');
    tabTimes(2);
    cy.focused().should('contain', 'first');
    cy.contains('remove hidden items').click();
    cy.focused().tab();
    cy.focused().should('contain', 'first');
  });

  it('should allow auto-focusing on first tabbable element (uncontrolled)', () => {
    cy.visit('/auto-focus/controlled');
    cy.contains('enable').click();
    cy.focused().should('contain', 'first');
  });

  it('should allow auto-focusing on first tabbable element (controlled)', () => {
    cy.visit('/auto-focus/uncontrolled');
    cy.focused().should('contain', 'first');
  });
});

const focusableElementsSelector = `
  a[href]:not(:disabled):not([tabindex="-1"]), 
  button:not(:disabled):not([tabindex="-1"]), 
  input:not(:disabled):not([tabindex="-1"]), 
  textarea:not(:disabled):not([tabindex="-1"]), 
  select:not(:disabled):not([tabindex="-1"]), 
  details:not(:disabled):not([tabindex="-1"]), 
  [tabindex]:not(:disabled):not([tabindex="-1"])
`;

/**
 * In some edge cases, an app can contain multiple focus traps nested within each
 * other. In these scenarios it's important to track the parent-child relationships
 * between the focus traps.
 *
 * At the moment this is a single stack reused across all focus trap hooks.  Using this
 * last-in-first-out approach allows each focus trap to do the following:
 *
 * A) Begin trapping focus when it is added to the stack
 * B) Stop trapping focus when it is removed from the stack
 * C) Know whether it is currently the highest-priority focus trap (i.e. the last
 *    in the stack) or whether it should stop listening to events.
 */
type InternalTrapStackItem = {
  element: HTMLElement | null;
  detachHandler: () => void;
  attachHandler: () => void;
};

let currentTrapStack: InternalTrapStackItem[] = [];
const getCurrentTrap = () => currentTrapStack[currentTrapStack.length - 1];

/**
 * Returns whether the element is within the current focus trap "stack"
 */
// const getIsCurrentStack = (el: HTMLElement | null) => {
//   const current = getCurrentTrap();
//   return current && current.element === el;
// };

/**
 * Find the _first_ and the _last_ focusable elements within a given container element
 */
const getFocusableEdges = (containerEl: HTMLElement): HTMLElement[] => {
  const allFocusable = containerEl.querySelectorAll(focusableElementsSelector);

  const firstFocusable = allFocusable[0];
  const lastFocusable = allFocusable[allFocusable.length - 1];

  return [firstFocusable, lastFocusable] as HTMLElement[];
};

/**
 * Manually focus on a given DOM node. If an event is passed in, prevents the
 * default behavior of the event.
 */
const focusElement = (el?: HTMLElement | null, ev?: Event) => {
  el?.focus();
  if (ev) ev.preventDefault();
};

type CreateFocusTrapOptions = {
  triggerElement?: HTMLElement | null;
};

/**
 * @todo feature parity
 * - attach key handler to container that provides focus trap
 * - cleanup fn (detach handler)
 * - multiple focus traps
 * - manual enable / disable, return focus to trigger element on disable.
 */
export const createFocusTrap = (
  el: HTMLElement | null,
  { triggerElement }: CreateFocusTrapOptions = {}
) => {
  const handleKeydown = (ev: KeyboardEvent) => {
    if (ev.key !== 'Tab') return;
    if (!el) return;

    const isFocusedWithin = el.querySelector(':focus-within');
    const [firstFocusable, lastFocusable] = getFocusableEdges(el);

    if (!isFocusedWithin) {
      // @todo note how it's important to pass the event thru, otherwise
      // we don't "hijack" the tab event.
      focusElement(firstFocusable, ev);
    }

    if (ev.shiftKey) {
      if (document.activeElement === firstFocusable) {
        focusElement(lastFocusable, ev);
      }
    } else if (document.activeElement === lastFocusable) {
      focusElement(firstFocusable, ev);
    }
  };

  const detachHandler = () => {
    // @todo note how this step is important, if we don't detach the handler
    // we'll get a memory leak.
    window.removeEventListener('keydown', handleKeydown);
  };

  const attachHandler = () => {
    window.addEventListener('keydown', handleKeydown);
  };

  return {
    enable: ({ autoFocus = true } = {}) => {
      if (el && autoFocus) {
        const [firstFocusable] = getFocusableEdges(el);
        focusElement(firstFocusable);
      }

      // disable any existing traps on the stack, making sure not to return
      // focus to their trigger elements.
      // push the current trap's methods to the stack
      // TODO: do we need to protect against accidentally double-enabling?
      currentTrapStack.forEach(({ detachHandler }) => detachHandler());
      currentTrapStack.push({ attachHandler, detachHandler, element: el });

      attachHandler();
    },
    disable: () => {
      if (triggerElement) {
        focusElement(triggerElement);
      }

      // remove the current trap from the stack
      currentTrapStack.pop();

      // If there's still an item on the stack (nested focus traps), return focus
      // to that item's first focusable element.
      // TODO: might need to opt out of this step _if_ there's a trigger element.
      if (currentTrapStack.length > 0) {
        getCurrentTrap().attachHandler();
      }

      detachHandler();
    },
  };
};

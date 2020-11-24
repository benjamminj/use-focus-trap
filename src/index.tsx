import { MutableRefObject, useEffect, useRef } from 'react';

const focusableElementsSelector = `
  a[href]:not(:disabled):not([tabindex="-1"]), 
  button:not(:disabled):not([tabindex="-1"]), 
  input:not(:disabled):not([tabindex="-1"]), 
  textarea:not(:disabled):not([tabindex="-1"]), 
  select:not(:disabled):not([tabindex="-1"]), 
  details:not(:disabled):not([tabindex="-1"]), 
  [tabindex]:not(:disabled):not([tabindex="-1"])
`;

interface UseFocusTrapArguments<T> {
  enabled?: boolean;
  trigger?: T;
  autoFocus?: boolean;
}

type HTMLRefValue = HTMLElement | null;
type HTMLRef = MutableRefObject<HTMLRefValue>;

let currentTrapStack: HTMLRefValue[] = [];
const getCurrentTrap = () => currentTrapStack[currentTrapStack.length - 1];

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

// TODO: docssss
const getIsCurrentStack = (el: unknown) => el === getCurrentTrap();

/**
 * @todo description
 */
export const useFocusTrap = <
  T extends HTMLElement = HTMLElement,
  K extends HTMLRef = HTMLRef
>({
  enabled: controlledEnabled,
  trigger,
  autoFocus = true,
}: UseFocusTrapArguments<K> = {}) => {
  const enabled = controlledEnabled === undefined ? true : controlledEnabled;
  const ref = useRef<T>(null);

  // Refocus back on the trigger that opened the focus trap
  // when the focus trap closes.
  useEffect(() => {
    const isCurrentStack = getIsCurrentStack(ref.current);
    if (!enabled && isCurrentStack) {
      focusElement(trigger?.current);
    }
  }, [enabled, getIsCurrentStack]);

  useEffect(() => {
    const currentElement = ref.current;
    if (!currentElement || !enabled) return;

    currentTrapStack.push(ref.current);

    const handleKeydown = (ev: KeyboardEvent) => {
      if (getIsCurrentStack(ref.current) === false) return;

      if (ev.key !== 'Tab') return;

      const isFocusedWithin = currentElement?.querySelector(':focus-within');
      const [firstFocusable, lastFocusable] = getFocusableEdges(currentElement);

      if (!isFocusedWithin) {
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

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);

      if (controlledEnabled === undefined) {
        focusElement(trigger?.current);
      }

      if (getIsCurrentStack(currentElement)) {
        currentTrapStack.pop();
        focusElement(trigger?.current);
      }
    };
  }, [enabled, controlledEnabled, getIsCurrentStack]);

  // Right now it's important that this happens as the last effect, so that the
  // the stack is initialized before we try to auto-focus
  useEffect(() => {
    const isCurrentStack = getIsCurrentStack(ref.current);

    if (enabled && autoFocus && isCurrentStack && ref.current) {
      const [firstFocusable] = getFocusableEdges(ref.current);
      focusElement(firstFocusable);
    }
  }, [enabled, autoFocus, getIsCurrentStack]);

  return ref;
};

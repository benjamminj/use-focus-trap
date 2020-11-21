import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

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

export const useFocusTrap = <
  T extends HTMLElement = HTMLElement,
  K extends HTMLRef = HTMLRef
>({
  enabled: controlledEnabled,
  trigger,
  autoFocus,
}: UseFocusTrapArguments<K> = {}) => {
  const enabled = controlledEnabled === undefined ? true : controlledEnabled;
  const ref = useRef<T>(null);

  const getIsCurrentStack = useCallback(
    (el = ref.current) => el === getCurrentTrap(),
    []
  );

  const refocusTrigger = useCallback(() => trigger?.current?.focus(), [
    trigger,
  ]);

  useEffect(() => {
    const isCurrentStack = getIsCurrentStack();
    if (!enabled && isCurrentStack) {
      refocusTrigger();
    }
  }, [enabled, getIsCurrentStack, refocusTrigger]);

  useEffect(() => {
    const currentElement = ref.current;
    if (!currentElement || !enabled) return;

    currentTrapStack.push(ref.current);

    const handleKeydown = (ev: KeyboardEvent) => {
      const allFocusable = currentElement.querySelectorAll(
        focusableElementsSelector
      );

      const firstFocusable = allFocusable[0];
      const lastFocusable = allFocusable[allFocusable.length - 1];

      if (getIsCurrentStack() === false) return;

      if (ev.key !== 'Tab') return;

      const isFocusedWithin = currentElement?.querySelector(':focus-within');

      if (!isFocusedWithin) {
        (firstFocusable as HTMLElement).focus();
        ev.preventDefault();
      }

      if (ev.shiftKey) {
        if (document.activeElement === firstFocusable) {
          (lastFocusable as HTMLElement).focus();
          ev.preventDefault();
        }
      } else if (document.activeElement === lastFocusable) {
        (firstFocusable as HTMLElement).focus();
        ev.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);

      if (controlledEnabled === undefined) {
        refocusTrigger();
      }

      if (getIsCurrentStack(currentElement)) {
        currentTrapStack.pop();
        refocusTrigger();
      }
    };
  }, [enabled, controlledEnabled, refocusTrigger, getIsCurrentStack]);

  // Right now it's important that this happens as the last effect, so that the
  // the stack is initialized before we try to auto-focus
  useEffect(() => {
    const isCurrentStack = getIsCurrentStack();

    if (enabled && autoFocus && isCurrentStack && ref.current) {
      const allFocusable = ref.current.querySelectorAll(
        focusableElementsSelector
      );

      const firstFocusable = allFocusable[0];
      (firstFocusable as HTMLElement).focus();
    }
  }, [enabled, autoFocus, getIsCurrentStack]);

  return ref;
};

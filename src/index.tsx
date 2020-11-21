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
}

type HTMLRefValue = HTMLElement | null | undefined;
type HTMLRef = MutableRefObject<HTMLRefValue>;

let currentTrap: HTMLRefValue = undefined;

export const useFocusTrap = <
  T extends HTMLElement = HTMLElement,
  K extends HTMLRef = HTMLRef
>({ enabled: controlledEnabled, trigger }: UseFocusTrapArguments<K> = {}) => {
  const enabled = controlledEnabled === undefined ? true : controlledEnabled;
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled && trigger?.current) {
      trigger.current.focus();
    }
  }, [enabled]);

  useEffect(() => {
    if (!ref.current || !enabled) return;

    currentTrap = ref.current;

    const allFocusable = ref.current.querySelectorAll(
      focusableElementsSelector
    );

    const firstFocusable = allFocusable[0];
    const lastFocusable = allFocusable[allFocusable.length - 1];

    const handleKeydown = (ev: KeyboardEvent) => {
      if (ev.key !== 'Tab') return;

      if (ev.shiftKey && document.activeElement === firstFocusable) {
        (lastFocusable as HTMLElement).focus();
      } else if (document.activeElement === lastFocusable) {
        (firstFocusable as HTMLElement).focus();
      }

      ev.preventDefault();
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);

      if (trigger?.current && controlledEnabled === undefined) {
        trigger.current.focus();
      }

      if (currentTrap === ref.current) {
        console.log('WUUUUT');
      }
    };
  }, [enabled, controlledEnabled]);

  return ref;
};

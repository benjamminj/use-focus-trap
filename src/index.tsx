import { useEffect, useRef } from 'react';

const focusableElementsSelector = `
  a[href]:not(:disabled):not([tabindex="-1"]), 
  button:not(:disabled):not([tabindex="-1"]), 
  input:not(:disabled):not([tabindex="-1"]), 
  textarea:not(:disabled):not([tabindex="-1"]), 
  select:not(:disabled):not([tabindex="-1"]), 
  details:not(:disabled):not([tabindex="-1"]), 
  [tabindex]:not(:disabled):not([tabindex="-1"])
`;

export const useFocusTrap = <T extends HTMLElement = HTMLElement>(
  enabled = true
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || !enabled) return;

    const handleFocus = () => {
      const focusedElementInsideContainer = ref.current?.querySelector(
        ':focus-within'
      );

      if (focusedElementInsideContainer) return;

      const firstFocusableElement = ref.current?.querySelector(
        focusableElementsSelector
      );

      if (firstFocusableElement) {
        (firstFocusableElement as HTMLElement).focus();
      }
    };

    window.addEventListener('focusin', handleFocus);

    return () => {
      window.removeEventListener('focusin', handleFocus);
    };
  }, [enabled]);

  return ref;
};

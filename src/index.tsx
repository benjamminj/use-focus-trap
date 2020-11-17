import { useEffect, useRef } from 'react';

const focusableElementsSelector =
  'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';

// TODO: active/inactive boolean
// TODO: return ref? or accept ref as input?
export const useFocusTrap = <T extends HTMLElement = HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

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
  }, []);

  return ref;
};

# use-focus-trap 🔁

React hook that traps focus within a DOM element. Gives you full control of rendering the container and the triggering element.

## Overview

Sometimes when you're building complex UIs you'll need to make sure that user focus stays within a certain element. For example, when you have a modal, you want to keep the user from exiting the modal when they press `Tab` / `Shift + Tab`.

This React hook allows you to create a focus trap and attach it to any DOM element.

When the focus trap is enabled, it will:

- Automatically focus the **first** focusable element within the trap.
- Set focus to the **first** focusable element when pressing `Tab` on the **last** item in the trap.
- Set focus to the **last** focusable element when pressing `Shift + Tab` on the **first** item in the trap.
- Return focus to the trigger element when closing the trap (with some configuration)

## Install

```bash
npm install @benjamminj/use-focus-trap
```

Or, if you prefer `yarn`:

```bash
yarn add @benjamminj/use-focus-trap
```

## Usage

### Default usage

By default, `useFocusTrap` will trap any incoming tab events after it is rendered.

```jsx
import { useFocusTrap } from '@benjamminj/use-focus-trap';

const App = () => {
  const focusTrapRef = useFocusTrap();

  return (
    <div>
      {/* Focus will be trapped inside of this div */}
      <div ref={focusTrapRef}>
        <button>item #1</button>
        <button>item #2</button>
        <button>item #3</button>
      </div>

      {/* This button will not receive focus while the trap is active */}
      <button>outside!</button>
    </div>
  );
};
```

### Manually toggling the trap on/off

You can also manually control whether the focus trap is enabled or disabled.

```jsx
import { useFocusTrap } from '@benjamminj/use-focus-trap';

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const focusTrapRef = useFocusTrap({ enabled: isEnabled });
  return (
    <div>
      <button onClick={() => setIsEnabled(true)}>enable</button>

      <div></div>
    </div>
  );
};
```

### Returning focus to a trigger element when the trap closes

You can have the trap automatically shift focus to an element of your choosing upon closing the trap.

```jsx
import { useFocusTrap } from '@benjamminj/use-focus-trap';

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const triggerRef = useRef(null);
  const focusTrapRef = useFocusTrap({
    enabled: isEnabled,
    trigger: triggerRef,
  });

  return (
    <div>
      <button onClick={() => setIsEnabled(true)} ref={triggerRef}>
        enable
      </button>

      <div ref={focusTrapRef}>
        <button>inner 1</button>
        <button>inner 2</button>
      </div>
    </div>
  );
};
```

## TypeScript

`useFocusTrap` is written in TypeScript and accepts 1 generic parameter. You can use this to customize the type of ref that the hook returns.

```tsx
const App = () => {
  const focusTrapRef = useFocusTrap<HTMLDivElement>();
  return (
    <div>
      <div ref={focusTrapRef}>
        <button>inside trap 1</button>
        <button>inside trap 2</button>
      </div>
      <button>outside</button>
    </div>
  );
};
```

## Contributing

Any PRs and issues are welcome!

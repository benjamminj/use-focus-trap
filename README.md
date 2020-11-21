# use-focus-trap 🔁

<!-- TODO: badges -->

<!-- TODO: description -->

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

### Manually toggling the trap on/off

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

### 🚨 Warnings!

## TypeScript

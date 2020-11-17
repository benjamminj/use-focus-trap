import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useFocusTrap } from '../.';

const Trap = (props: { children: React.ReactNode }) => {
  const ref = useFocusTrap<HTMLDivElement>();

  return <div ref={ref}>{props.children}</div>;
};

const App = () => {
  return (
    <div>
      <Trap>
        <button>inside #1</button>
        <button>inside #2</button>
        <button>inside #3</button>
      </Trap>

      <button>outside</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

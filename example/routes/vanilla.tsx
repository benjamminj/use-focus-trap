import 'react-app-polyfill/ie11';
import * as React from 'react';
import { createFocusTrap } from '../../src/vanilla';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

type ElementRef = React.MutableRefObject<HTMLElement | null>;

const Trap = <T extends ElementRef = ElementRef>({
  id = 'trap',
  ...props
}: {
  children: React.ReactNode;
  enabled?: boolean;
  trigger?: T;
  id?: string;
}) => {
  React.useEffect(() => {
    const el = document.getElementById(id);
    console.log('>>>', el);
    const trap = createFocusTrap(el, {});
    console.log('>>', trap);
    trap.enable();

    return () => {
      trap.disable();
    };
  }, []);

  return <div id="trap">{props.children}</div>;
};

const Basic = () => {
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

const Controlled = () => {
  const trap = React.useRef<any>();
  React.useEffect(() => {
    const el = document.getElementById('trap');
    trap.current = createFocusTrap(el, {});
    trap.current.enable();
  }, []);

  return (
    <div>
      <div id="trap">
        <button>1</button>
        <button>2</button>
        <button onClick={() => trap.current.disable()}>toggle</button>
      </div>

      <button>outside</button>
    </div>
  );
};

const ReturnFocusToTrigger = () => {
  const trap = React.useRef<any>();
  React.useEffect(() => {
    const el = document.getElementById('trap');
    const trigger = document.getElementById('trigger');
    trap.current = createFocusTrap(el, { triggerElement: trigger });
  }, []);

  return (
    <div>
      <button id="trigger" onClick={() => trap.current.enable()}>
        trigger on
      </button>

      <div id="trap">
        <button>inside #1</button>
        <button>inside #2</button>
        <button onClick={() => trap.current.disable()}>trigger off</button>
      </div>
      <button>outside</button>
    </div>
  );
};

const MultipleTrapsNoTriggerRefs = () => {
  // const [firstEnabled, setFirstEnabled] = React.useState(false);
  // const [secondEnabled, setSecondEnabled] = React.useState(false);

  const trap1 = React.useRef<any>();
  const trap2 = React.useRef<any>();

  React.useEffect(() => {
    const el = document.getElementById('trap1');
    trap1.current = createFocusTrap(el);
  }, []);

  React.useEffect(() => {
    const el = document.getElementById('trap2');
    trap2.current = createFocusTrap(el);
  }, []);

  return (
    <div>
      <h1>Sibling traps</h1>
      <div id="trap1">
        <button onClick={() => trap1.current.enable()}>toggle first on</button>
        <button>inside first</button>
        <button onClick={() => trap2.current.enable()}>toggle second on</button>
        <button onClick={() => trap1.current.disable()}>
          toggle first off
        </button>
      </div>
      <div id="trap2">
        <button>second #1</button>
        <button>second #2</button>
        <button onClick={() => trap2.current.disable()}>
          toggle second off
        </button>
      </div>
      <button>outside</button>
    </div>
  );
};

const MultipleTrapsWithTriggerRefs = () => {
  const trap1 = React.useRef<any>();
  const trap2 = React.useRef<any>();

  React.useEffect(() => {
    const el = document.getElementById('trap1');
    trap1.current = createFocusTrap(el);
  }, []);

  React.useEffect(() => {
    const el = document.getElementById('trap2');
    const trigger = document.getElementById('trigger2');
    trap2.current = createFocusTrap(el, { triggerElement: trigger });
  }, []);

  return (
    <div>
      <h1>Sibling traps (with triggers)</h1>
      <div id="trap1">
        <button onClick={() => trap1.current.enable()}>toggle first on</button>
        <button>inside first</button>
        <button id="trigger2" onClick={() => trap2.current.enable()}>
          toggle second on
        </button>
        <button onClick={() => trap1.current.disable()}>
          toggle first off
        </button>
      </div>
      <div id="trap2">
        <button>second #1</button>
        <button>second #2</button>
        <button onClick={() => trap2.current.disable()}>
          toggle second off
        </button>
      </div>
      <button>outside</button>
    </div>
  );
};

const NestedTraps = () => {
  const outer = React.useRef<any>();
  const inner = React.useRef<any>();

  React.useEffect(() => {
    const el = document.getElementById('outer');
    outer.current = createFocusTrap(el);
  }, []);

  const [innerEnabled, setInnerEnabled] = React.useState(false);
  React.useEffect(() => {
    if (!innerEnabled) return;
    const el = document.getElementById('inner');
    if (!el) return;

    const trigger = document.getElementById('innerTrigger');
    inner.current = createFocusTrap(el, { triggerElement: trigger });
    inner.current.enable();

    return () => {
      inner.current.disable();
    };
  }, [innerEnabled]);

  return (
    <div>
      <h1>Nested traps</h1>
      <div id="outer">
        <button onClick={() => outer.current.enable()}>enable outer</button>
        <button
          id="innerTrigger"
          onClick={() => {
            setInnerEnabled(true);
          }}
        >
          enable inner
        </button>

        {innerEnabled && (
          <div id="inner">
            <button>inner #1</button>
            <button onClick={() => setInnerEnabled(false)}>close inner</button>
          </div>
        )}

        <button onClick={() => outer.current.disable()}>close outer</button>
      </div>
      <button>outside</button>
    </div>
  );
};

const AddingNodes = () => {
  const [showHidden, setShowHidden] = React.useState(false);
  return (
    <div>
      <Trap>
        <button>first</button>
        <button onClick={() => setShowHidden(true)}>show hidden items</button>
        {showHidden && (
          <>
            <button>hidden #1</button>
            <button>hidden #2</button>
          </>
        )}
      </Trap>
      <button>outside</button>
    </div>
  );
};

const RemovingNodes = () => {
  const [showHidden, setShowHidden] = React.useState(true);
  return (
    <div>
      <Trap>
        <button>first</button>
        <button onClick={() => setShowHidden(false)}>
          remove hidden items
        </button>
        {showHidden && (
          <>
            <button>hidden #1</button>
            <button>hidden #2</button>
          </>
        )}
      </Trap>
      <button>outside</button>
    </div>
  );
};

const ControlledAutoFocusOff = () => {
  const trap = React.useRef<any>();
  React.useEffect(() => {
    const el = document.getElementById('trap');
    trap.current = createFocusTrap(el);
  }, []);

  return (
    <>
      <button onClick={() => trap.current.enable({ autoFocus: false })}>
        enable
      </button>
      <div id="trap">
        <button>first</button>
        <button>second</button>
      </div>
    </>
  );
};

// const UncontrolledAutoFocusOff = () => {
//   const ref = useFocusTrap<HTMLDivElement>({ autoFocus: false });
//   return (
//     <div>
//       <button>outer</button>
//       <div ref={ref}>
//         <button>first</button>
//         <button>second</button>
//       </div>
//     </div>
//   );
// };

export const VanillaRouter = () => {
  return (
    <Switch>
      <Route path="/vanilla/basic" exact>
        <Basic />
      </Route>
      <Route path="/vanilla/elements/input" exact>
        <Trap>
          <label>
            Input #1
            <input id="1" />
          </label>
          <label>
            Input #2
            <input id="2" />
          </label>
        </Trap>
        <button>outside</button>
      </Route>
      <Route path="/vanilla/elements/select" exact>
        <Trap>
          <label>
            Number
            <select id="number">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>

          <label>
            Letter
            <select id="letter">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </label>
        </Trap>
        <button>outside</button>
      </Route>

      <Route path="/vanilla/elements/textarea" exact>
        <Trap>
          <label>
            First
            <textarea id="1"></textarea>
          </label>
          <label>
            Second
            <textarea id="2"></textarea>
          </label>
        </Trap>
        <button>outside</button>
      </Route>
      <Route path="/vanilla/elements/anchor" exact>
        <Trap>
          <a href="https://google.com">google</a>
          <a href="https://amazon.com">amazon</a>
        </Trap>
        <button>outside</button>
      </Route>
      <Route path="/vanilla/elements/anchor-no-href" exact>
        <Trap>
          <a>none</a>
          <a href="https://google.com">google</a>
          <a href="https://amazon.com">amazon</a>
        </Trap>
        <button>outside</button>
      </Route>
      <Route path="/vanilla/elements/zero-tabindex" exact>
        <Trap>
          <div id="1" tabIndex={0}>
            1
          </div>
          <div id="2" tabIndex={0}>
            2
          </div>
        </Trap>
        <button>outside</button>
      </Route>
      <Route path="/vanilla/elements/negative-tabindex" exact>
        <Trap>
          <button id="1" tabIndex={-1}>
            1
          </button>
          <div id="2" tabIndex={0}>
            2
          </div>
          <div id="3" tabIndex={0}>
            3
          </div>
        </Trap>
        <button>outside</button>
      </Route>
      <Route path="/vanilla/elements/disabled" exact>
        <Trap>
          <button id="1" disabled>
            1
          </button>
          <button id="2">2</button>
          <button id="3">3</button>
        </Trap>
        <button>outside</button>
      </Route>
      <Route path="/vanilla/controlled" exact>
        <Controlled />
      </Route>
      <Route path="/vanilla/return-focus-to-trigger" exact>
        <ReturnFocusToTrigger />
      </Route>

      <Route path="/vanilla/last-dom-element" exact>
        <Trap>
          <button>inside #1</button>
          <button>inside #2</button>
        </Trap>
      </Route>

      <Route path="/vanilla/multiple-traps-no-trigger-refs" exact>
        <MultipleTrapsNoTriggerRefs />
      </Route>

      <Route path="/vanilla/multiple-traps-trigger-refs" exact>
        <MultipleTrapsWithTriggerRefs />
      </Route>

      <Route path="/vanilla/loop-backwards" exact>
        <Trap>
          <button>inside #1</button>
          <button>inside #2</button>
          <button>inside #3</button>
        </Trap>
      </Route>
      <Route path="/vanilla/nested-traps" exact>
        <NestedTraps />
      </Route>

      <Route path="/vanilla/adding-nodes" exact>
        <AddingNodes />
      </Route>

      <Route path="/vanilla/removing-nodes" exact>
        <RemovingNodes />
      </Route>
      <Route path="/vanilla/disable-auto-focus/controlled" exact>
        <ControlledAutoFocusOff />
      </Route>
    </Switch>
  );
};

import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useFocusTrap } from '../.';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

type ElementRef = React.MutableRefObject<HTMLElement | null>;

const Trap = <T extends ElementRef = ElementRef>(props: {
  children: React.ReactNode;
  enabled?: boolean;
  trigger?: T;
}) => {
  const ref = useFocusTrap<HTMLDivElement>({
    enabled: props.enabled,
    trigger: props.trigger,
  });

  return <div ref={ref}>{props.children}</div>;
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

const Controlled = ({ children, initialState = true }) => {
  const state = React.useState(true);

  return children(state);
};

const ReturnFocusToTrigger = () => {
  const [enabled, setEnabled] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const focusTrapRef = useFocusTrap<HTMLDivElement>({
    enabled,
    trigger: triggerRef,
  });

  return (
    <div>
      <h1>Trap is {enabled ? 'on' : 'off'}</h1>

      <button ref={triggerRef} onClick={() => setEnabled(true)}>
        trigger on
      </button>

      <div ref={focusTrapRef}>
        <button>inside #1</button>
        <button>inside #2</button>
        <button onClick={() => setEnabled(false)}>trigger off</button>
      </div>
      <button>outside</button>
    </div>
  );
};

const ReturnFocusOnUnmount = () => {
  const [enabled, setEnabled] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div>
      <h1>Trap is {enabled ? 'on' : 'off'}</h1>

      <button ref={triggerRef} onClick={() => setEnabled(e => !e)}>
        toggle
      </button>

      {enabled && (
        <Trap trigger={triggerRef}>
          <button>inside #1</button>
          <button>inside #2</button>
          <button onClick={() => setEnabled(false)}>close</button>
        </Trap>
      )}
    </div>
  );
};

const MultipleTrapsNoTriggerRefs = () => {
  const [firstEnabled, setFirstEnabled] = React.useState(false);
  const [secondEnabled, setSecondEnabled] = React.useState(false);

  return (
    <div>
      <h1>Sibling traps</h1>
      <Trap enabled={firstEnabled}>
        <h2>First is {firstEnabled ? 'on' : 'off'}</h2>
        <button onClick={() => setFirstEnabled(x => !x)}>toggle first</button>
        <button>inside first</button>
        <button onClick={() => setSecondEnabled(true)}>toggle second on</button>
      </Trap>
      <Trap enabled={secondEnabled}>
        <h2>Second is {secondEnabled ? 'on' : 'off'}</h2>
        <button>second #1</button>
        <button>second #2</button>
        <button onClick={() => setSecondEnabled(false)}>
          toggle second off
        </button>
      </Trap>
      <button>outside</button>
    </div>
  );
};

const MultipleTrapsWithTriggerRefs = () => {
  const [firstEnabled, setFirstEnabled] = React.useState(false);
  const [secondEnabled, setSecondEnabled] = React.useState(false);
  const secondTriggerRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div>
      <h1>Sibling traps</h1>
      <Trap enabled={firstEnabled}>
        <h2>First is {firstEnabled ? 'on' : 'off'}</h2>
        <button onClick={() => setFirstEnabled(x => !x)}>toggle first</button>
        <button>inside first</button>
        <button onClick={() => setSecondEnabled(true)} ref={secondTriggerRef}>
          toggle second on
        </button>
      </Trap>
      <Trap enabled={secondEnabled} trigger={secondTriggerRef}>
        <h2>Second is {secondEnabled ? 'on' : 'off'}</h2>
        <button>second #1</button>
        <button>second #2</button>
        <button onClick={() => setSecondEnabled(false)}>
          toggle second off
        </button>
      </Trap>
      <button>outside</button>
    </div>
  );
};

const NestedTraps = () => {
  const [firstEnabled, setFirstEnabled] = React.useState(false);
  const [secondEnabled, setSecondEnabled] = React.useState(false);
  const secondTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div>
      <h1>Nested traps</h1>
      <Trap enabled={firstEnabled}>
        <h2>Outer trap is {firstEnabled ? 'on' : 'off'}</h2>
        <button onClick={() => setFirstEnabled(true)}>enable outer</button>
        <button onClick={() => setSecondEnabled(true)} ref={secondTriggerRef}>
          enable inner
        </button>

        {secondEnabled && (
          <Trap trigger={secondTriggerRef}>
            <h3>Inner trap is {secondEnabled ? 'on' : 'off'}</h3>
            <button>inner #1</button>
            <button
              onClick={() => {
                setSecondEnabled(false);
              }}
            >
              close inner
            </button>
          </Trap>
        )}

        <button onClick={() => setFirstEnabled(false)}>close outer</button>
      </Trap>
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
  const [enabled, setEnabled] = React.useState(false);
  const ref = useFocusTrap<HTMLDivElement>({ enabled, autoFocus: false });
  return (
    <>
      <button onClick={() => setEnabled(true)}>enable</button>
      <div ref={ref}>
        <button>first</button>
        <button>second</button>
      </div>
    </>
  );
};

const UncontrolledAutoFocusOff = () => {
  const ref = useFocusTrap<HTMLDivElement>({ autoFocus: false });
  return (
    <div>
      <button>outer</button>
      <div ref={ref}>
        <button>first</button>
        <button>second</button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Basic />
        </Route>
        <Route path="/elements/input" exact>
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
        <Route path="/elements/select" exact>
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

        <Route path="/elements/textarea" exact>
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
        <Route path="/elements/anchor" exact>
          <Trap>
            <a href="https://google.com">google</a>
            <a href="https://amazon.com">amazon</a>
          </Trap>
          <button>outside</button>
        </Route>
        <Route path="/elements/anchor-no-href" exact>
          <Trap>
            <a>none</a>
            <a href="https://google.com">google</a>
            <a href="https://amazon.com">amazon</a>
          </Trap>
          <button>outside</button>
        </Route>
        <Route path="/elements/zero-tabindex" exact>
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
        <Route path="/elements/negative-tabindex" exact>
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
        <Route path="/elements/disabled" exact>
          <Trap>
            <button id="1" disabled>
              1
            </button>
            <button id="2">2</button>
            <button id="3">3</button>
          </Trap>
          <button>outside</button>
        </Route>
        <Route path="/controlled" exact>
          <Controlled>
            {([trapped, setTrapped]) => (
              <>
                <h1>Focus trap is {trapped ? 'on' : 'off'}</h1>
                <Trap enabled={trapped}>
                  <button>1</button>
                  <button>2</button>
                  <button onClick={() => setTrapped(t => !t)}>toggle</button>
                </Trap>
                <button>outside</button>
              </>
            )}
          </Controlled>
        </Route>

        <Route path="/return-focus-to-trigger" exact>
          <ReturnFocusToTrigger />
        </Route>

        <Route path="/return-focus-on-unmount" exact>
          <ReturnFocusOnUnmount />
        </Route>

        <Route path="/last-dom-element" exact>
          <Trap>
            <button>inside #1</button>
            <button>inside #2</button>
          </Trap>
        </Route>

        <Route path="/loop-backwards" exact>
          <Trap>
            <button>inside #1</button>
            <button>inside #2</button>
            <button>inside #3</button>
          </Trap>
        </Route>

        <Route path="/multiple-traps-no-trigger-refs" exact>
          <MultipleTrapsNoTriggerRefs />
        </Route>

        <Route path="/multiple-traps-trigger-refs" exact>
          <MultipleTrapsWithTriggerRefs />
        </Route>

        <Route path="/nested-traps" exact>
          <NestedTraps />
        </Route>

        <Route path="/adding-nodes" exact>
          <AddingNodes />
        </Route>

        <Route path="/removing-nodes" exact>
          <RemovingNodes />
        </Route>

        <Route path="/disable-auto-focus/controlled" exact>
          <ControlledAutoFocusOff />
        </Route>

        <Route path="/disable-auto-focus/uncontrolled" exact>
          <UncontrolledAutoFocusOff />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

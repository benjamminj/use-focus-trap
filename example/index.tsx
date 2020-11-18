import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useFocusTrap } from '../.';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const Trap = (props: { children: React.ReactNode; enabled?: boolean }) => {
  const ref = useFocusTrap<HTMLDivElement>(props.enabled);

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

  console.log(state[0]);
  return children(state);
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
        <Route path="/controlled-outside" exact>
          <Trap></Trap>
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

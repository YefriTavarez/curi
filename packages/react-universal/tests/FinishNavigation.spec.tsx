import "jest";
import React from "react";
import ReactDOM from "react-dom";
import { curi } from "@curi/router";
import InMemory from "@hickory/in-memory";

// @ts-ignore (resolved by jest)
import { curiProvider, FinishNavigation } from "@curi/react-universal";

describe("<FinishNavigation>", () => {
  let node;
  const routes = [{ name: "Home", path: "" }, { name: "About", path: "about" }];

  beforeEach(() => {
    node = document.createElement("div");
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  it('"finishes" navigation after mounting', () => {
    const history = InMemory();
    const router = curi(history, routes, { suspend: true });
    const Router = curiProvider(router);

    let navigations = [];
    // intercept and mock navigation.finish()
    router.observe(
      ({ navigation }) => {
        navigation.finish = jest.fn();
        navigations.push(navigation);
      }
    );

    ReactDOM.render(
      <Router>
        {({ navigation }) => {
          expect(navigation.finish.mock.calls.length).toBe(0);
          return (
            <FinishNavigation>
              <div>Yo</div>
            </FinishNavigation>
          );
        }}
      </Router>,
      node,
      () => {
        expect(navigations[0].finish.mock.calls.length).toBe(1);
      }
    );
  });

  it('"finishes" navigation after updating', () => {
    const history = InMemory();
    const router = curi(history, routes, { suspend: true });
    const Router = curiProvider(router);

    let navigations = [];
    // intercept and mock navigation.finish()
    router.observe(
      ({ navigation }) => {
        navigation.finish = jest.fn();
        navigations.push(navigation);
      }
    );

    ReactDOM.render(
      <Router>
        {({ navigation }) => {
          expect(navigation.finish.mock.calls.length).toBe(0);
          return (
            <FinishNavigation>
              <div>Yo</div>
            </FinishNavigation>
          );
        }}
      </Router>,
      node
    );
    expect(navigations[0].finish.mock.calls.length).toBe(1);

    router.navigate({ name: "About" });
    expect(navigations[1].finish.mock.calls.length).toBe(1);
  });
});

import React from "react";
import { Provider } from "./Context";

import {
  CuriRouter,
  Response,
  Emitted,
} from "@curi/router";

export type CuriRenderFn = (props: Emitted) => React.ReactNode;

export interface RouterProps {
  children: CuriRenderFn;
  suspend?: boolean;
}

export interface RouterState {
  emitted: Emitted;
}

export default function curiProvider(router: CuriRouter) {
  return class Router extends React.Component<RouterProps, RouterState> {
    stopResponding: () => void;
    removed: boolean;
    current: Response;

    constructor(props: RouterProps) {
      super(props);
      this.state = {
        emitted: {
          ...router.current(),
          router
        }
      };
      this.current = this.state.emitted.response;
    }

    shouldComponentUpdate(nextProps: RouterProps, nextState: RouterState) {
      if (nextProps.suspend) {
        return nextState.emitted.response === this.current;
      }
      return true;
    }

    componentDidMount() {
      this.setupRespond(router);
    }

    setupRespond(router: CuriRouter) {
      this.stopResponding = router.observe(
        (emitted: Emitted) => {
          this.current = emitted.response;
          if (!this.removed) {
            if (this.props.suspend) {
              setTimeout(() => {
                this.setState({ emitted });
              });
            } else {
              this.setState({ emitted });
            }
          }
        },
        { initial: false }
      );
    }

    componentWillUnmount() {
      this.removed = true;
      /* istanbul ignore else */
      if (this.stopResponding) {
        this.stopResponding();
      }
    }

    render() {
      const { children } = this.props;
      return (
        <Provider value={this.state.emitted}>
          {children(this.state.emitted)}
        </Provider>
      );
    }
  };
}

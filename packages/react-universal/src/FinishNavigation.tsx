import React from "react";

import { Curious } from "./Context";

import { Navigation } from "@curi/router";

export interface FinishNavigationProps {
  children: any;
}

export interface BaseFinishNavigationProps extends FinishNavigationProps {
  navigation: Navigation;
}

class FinishNavigation extends React.Component<BaseFinishNavigationProps> {
  componentDidMount() {
    this.finish();
  }

  componentDidUpdate() {
    this.finish();
  }

  finish() {
    if (this.props.navigation.finish) {
      this.props.navigation.finish();
    }
  }

  render() {
    return this.props.children;
  }
}

export default (props: FinishNavigationProps) => (
  <Curious>
    {({ navigation }) => (
      <FinishNavigation {...props} navigation={navigation} />
    )}
  </Curious>
);

/// <reference types="react" />
import { Navigation } from "@curi/router";
export interface FinishNavigationProps {
    children: any;
}
export interface BaseFinishNavigationProps extends FinishNavigationProps {
    navigation: Navigation;
}
declare const _default: (props: FinishNavigationProps) => JSX.Element;
export default _default;

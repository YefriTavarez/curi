import React from "react";

import CodeSandboxDemo from "../../../components/CodeSandboxDemo";
import {
  InlineJS as IJS,
  InlineComponent as Cmp
} from "../../../components/highlight/Inline";
import { Note } from "../../../components/Messages";
import { Section } from "../../../components/layout/Sections";

const meta = {
  title: "Basics"
};

export default function BasicExample() {
  return (
    <React.Fragment>
      <h1>{meta.title}</h1>

      <Section title="Explanation" id="explanation">
        <p>
          While Vue does have an official router, this project shows how you
          could use Curi as the router for a Vue project instead. It uses{" "}
          <Cmp>curi-link</Cmp> component provided by the the{" "}
          <IJS>@curi/vue</IJS> package.
        </p>
      </Section>

      <Section title="Live Demo" id="demo">
        <CodeSandboxDemo id="github/pshrmn/curi/tree/master/examples/vue/basic" />
      </Section>

      <Section title="On GitHub" id="source">
        <p>
          If you want to run this code locally, the source code is available on
          GitHub{" "}
          <a href="https://github.com/pshrmn/curi/tree/master/examples/vue/basic">
            here
          </a>.
        </p>
      </Section>
    </React.Fragment>
  );
}

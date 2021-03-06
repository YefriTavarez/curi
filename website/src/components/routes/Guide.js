import React from "react";

import GuideTemplate from "../templates/Guide";

export default function GuidePage({ response }) {
  const Content = response.data.content;
  return (
    <GuideTemplate>
      <Content />
    </GuideTemplate>
  );
}

import React from "react";

/** Header logo (light background version) */
export const HeaderLogo: React.FC = () => (
  <img
    src="/apex-logo-white-background.png"
    alt="Apex Consulting"
    className="hq-logo hq-logo--header"
    style={{ display: "block" }}
  />
);

/** Footer logo (dark background version) */
export const FooterLogo: React.FC = () => (
  <img
    src="/apex-logo-black-background.png"
    alt="Apex Consulting"
    className="hq-logo hq-logo--footer"
    style={{ display: "block" }}
  />
);

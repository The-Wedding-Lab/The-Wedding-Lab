"use client";

import { Global, css } from "@emotion/react";

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: var(--font-pretendard) !important;
  }
  ul {
    list-style: none;
  }
`;

const GlobalStyles = () => <Global styles={globalStyles} />;

export default GlobalStyles;

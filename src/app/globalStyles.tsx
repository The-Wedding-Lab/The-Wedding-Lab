"use client";

import { Global, css } from "@emotion/react";

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: var(--font-pretendard) !important;
  }
  body {
    overflow: hidden; /* 웹뷰 환경에서 전체 스크롤 방지 */
  }
`;

const GlobalStyles = () => <Global styles={globalStyles} />;

export default GlobalStyles;

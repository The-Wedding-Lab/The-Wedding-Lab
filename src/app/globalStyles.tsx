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
  /* styles/sakura.css 또는 styles/globals.css에 추가 */
  .sakura {
    position: absolute;
    top: 0;
    animation: fall 8s linear infinite;
    z-index: 10;
    opacity: 0.9;
    pointer-events: none;
  }

  @keyframes fall {
    0% {
      transform: translateX(0) translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateX(-100vw) translateY(100vh) rotate(1500deg);
      opacity: 0;
    }
`;

const GlobalStyles = () => <Global styles={globalStyles} />;

export default GlobalStyles;

// components/SakuraSample.tsx
"use client"; // 클라이언트 컴포넌트일 경우 추가

import Script from "next/script";
import { useEffect, useRef } from "react";

const SakuraSample = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const Sakura = (window as any).Sakura;
    if (Sakura && containerRef.current) {
      const sakura = new Sakura(".sakura-area");
      return () => sakura.stop(true);
    }
  }, []);

  return (
    <>
      <Script src="/sakura.min.js" strategy="beforeInteractive" />
      <div
        ref={containerRef}
        className="sakura-area"
        style={{
          backgroundColor: "black",
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          pointerEvents: "none",
          textAlign: "center",
          fontSize: "40px",
          color: "#fff",
        }}
      >
        저희 결혼합니다
      </div>
    </>
  );
};

export default SakuraSample;

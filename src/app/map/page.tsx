<<<<<<< Updated upstream
"use client";
=======
import MapPage from "@/page/map/mapPage";
>>>>>>> Stashed changes

import MapApiPage from "@/page/map/MapApiPage";
import styled from "@emotion/styled";

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 24px;
`;

export default function MapPage() {
  return (
    <main>
      <section>
        <Title>오시는 길</Title>
        <MapApiPage />
      </section>
    </main>
  );
}

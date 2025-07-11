"use client";

import { ParentsInfo } from "@/components/family/ParentsInfo";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";

const FamilyInfoPage = () => {
  const { setupData } = useWeddingDataStore();

  return (
    <>
      <ParentsInfo
        groomFather={{
          name: setupData.weddingInfo.groom.father.name,
          deceased: setupData.weddingInfo.groom.father.deceased,
        }}
        groomMother={{ name: setupData.weddingInfo.groom.mother.name }}
        groomName={setupData.weddingInfo.groom.name}
        brideFather={{ name: setupData.weddingInfo.bride.father.name }}
        brideMother={{
          name: setupData.weddingInfo.bride.mother.name,
          deceased: setupData.weddingInfo.bride.mother.deceased,
        }}
        brideName={setupData.weddingInfo.bride.name}
        backgroundColor="#f4f0ea"
      />
    </>
  );
};

export default FamilyInfoPage;

"use client";

import { ParentsInfo } from "@/components/family/ParentsInfo";

const FamilyInfoPage = () => {
  return (
    <>
      <ParentsInfo
        groomFather={{ name: "김가명", deceased: true }}
        groomMother={{ name: "이가짜" }}
        groomName="홍길동"
        brideFather={{ name: "박가명" }}
        brideMother={{ name: "황이름", deceased: true }}
        brideName="김민지"
        backgroundColor="#f4f0ea"
      />
    </>
  );
};

export default FamilyInfoPage;

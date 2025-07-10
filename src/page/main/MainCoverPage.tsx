"use client";
import { InvitationCover } from "@/components/main/InvitationCover";
const MainCoverPage = () => {
  return (
    <>
      <InvitationCover
        imageUrl="/wedding-cover.jpg"
        groomName="홍길동"
        brideName="김민지"
        message={"결혼해서 잘 살겠습니다"} // or "", or "   " → 기본 문구로 표시
      />
    </>
  );
};

export default MainCoverPage;

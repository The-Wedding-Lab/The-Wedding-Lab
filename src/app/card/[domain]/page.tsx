import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import WeddingCardView from "@/components/wedding/WeddingCardView";

const prisma = new PrismaClient();

interface WeddingCardPageProps {
  params: {
    domain: string;
  };
}

// 메타데이터 생성
export async function generateMetadata({ params }: WeddingCardPageProps) {
  const { domain } = params;

  try {
    const weddingData = await prisma.wedding_data.findUnique({
      where: {
        wedding_domain: domain,
      },
    });

    if (!weddingData) {
      return {
        title: "페이지를 찾을 수 없습니다",
        description: "요청하신 청첩장을 찾을 수 없습니다.",
      };
    }

    const setupData = JSON.parse(weddingData.wedding_data);
    const groomName = setupData?.groom?.name || "신랑";
    const brideName = setupData?.bride?.name || "신부";
    const weddingDate = setupData?.weddingDateTime || "";

    return {
      title: `${groomName} ♥ ${brideName}의 결혼식에 초대합니다`,
      description: `${groomName}과 ${brideName}의 결혼식이 ${weddingDate}에 있습니다. 축복해 주세요!`,
      openGraph: {
        title: `${groomName} ♥ ${brideName}의 결혼식`,
        description: `${groomName}과 ${brideName}의 결혼식에 여러분을 초대합니다`,
        type: "website",
        locale: "ko_KR",
        images: setupData?.og?.image ? [setupData.og.image] : [],
      },
    };
  } catch (error) {
    console.error("메타데이터 생성 오류:", error);
    return {
      title: "모바일 청첩장",
      description: "결혼식에 여러분을 초대합니다.",
    };
  }
}

export default async function WeddingCardPage({
  params,
}: WeddingCardPageProps) {
  const { domain } = params;

  try {
    // 데이터베이스에서 웨딩 데이터 조회
    const weddingData = await prisma.wedding_data.findUnique({
      where: {
        wedding_domain: domain,
      },
    });

    // 데이터가 없으면 404
    if (!weddingData) {
      notFound();
    }

    // JSON 파싱하여 setupData 복원
    const weddingInfo = JSON.parse(weddingData.wedding_data);

    return (
      <WeddingCardView
        weddinginfo={weddingInfo}
        domain={domain}
        weddingId={weddingData.wedding_id}
      />
    );
  } catch (error) {
    console.error("웨딩 카드 로딩 오류:", error);
    notFound();
  }
}

// 정적 경로 생성 (선택사항 - 많은 도메인이 있을 경우 제거)
export async function generateStaticParams() {
  try {
    const weddingDomains = await prisma.wedding_data.findMany({
      select: {
        wedding_domain: true,
      },
      take: 100, // 최대 100개만 미리 생성
    });

    return weddingDomains.map((wedding) => ({
      domain: wedding.wedding_domain,
    }));
  } catch (error) {
    console.error("정적 경로 생성 오류:", error);
    return [];
  }
}

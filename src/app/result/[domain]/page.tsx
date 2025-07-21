import Step6_Result from "@/components/setup/steps/Step6_Result";
import ClientLayout from "@/app/ClientLayout";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Result({
  params,
}: {
  params: { domain: string };
}) {
  const { domain } = params;
  let groomName = "";
  let brideName = "";
  let weddingDate = "";
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
    groomName = setupData?.groom?.name || "신랑";
    brideName = setupData?.bride?.name || "신부";
    weddingDate = setupData?.weddingDateTime || "";
  } catch (error) {
    console.error("웨딩 카드 로딩 오류:", error);
  }

  return (
    <ClientLayout>
      <Step6_Result
        domain={domain}
        groomName={groomName}
        brideName={brideName}
        weddingDate={weddingDate}
      />
    </ClientLayout>
  );
}

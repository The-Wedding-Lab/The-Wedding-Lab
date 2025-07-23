import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 특정 웨딩 ID로 웨딩 데이터 조회 (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "웨딩 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 웨딩 데이터 조회
    const weddingData = await prisma.wedding_data.findUnique({
      where: {
        wedding_id: id,
      },
      select: {
        wedding_id: true,
        wedding_domain: true,
        wedding_data: true,
        created_at: true,
        updated_at: true,
        wedding_cover_image_url: true,
      },
    });

    if (!weddingData) {
      return NextResponse.json(
        { error: "존재하지 않는 웨딩입니다." },
        { status: 404 }
      );
    }

    // wedding_data JSON 파싱
    let parsedWeddingData;
    try {
      parsedWeddingData = JSON.parse(weddingData.wedding_data);
    } catch (parseError) {
      console.error("웨딩 데이터 파싱 오류:", parseError);
      return NextResponse.json(
        { error: "웨딩 데이터 형식이 올바르지 않습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      wedding: {
        wedding_id: weddingData.wedding_id,
        wedding_domain: weddingData.wedding_domain,
        wedding_data: parsedWeddingData,
        created_at: weddingData.created_at,
        updated_at: weddingData.updated_at,
        wedding_cover_image_url: weddingData.wedding_cover_image_url,
      },
    });
  } catch (error) {
    console.error("웨딩 데이터 조회 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

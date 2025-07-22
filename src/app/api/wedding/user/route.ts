import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 사용자의 웨딩 청첩장 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 사용자 존재 확인
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "존재하지 않는 사용자입니다." },
        { status: 404 }
      );
    }

    // 사용자의 웨딩 청첩장 목록 조회
    const weddingList = await prisma.wedding_data.findMany({
      where: { user_id: userId },
      select: {
        wedding_id: true,
        wedding_domain: true,
        wedding_data: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({
      success: true,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
      },
      weddingList,
      totalCount: weddingList.length,
    });
  } catch (error) {
    console.error("사용자 웨딩 목록 조회 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 웨딩 청첩장 삭제 (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { weddingId, userId } = body;

    if (!weddingId || !userId) {
      return NextResponse.json(
        { error: "웨딩 ID와 사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 웨딩 데이터 존재 확인 및 소유권 확인
    const wedding = await prisma.wedding_data.findFirst({
      where: {
        wedding_id: weddingId,
        user_id: userId,
      },
    });

    if (!wedding) {
      return NextResponse.json(
        { error: "존재하지 않거나 삭제 권한이 없는 웨딩입니다." },
        { status: 404 }
      );
    }

    // 관련된 community 데이터도 함께 삭제 (CASCADE)
    await prisma.community.deleteMany({
      where: { wedding_id: weddingId },
    });

    // 웨딩 데이터 삭제
    await prisma.wedding_data.delete({
      where: { wedding_id: weddingId },
    });

    return NextResponse.json({
      success: true,
      message: "웨딩 청첩장이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("웨딩 삭제 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

// 도메인 중복 확인 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "도메인을 입력해주세요." },
        { status: 400 }
      );
    }

    // 도메인 형식 검증
    const validChars = /^[a-zA-Z0-9]*$/;
    if (!validChars.test(domain)) {
      return NextResponse.json(
        { error: "영어, 숫자만 입력 가능합니다." },
        { status: 400 }
      );
    }

    if (domain.length > 10) {
      return NextResponse.json(
        { error: "10자 이하로 입력해주세요." },
        { status: 400 }
      );
    }

    // 데이터베이스에서 도메인 중복 확인
    const existingWedding = await prisma.wedding_data.findUnique({
      where: {
        wedding_domain: domain,
      },
    });

    if (existingWedding) {
      return NextResponse.json(
        { available: false, message: "이미 사용중인 도메인입니다." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      available: true,
      message: `'${domain}' 도메인을 사용할 수 있습니다!`,
    });
  } catch (error) {
    console.error("도메인 확인 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 웨딩 데이터 저장 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, weddingInfo, userId } = body;

    if (!domain || !weddingInfo) {
      return NextResponse.json(
        { error: "도메인과 웨딩 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    // 도메인 형식 재검증
    const validChars = /^[a-zA-Z0-9]*$/;
    if (!validChars.test(domain) || domain.length > 10) {
      return NextResponse.json(
        { error: "유효하지 않은 도메인입니다." },
        { status: 400 }
      );
    }

    // 도메인 중복 재확인
    const existingWedding = await prisma.wedding_data.findUnique({
      where: {
        wedding_domain: domain,
      },
    });

    if (existingWedding) {
      return NextResponse.json(
        { error: "이미 사용중인 도메인입니다." },
        { status: 409 }
      );
    }

    // 웨딩 데이터 생성
    const weddingId = nanoid(20);
    const newWedding = await prisma.wedding_data.create({
      data: {
        wedding_id: weddingId,
        wedding_domain: domain,
        user_id: userId,
        wedding_data: JSON.stringify(weddingInfo),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "모바일 청첩장이 성공적으로 생성되었습니다!",
        wedding_id: newWedding.wedding_id,
        domain: newWedding.wedding_domain,
        url: `https://wedding.com/card/${domain}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("웨딩 데이터 저장 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 웨딩 데이터 업데이트 (PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, setupData } = body;

    if (!domain || !setupData) {
      return NextResponse.json(
        { error: "도메인과 웨딩 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    // 기존 웨딩 데이터 확인
    const existingWedding = await prisma.wedding_data.findUnique({
      where: {
        wedding_domain: domain,
      },
    });

    if (!existingWedding) {
      return NextResponse.json(
        { error: "존재하지 않는 도메인입니다." },
        { status: 404 }
      );
    }

    // 웨딩 데이터 업데이트
    const updatedWedding = await prisma.wedding_data.update({
      where: {
        wedding_domain: domain,
      },
      data: {
        wedding_data: JSON.stringify(setupData),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "모바일 청첩장이 성공적으로 업데이트되었습니다!",
      wedding_id: updatedWedding.wedding_id,
      domain: updatedWedding.wedding_domain,
    });
  } catch (error) {
    console.error("웨딩 데이터 업데이트 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

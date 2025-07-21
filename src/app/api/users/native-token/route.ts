import { update_user_native_token } from "@/db/users";
import { NextRequest, NextResponse } from "next/server";

/**
 * 네이티브 토큰 업데이트
 * @param req 요청 userId, nativeToken
 * @returns 응답
 *
 * 200: 토큰 업데이트 성공
 * 400: 필드 누락
 * 500: 서버 오류
 */

export const POST = async (req: NextRequest) => {
  try {
    const { userId, nativeToken } = await req.json();

    if (!userId || !nativeToken) {
      return NextResponse.json(
        { message: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    const user = await update_user_native_token(userId, nativeToken);

    return NextResponse.json(
      { message: "토큰 업데이트 성공" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
};

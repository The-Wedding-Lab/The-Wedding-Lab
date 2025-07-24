import { get_user_by_email } from "@/db/users";
import { generateToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * 로그인
 * @param req 요청 user_email, user_pw
 * @returns 응답
 * 200: 로그인 성공 (토큰 포함)
 * 400: 필드 누락
 * 401: 비밀번호 불일치
 * 404: 유저 없음
 * 500: 서버 오류
 */

export const POST = async (req: NextRequest) => {
  try {
    const { user_email, user_pw } = await req.json();

    if (!user_email || !user_pw) {
      return NextResponse.json(
        { message: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    const user = await get_user_by_email(user_email);
    if (!user) {
      return NextResponse.json(
        { message: "이메일이 존재하지 않습니다." },
        { status: 404 }
      );
    }

    if (user.user_pw !== user_pw) {
      return NextResponse.json(
        { message: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = generateToken({
      userId: Number(user.user_id),
      email: user.user_email,
      name: user.user_name,
    });

    return NextResponse.json(
      {
        message: "로그인 성공",
        token,
        user: {
          id: user.user_id,
          email: user.user_email,
          name: user.user_name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("로그인 API 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
};

import { get_user_by_email, insert_user } from "@/db/users";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * 회원가입
 * @param req 요청 user_email, user_pw, user_name
 * @returns 응답
 * 200: 회원가입 성공
 * 400: 필드 누락
 * 409: 이미 존재하는 이메일
 * 500: 서버 오류
 */

export const POST = async (req: NextRequest) => {
  const { user_email, user_pw, user_name } = await req.json();
  if (!user_email || !user_pw || !user_name) {
    return NextResponse.json({ message: "필수 필드 누락" }, { status: 400 });
  }
  const user = await get_user_by_email(user_email);
  if (user) {
    return NextResponse.json(
      { message: "이미 존재하는 이메일" },
      { status: 400 }
    );
  }
  const userInsert = await insert_user({
    user_email,
    user_pw,
    user_name,
  });
  return NextResponse.json({ message: "회원가입 성공" }, { status: 200 });
};

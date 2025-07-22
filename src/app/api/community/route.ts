import { NextRequest, NextResponse } from "next/server";
import { get_wedding_post } from "@/db/community";
import { create_community_post } from "@/db/community";

export async function GET(request: Request) {
  try {
    // URL에서 offset과 limit 파라미터를 가져옵니다. (페이지네이션 구현 시)
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // 데이터베이스에서 데이터를 가져오는 함수 호출
    const posts = await get_wedding_post({ offset, limit });

    // 성공 시, 가져온 데이터를 JSON 형태로 클라이언트에 반환
    return NextResponse.json(posts);
  } catch (error) {
    // 💣 try 블록 내부(get_wedding_post 포함)에서 오류 발생 시 이 부분이 실행됩니다.

    // 1. 서버 터미널에 실제 에러 로그를 출력 (디버깅에 필수)
    console.error("API 라우트 처리 중 에러 발생:", error);

    // 2. 클라이언트에게는 표준화된 JSON 에러 메시지와 500 상태 코드를 반환
    return NextResponse.json(
      { message: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, imageUrl } = await request.json();

    // 🔐 실제로는 로그인 사용자 ID를 세션에서 받아야 함
    const userId = "user123";

    const newPost = await create_community_post({ title, imageUrl, userId });
    return NextResponse.json(newPost);
  } catch (err) {
    console.error("청첩장 생성 실패:", err);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}

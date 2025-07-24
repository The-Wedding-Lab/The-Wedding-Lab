import { NextRequest, NextResponse } from "next/server";
import { get_wedding_post } from "@/db/community";
import { create_community_post } from "@/db/community";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const posts = await get_wedding_post({ offset, limit });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("API 라우트 처리 중 에러 발생:", error);

    return NextResponse.json(
      { message: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, userId, weddingId } = await request.json();

    const newPost = await create_community_post({ title, userId, weddingId });
    return NextResponse.json(newPost);
  } catch (err) {
    console.error("청첩장 생성 실패:", err);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}

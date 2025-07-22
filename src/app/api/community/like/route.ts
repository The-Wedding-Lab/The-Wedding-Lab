import { NextResponse } from "next/server";
import { toggle_like_post } from "@/db/community"; // 상대 경로에 맞게 조정하세요

export async function POST(request: Request) {
  try {
    const { id, liked } = await request.json();

    const updated = await toggle_like_post({ id, liked });

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("좋아요 업데이트 실패:", err);
    return NextResponse.json(
      { success: false, error: "서버 에러" },
      { status: 500 }
    );
  }
}

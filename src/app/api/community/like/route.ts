import { NextResponse } from "next/server";
import { toggle_like_post } from "@/db/community"; // 상대 경로에 맞게 조정하세요
import { prisma } from "@/db/config/prisma";

export async function POST(request: Request) {
  try {
    const { id, liked, userId, title } = await request.json();

    const updated = await toggle_like_post({ id, liked });

    console.log(updated);

    // 좋아요 누른 사람 이름
    const userName = await prisma.users.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        user_name: true,
      },
    });

    // 좋아요 당한 게시물 소유자 아이디
    const poster_id = await prisma.community.findUnique({
      where: {
        id: id,
      },
      select: {
        user_id: true,
      },
    });

    // 좋아요 당한 게시물 소유자 토큰
    const userToken = await prisma.users.findUnique({
      where: {
        user_id: poster_id?.user_id,
      },
      select: {
        native_token: true,
      },
    });

    //expo 푸시 알림 전송
    if (!liked && userToken?.native_token) {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userToken?.native_token,
          title: `모청 :: 모두의 청첩장`,
          body: `${userName?.user_name}님이 회원님의 [${title}] 청첩장을 좋아합니다.`,
          data: {
            id,
          },
          sound: "default",
          badge: 1,
        }),
      });
    }

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("좋아요 업데이트 실패:", err);
    return NextResponse.json(
      { success: false, error: "서버 에러" },
      { status: 500 }
    );
  }
}

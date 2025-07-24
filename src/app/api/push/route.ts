import { NextRequest, NextResponse } from "next/server";

interface PushNotificationRequest {
  to: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
}

export async function POST(request: NextRequest) {
  try {
    const {
      to,
      title,
      body,
      data,
      sound = "default",
      badge,
    }: PushNotificationRequest = await request.json();

    // 필수 필드 검증
    if (!to || !title || !body) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다 (to, title, body)" },
        { status: 400 }
      );
    }

    // Expo 푸시 토큰 형식 검증
    if (
      !to.startsWith("ExponentPushToken[") &&
      !to.startsWith("ExpoPushToken[")
    ) {
      return NextResponse.json(
        { error: "유효하지 않은 Expo 푸시 토큰 형식입니다" },
        { status: 400 }
      );
    }

    // Expo 푸시 알림 전송
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        title,
        body,
        data,
        sound,
        badge,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Expo 푸시 알림 전송 실패:", result);
      return NextResponse.json(
        { error: "푸시 알림 전송에 실패했습니다", details: result },
        { status: response.status }
      );
    }

    console.log("푸시 알림 전송 성공:", result);
    return NextResponse.json({
      success: true,
      message: "푸시 알림이 성공적으로 전송되었습니다",
      data: result,
    });
  } catch (error) {
    console.error("푸시 알림 전송 중 오류:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// 여러 개의 푸시 알림을 한번에 전송하는 엔드포인트
export async function PUT(request: NextRequest) {
  try {
    const { notifications }: { notifications: PushNotificationRequest[] } =
      await request.json();

    if (!Array.isArray(notifications) || notifications.length === 0) {
      return NextResponse.json(
        { error: "유효한 알림 배열이 필요합니다" },
        { status: 400 }
      );
    }

    // 각 알림 검증
    for (const notification of notifications) {
      if (!notification.to || !notification.title || !notification.body) {
        return NextResponse.json(
          { error: "모든 알림에 필수 필드가 있어야 합니다 (to, title, body)" },
          { status: 400 }
        );
      }
    }

    // Expo 푸시 알림 일괄 전송
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notifications),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Expo 푸시 알림 일괄 전송 실패:", result);
      return NextResponse.json(
        { error: "푸시 알림 일괄 전송에 실패했습니다", details: result },
        { status: response.status }
      );
    }

    console.log("푸시 알림 일괄 전송 성공:", result);
    return NextResponse.json({
      success: true,
      message: "푸시 알림이 성공적으로 전송되었습니다",
      data: result,
    });
  } catch (error) {
    console.error("푸시 알림 일괄 전송 중 오류:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

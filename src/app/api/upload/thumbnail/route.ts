import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const uploadDir = path.join(process.cwd(), "public", "thumbnails");

// 업로드 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // 파일 크기 확인 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    const userId = request.headers.get("x-user-id") || "anonymous";
    const uniqueId = nanoid();

    // 파일 확장자 추출
    const fileExtension = path.extname(file.name);

    // 새 파일명 생성: user_id_uniqueId.extension
    const newFilename = `${userId}_${uniqueId}${fileExtension}`;
    const newFilePath = path.join(uploadDir, newFilename);

    // 파일을 ArrayBuffer로 읽어서 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일 저장
    fs.writeFileSync(newFilePath, buffer);

    // 상대 경로 반환
    const relativePath = `/thumbnails/${newFilename}`;

    return NextResponse.json({
      success: true,
      path: relativePath,
      message: "썸네일 업로드 성공",
    });
  } catch (error) {
    console.error("썸네일 업로드 에러:", error);
    return NextResponse.json(
      {
        error: "썸네일 업로드 실패",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}

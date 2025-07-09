import { PrismaClient } from "@prisma/client";

// 전역 변수로 prisma 인스턴스를 선언
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [], // 모든 로그를 비활성화합니다
  });

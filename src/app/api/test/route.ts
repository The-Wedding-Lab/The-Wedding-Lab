import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (req: NextRequest) => {
  const prisma = new PrismaClient();

    const posts = await prisma.community.findMany({
      skip: 0,
      take: 10,
      orderBy: {
        created_at: "desc", // 최신순 정렬
      },
      select: {
        id: true,
        user_id: true,
        title: true,
        wedding_data: true,
        likes: true,
        liked: true,
        created_at: true,
      },
    });

  const raw_query = await prisma.$queryRaw`
  SELECT wedding_id FROM community
  `;

  //   return NextResponse.json({ posts, raw_query });
  return NextResponse.json({ raw_query });
};

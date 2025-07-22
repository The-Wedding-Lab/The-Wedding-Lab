import { prisma } from "../config/prisma";
import { nanoid } from "nanoid";

interface CreatePostInput {
  title: string;
  imageUrl: string;
  userId: string; // 로그인 사용자 ID
}

// 커뮤니티 post 데이터 get
export const get_wedding_post = async ({ offset = 0, limit = 10 }) => {
  console.log("여기 들어와?");
  const posts = await prisma.community.findMany({
    skip: offset,
    take: limit,
    orderBy: {
      //! 에러나는 부분입니다
      // created_at: "desc", // 최신순 정렬
    },
    select: {
      id: true,
      userId: true,
      title: true,
      weddingData: true,
      likes: true,
      liked: true,
      createdAt: true,
    },
  });

  return posts;
};

export const create_community_post = async ({
  title,
  imageUrl,
  userId,
}: CreatePostInput) => {
  const post = await prisma.community.create({
    data: {
      id: nanoid(10),
      userId: userId,
      title,
      // weddingId: null,
      likes: 0,
      liked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return {
    id: post.id,
    title: post.title,
    imageUrl,
    likes: post.likes,
    liked: post.liked,
    author: "me",
  };
};

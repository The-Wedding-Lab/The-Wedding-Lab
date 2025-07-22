import { prisma } from "../config/prisma";
import { nanoid } from "nanoid";

interface CreatePostInput {
  title: string;
  imageUrl: string;
  userId: string; // 로그인 사용자 ID
}

// 커뮤니티 post 데이터 get
export const get_wedding_post = async ({ offset = 0, limit = 10 }) => {
  const posts = await prisma.community.findMany({
    skip: offset,
    take: limit,
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
      user_id: userId,
      title,
      wedding_id: null,
      likes: 0,
      liked: false,
      created_at: new Date(),
      updated_at: new Date(),
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

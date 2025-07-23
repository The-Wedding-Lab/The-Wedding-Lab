import { prisma } from "../config/prisma";
import { nanoid } from "nanoid";

interface CreatePostInput {
  title: string;
  userId: string; // 로그인 사용자 ID
  weddingId: string;
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
      likes: true,
      liked: true,
      created_at: true,
      wedding_data: {
        select: {
          wedding_cover_image_url: true,
        },
      },
    },
  });

  return posts;
};

export const create_community_post = async ({
  title,
  userId,
  weddingId,
}: CreatePostInput) => {
  const post = await prisma.community.create({
    data: {
      id: nanoid(10),
      user_id: userId,
      title,
      wedding_id: weddingId,
      likes: 0,
      liked: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return {
    id: post.id,
    title: post.title,
    likes: post.likes,
    liked: post.liked,
  };
};

export const toggle_like_post = async ({
  id,
  liked,
}: {
  id: string;
  liked: boolean;
}) => {
  const updated = await prisma.community.update({
    where: { id },
    data: {
      liked: !liked,
      likes: liked ? { decrement: 1 } : { increment: 1 },
    },
  });

  return updated;
};

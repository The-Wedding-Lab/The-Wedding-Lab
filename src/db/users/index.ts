import dayjs from "dayjs";
import { prisma } from "../config/prisma";
import { nanoid } from "nanoid";

interface User {
  user_email: string;
  user_name: string;
  user_pw: string;
}

// 유저 생성
export const insert_user = async (user: User) => {
  const userInsert = await prisma.users.create({
    data: {
      user_id: nanoid(10),
      user_email: user.user_email,
      user_name: user.user_name,
      user_pw: user.user_pw,
      created_at: dayjs().toDate(),
      updated_at: dayjs().toDate(),
    },
  });

  return userInsert;
};

export const get_user = async (user_id: string) => {
  const user = await prisma.users.findUnique({
    where: {
      user_id: user_id,
    },
  });
  return user;
};

export const get_user_by_email = async (user_email: string) => {
  const user = await prisma.users.findUnique({
    where: {
      user_email: user_email,
    },
  });
  return user;
};

export const update_user_native_token = async (
  userId: string,
  nativeToken: string
) => {
  const user = await prisma.users.update({
    where: {
      user_id: userId,
    },
    data: {
      native_token: nativeToken,
    },
  });
};

import { sign, verify, decode, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT 토큰 생성
 */
export function generateToken(
  payload: Omit<JWTPayload, "iat" | "exp">
): string {
  return sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
}

/**
 * JWT 토큰 검증
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = verify(token, JWT_SECRET);
    return decoded as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * JWT 토큰 디코딩 (검증 없이)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = decode(token);
    return decoded as JWTPayload;
  } catch (error) {
    return null;
  }
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TokenStorage } from "@/lib/tokenStorage";
import { decodeToken, JWTPayload } from "@/lib/jwt";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface UserState {
  // 상태
  user: User | null;
  tokenInfo: JWTPayload | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  // 액션들
  actions: {
    // 유저 데이터 로드
    loadUserData: () => Promise<void>;

    // 로그인 처리
    setLogin: (user: User, token: string) => void;

    // 로그아웃 처리
    logout: () => Promise<void>;

    // 유저 정보 업데이트
    updateUser: (user: Partial<User>) => void;

    // 토큰 유효성 검사
    validateToken: () => boolean;

    // 로딩 상태 설정
    setLoading: (loading: boolean) => void;
  };
}

const initialState = {
  user: null,
  tokenInfo: null,
  isLoggedIn: false,
  isLoading: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      actions: {
        // 저장된 유저 데이터 로드
        loadUserData: async () => {
          set({ isLoading: true });

          try {
            // 저장된 사용자 정보 가져오기
            const savedUser = await TokenStorage.getUser();
            const token = await TokenStorage.getToken();

            if (savedUser && token) {
              // JWT 토큰 디코딩
              const decoded = decodeToken(token);

              // 토큰 유효성 확인
              if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
                set({
                  user: savedUser,
                  tokenInfo: decoded,
                  isLoggedIn: true,
                  isLoading: false,
                });
                return;
              } else {
                // 토큰 만료된 경우 로그아웃
                await get().actions.logout();
                return;
              }
            }

            // 유저 정보가 없는 경우
            set({
              user: null,
              tokenInfo: null,
              isLoggedIn: false,
              isLoading: false,
            });
          } catch (error) {
            console.error("사용자 데이터 로드 실패:", error);
            set({
              user: null,
              tokenInfo: null,
              isLoggedIn: false,
              isLoading: false,
            });
          }
        },

        // 로그인 처리
        setLogin: (user: User, token: string) => {
          try {
            const decoded = decodeToken(token);
            if (decoded) {
              set({
                user,
                tokenInfo: decoded,
                isLoggedIn: true,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error("로그인 처리 실패:", error);
          }
        },

        // 로그아웃 처리
        logout: async () => {
          try {
            await TokenStorage.clearAuth();
            set({
              user: null,
              tokenInfo: null,
              isLoggedIn: false,
              isLoading: false,
            });
          } catch (error) {
            console.error("로그아웃 처리 실패:", error);
          }
        },

        // 유저 정보 업데이트
        updateUser: (updatedUser: Partial<User>) => {
          const { user } = get();
          if (user) {
            const newUser = { ...user, ...updatedUser };
            set({ user: newUser });
            // TokenStorage에도 업데이트
            TokenStorage.setUser(newUser);
          }
        },

        // 토큰 유효성 검사
        validateToken: () => {
          const { tokenInfo } = get();
          if (!tokenInfo?.exp) return false;

          const isValid = tokenInfo.exp * 1000 > Date.now();
          if (!isValid) {
            // 토큰이 만료된 경우 자동 로그아웃
            get().actions.logout();
          }
          return isValid;
        },

        // 로딩 상태 설정
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
      },
    }),
    {
      name: "user-storage",
      // persist에서 actions는 제외
      partialize: (state) => ({
        user: state.user,
        tokenInfo: state.tokenInfo,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

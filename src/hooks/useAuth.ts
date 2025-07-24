import { useMutation } from "@tanstack/react-query";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { TokenStorage } from "@/lib/tokenStorage";

interface SignupData {
  user_name: string;
  user_email: string;
  user_pw: string;
}

interface LoginData {
  user_email: string;
  user_pw: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// 회원가입 API 호출
const signupUser = async (data: SignupData) => {
  const response = await fetch("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "회원가입에 실패했습니다.");
  }

  return response.json();
};

// 로그인 API 호출
const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "로그인에 실패했습니다.");
  }

  return response.json();
};

// 회원가입 훅
export const useSignup = () => {
  const { showStackSnackbar } = useSnackbarStore();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      showStackSnackbar("회원가입이 완료되었습니다!", { variant: "success" });
    },
    onError: (error: Error) => {
      showStackSnackbar(error.message, { variant: "error" });
    },
  });
};

// 로그인 훅
export const useLogin = () => {
  const { showStackSnackbar } = useSnackbarStore();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data: LoginResponse) => {
      // 토큰과 사용자 정보 저장
      await TokenStorage.setToken(data.token);
      await TokenStorage.setUser(data.user);

      // React Native에 로그인 성공 알림 (토큰과 함께)
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "LOGIN_SUCCESS",
            token: data.token,
            user: data.user,
          })
        );
      }
    },
    onError: (error: Error) => {
      showStackSnackbar(error.message, { variant: "error" });
    },
  });
};

// 로그아웃 훅
export const useLogout = () => {
  const { showStackSnackbar } = useSnackbarStore();

  return useMutation({
    mutationFn: async () => {
      await TokenStorage.clearAuth();
      return true;
    },
    onSuccess: () => {
      showStackSnackbar("로그아웃되었습니다.", { variant: "success" });

      // React Native에 로그아웃 알림
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "LOGOUT_SUCCESS",
          })
        );
      }
    },
    onError: (error: Error) => {
      showStackSnackbar("로그아웃 중 오류가 발생했습니다.", {
        variant: "error",
      });
    },
  });
};

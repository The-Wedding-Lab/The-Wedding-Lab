/**
 * React Native WebView와 웹 환경에서 호환되는 토큰 저장소
 */

// React Native WebView 환경인지 확인
const isReactNativeWebView =
  typeof window !== "undefined" && window.ReactNativeWebView;

export class TokenStorage {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly USER_KEY = "auth_user";

  /**
   * 토큰 저장
   */
  static async setToken(token: string): Promise<void> {
    try {
      if (isReactNativeWebView) {
        // React Native에 토큰 저장 요청
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "SET_TOKEN",
            token,
          })
        );
      } else {
        // 웹 환경에서는 localStorage 사용
        localStorage.setItem(this.TOKEN_KEY, token);
      }
    } catch (error) {
      console.error("토큰 저장 실패:", error);
    }
  }

  /**
   * 토큰 조회
   */
  static async getToken(): Promise<string | null> {
    try {
      if (isReactNativeWebView) {
        // React Native에서 토큰 요청
        return new Promise((resolve) => {
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({
              type: "GET_TOKEN",
            })
          );

          // React Native에서 응답을 받기 위한 이벤트 리스너
          const handleMessage = (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data);
              if (data.type === "TOKEN_RESPONSE") {
                resolve(data.token || null);
                window.removeEventListener("message", handleMessage);
              }
            } catch (error) {
              resolve(null);
            }
          };

          window.addEventListener("message", handleMessage);

          // 타임아웃 설정 (3초)
          setTimeout(() => {
            window.removeEventListener("message", handleMessage);
            resolve(null);
          }, 3000);
        });
      } else {
        // 웹 환경에서는 localStorage 사용
        return localStorage.getItem(this.TOKEN_KEY);
      }
    } catch (error) {
      console.error("토큰 조회 실패:", error);
      return null;
    }
  }

  /**
   * 사용자 정보 저장
   */
  static async setUser(user: any): Promise<void> {
    try {
      if (isReactNativeWebView) {
        // React Native에 사용자 정보 저장 요청
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "SET_USER",
            user,
          })
        );
      } else {
        // 웹 환경에서는 localStorage 사용
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error("사용자 정보 저장 실패:", error);
    }
  }

  /**
   * 사용자 정보 조회
   */
  static async getUser(): Promise<any | null> {
    try {
      if (isReactNativeWebView) {
        // React Native에서 사용자 정보 요청
        return new Promise((resolve) => {
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({
              type: "GET_USER",
            })
          );

          const handleMessage = (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data);
              if (data.type === "USER_RESPONSE") {
                resolve(data.user || null);
                window.removeEventListener("message", handleMessage);
              }
            } catch (error) {
              resolve(null);
            }
          };

          window.addEventListener("message", handleMessage);

          setTimeout(() => {
            window.removeEventListener("message", handleMessage);
            resolve(null);
          }, 3000);
        });
      } else {
        // 웹 환경에서는 localStorage 사용
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      return null;
    }
  }

  /**
   * 로그아웃 (토큰 및 사용자 정보 삭제)
   */
  static async clearAuth(): Promise<void> {
    try {
      if (isReactNativeWebView) {
        // React Native에 로그아웃 요청
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "CLEAR_AUTH",
          })
        );
      } else {
        // 웹 환경에서는 localStorage 사용
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      }
    } catch (error) {
      console.error("인증 정보 삭제 실패:", error);
    }
  }
}

// React Native WebView 타입 확장
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

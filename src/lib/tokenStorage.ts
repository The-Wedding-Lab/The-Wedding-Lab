/**
 * React Native WebView와 웹 환경에서 호환되는 토큰 저장소
 */

// 전역 콜백 함수들을 위한 타입 확장
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export class TokenStorage {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly USER_KEY = "auth_user";

  /**
   * React Native WebView 환경인지 동적으로 확인
   */
  private static isReactNativeWebView(): boolean {
    if (typeof window === "undefined") return false;
    return !!window.ReactNativeWebView;
  }

  /**
   * 토큰 저장
   */
  static async setToken(token: string): Promise<void> {
    try {
      console.log("TokenStorage.setToken 호출:", { token });

      if (this.isReactNativeWebView()) {
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
      console.log("TokenStorage.getToken 호출");

      if (this.isReactNativeWebView()) {
        // React Native에서 토큰 요청 (응답은 localStorage로 받음)
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "GET_TOKEN",
          })
        );

        // 잠시 대기 후 localStorage에서 읽기
        await new Promise((resolve) => setTimeout(resolve, 100));
        const token = localStorage.getItem(this.TOKEN_KEY);
        console.log("React Native 환경에서 토큰 조회:", token);
        return token;
      } else {
        // 웹 환경에서는 localStorage 사용
        const token = localStorage.getItem(this.TOKEN_KEY);
        console.log("웹 환경에서 토큰 조회:", token);
        return token;
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
      console.log("TokenStorage.setUser 호출:", { user });

      if (this.isReactNativeWebView()) {
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
      console.log("TokenStorage.getUser 호출");

      if (this.isReactNativeWebView()) {
        // React Native에서 사용자 정보 요청 (응답은 localStorage로 받음)
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "GET_USER",
          })
        );

        // 잠시 대기 후 localStorage에서 읽기
        await new Promise((resolve) => setTimeout(resolve, 100));
        const userStr = localStorage.getItem(this.USER_KEY);
        const user = userStr ? JSON.parse(userStr) : null;
        console.log("React Native 환경에서 사용자 정보 조회:", user);
        return user;
      } else {
        // 웹 환경에서는 localStorage 사용
        const userStr = localStorage.getItem(this.USER_KEY);
        const user = userStr ? JSON.parse(userStr) : null;
        console.log("웹 환경에서 사용자 정보 조회:", user);
        return user;
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
      console.log("TokenStorage.clearAuth 호출");

      if (this.isReactNativeWebView()) {
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

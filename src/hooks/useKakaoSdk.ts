import { useState, useEffect } from "react";

interface KakaoSdk {
  Share: {
    sendDefault: (params: any) => void;
  };
  init: (appKey: string) => void;
  isInitialized: () => boolean;
}

interface UseKakaoSdkReturn {
  kakao: KakaoSdk | null;
  isLoaded: boolean;
  isInitialized: boolean;
}

export const useKakaoSdk = (): UseKakaoSdkReturn => {
  const [kakao, setKakao] = useState<KakaoSdk | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 150; // 최대 15초 (100ms * 150)
    let timeoutId: NodeJS.Timeout | null = null;

    const initializeKakao = (kakaoSdk: KakaoSdk) => {
      console.log("✅ 카카오 SDK 발견:", {
        hasInit: typeof kakaoSdk.init === "function",
        hasIsInitialized: typeof kakaoSdk.isInitialized === "function",
        hasShare: !!(kakaoSdk as any).Share,
        version: (kakaoSdk as any).VERSION || "unknown",
      });

      setKakao(kakaoSdk);
      setIsLoaded(true);

      // 카카오 SDK 초기화
      try {
        if (!kakaoSdk.isInitialized()) {
          const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY;
          if (appKey) {
            kakaoSdk.init(appKey);
            setIsInitialized(true);
            console.log("✅ 카카오 SDK 초기화 완료");
          } else {
            console.error("❌ 카카오 앱키가 없습니다.");
          }
        } else {
          setIsInitialized(true);
          console.log("✅ 카카오 SDK 이미 초기화됨");
        }
      } catch (error) {
        console.error("❌ 카카오 SDK 초기화 실패:", error);
      }
    };

    const loadKakaoScript = () => {
      return new Promise<void>((resolve, reject) => {
        // 이미 로드된 스크립트가 있는지 확인
        const existingScript = document.querySelector(
          'script[src*="kakao_js_sdk"]'
        );
        if (existingScript) {
          console.log("🔄 카카오 스크립트 이미 존재함");
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
        script.integrity =
          "sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6";
        script.crossOrigin = "anonymous";
        script.async = true;

        script.onload = () => {
          console.log("✅ 카카오 스크립트 직접 로드 완료");
          resolve();
        };

        script.onerror = (error) => {
          console.error("❌ 카카오 스크립트 직접 로드 실패:", error);
          reject(error);
        };

        document.head.appendChild(script);
      });
    };

    const checkKakaoSdk = () => {
      checkCount++;

      console.log(`🔄 카카오 SDK 체크 #${checkCount}:`, {
        windowExists: typeof window !== "undefined",
        kakaoExists: typeof window !== "undefined" && !!(window as any).Kakao,
        kakaoType:
          typeof window !== "undefined"
            ? typeof (window as any).Kakao
            : "undefined",
        kakaoKeys:
          typeof window !== "undefined" && (window as any).Kakao
            ? Object.keys((window as any).Kakao)
            : [],
      });

      // ⚠️ 중요: window.Kakao (대문자 K)를 체크해야 함!
      if (typeof window !== "undefined" && (window as any).Kakao) {
        const kakaoSdk = (window as any).Kakao as KakaoSdk;
        initializeKakao(kakaoSdk);
      } else {
        // SDK가 아직 로드되지 않았으면 잠시 후 다시 체크
        if (checkCount < maxChecks) {
          timeoutId = setTimeout(checkKakaoSdk, 100);
        } else {
          console.error("❌ 카카오 SDK 로드 타임아웃 (15초 초과)");
        }
      }
    };

    // 카카오 스크립트 로드 시작
    if (typeof window !== "undefined") {
      // 카카오 비동기 초기화 콜백 등록
      (window as any).kakaoAsyncInit = function () {
        console.log("🎯 kakaoAsyncInit 콜백 실행됨");
        if ((window as any).Kakao) {
          initializeKakao((window as any).Kakao);
        }
      };

      // 스크립트 로드 후 체크 시작
      loadKakaoScript()
        .then(() => {
          // 스크립트 로드 완료 후 잠시 대기 후 체크 시작
          timeoutId = setTimeout(checkKakaoSdk, 200);
        })
        .catch((error) => {
          console.error("카카오 스크립트 로드 실패:", error);
          // 실패해도 기존 스크립트가 있을 수 있으니 체크는 진행
          timeoutId = setTimeout(checkKakaoSdk, 200);
        });
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // 클린업 시 콜백 제거
      if (typeof window !== "undefined") {
        delete (window as any).kakaoAsyncInit;
      }
    };
  }, []);

  return {
    kakao,
    isLoaded,
    isInitialized,
  };
};

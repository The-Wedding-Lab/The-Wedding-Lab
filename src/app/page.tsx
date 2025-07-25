"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function Home() {
  const { user, tokenInfo, isLoggedIn, isLoading, actions } = useUserStore();
  const logoutMutation = useLogout();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<any>({});

  // 모든 hooks를 early return 이전에 배치
  useEffect(() => {
    // 컴포넌트 마운트 시 유저 데이터 로드
    actions.loadUserData();
  }, [actions]);

  useEffect(() => {
    // 로그인 상태가 false이고 로딩이 끝났으면 로그인 페이지로 이동
    if (!isLoading && !isLoggedIn) {
      // router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  // 토큰 유효성 검사 (이미 store에서 자동으로 처리됨)
  useEffect(() => {
    if (tokenInfo) {
      actions.validateToken();
    }
  }, [tokenInfo, actions]);

  // 디버깅용: localStorage 직접 확인
  useEffect(() => {
    const checkLocalStorage = () => {
      if (typeof window !== "undefined") {
        const directToken = localStorage.getItem("auth_token");
        const directUser = localStorage.getItem("auth_user");
        const isReactNative = !!window.ReactNativeWebView;

        setDebugInfo({
          directToken,
          directUser,
          isReactNative,
          storeUser: user,
          storeToken: tokenInfo,
          isLoggedIn,
          isLoading,
        });
      }
    };

    checkLocalStorage();

    // 1초마다 체크 (디버깅용)
    const interval = setInterval(checkLocalStorage, 1000);

    return () => clearInterval(interval);
  }, [user, tokenInfo, isLoggedIn, isLoading]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: async () => {
        await actions.logout();
        router.push("/login");
      },
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("ko-KR");
  };

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 로그인되지 않은 경우
  // if (!isLoggedIn) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         minHeight: "100svh",
  //         flexDirection: "column",
  //         gap: 2,
  //       }}
  //     >
  //       <Typography>사용자 정보를 찾을 수 없습니다.</Typography>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         onClick={() => router.push("/login")}
  //       >
  //         로그인 하러가기
  //       </Button>
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      {/* 디버깅 정보 카드 */}
      <Card sx={{ mb: 3, bgcolor: "#f5f5f5" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            디버깅 정보
          </Typography>
          <Typography variant="body2" component="pre" sx={{ fontSize: 12 }}>
            {JSON.stringify(debugInfo, null, 2)}
          </Typography>
          <Button
            size="small"
            onClick={() => {
              actions.loadUserData();
            }}
            sx={{ mt: 1 }}
          >
            유저 데이터 다시 로드
          </Button>
        </CardContent>
      </Card>

      {/* 사용자 정보 카드 */}
      {user && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              사용자 정보
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  이름:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {user.name}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  이메일:
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  사용자 ID:
                </Typography>
                <Chip label={user.id} size="small" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* JWT 토큰 정보 카드 */}
      {tokenInfo && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              JWT 토큰 정보
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  이메일:
                </Typography>
                <Typography variant="body1">{tokenInfo.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  이름:
                </Typography>
                <Typography variant="body1">{tokenInfo.name}</Typography>
              </Box>
              {tokenInfo.iat && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    발급 시간:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(tokenInfo.iat)}
                  </Typography>
                </Box>
              )}
              {tokenInfo.exp && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    만료 시간:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(tokenInfo.exp)}
                  </Typography>
                  <Chip
                    label={tokenInfo.exp * 1000 > Date.now() ? "유효" : "만료"}
                    color={
                      tokenInfo.exp * 1000 > Date.now() ? "success" : "error"
                    }
                    size="small"
                  />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 환경 정보 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🌐 환경 정보
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              플랫폼:
            </Typography>
            <Chip
              label={
                typeof window !== "undefined" && window.ReactNativeWebView
                  ? "React Native WebView"
                  : "웹 브라우저"
              }
              color="primary"
              size="small"
            />
          </Box>
        </CardContent>
      </Card>

      {/* 액션 버튼들 */}
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/onboarding")}
          fullWidth
        >
          청첩장 만들기
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          fullWidth
        >
          {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={async () => {
            try {
              const response = await fetch("/api/push", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  to: "ExponentPushToken[uMO07XIe1FN6rZUvwC-aGF]",
                  title: "Hello",
                  body: "World",
                  badge: 1,
                }),
              });
              const data = await response.json();
              console.log(data);
            } catch (error) {
              console.error(error);
            }
          }}
          fullWidth
        >
          푸쉬알림 테스트
        </Button>
      </Box>
    </Box>
  );
}

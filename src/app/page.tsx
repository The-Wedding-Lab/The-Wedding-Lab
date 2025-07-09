"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { TokenStorage } from "@/lib/tokenStorage";
import { decodeToken, JWTPayload } from "@/lib/jwt";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  name: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [tokenInfo, setTokenInfo] = useState<JWTPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const logoutMutation = useLogout();
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 저장된 사용자 정보 가져오기
        const savedUser = await TokenStorage.getUser();

        // 토큰 가져오기
        const token = await TokenStorage.getToken();

        if (savedUser) {
          setUser(savedUser);
        }

        if (token) {
          // JWT 토큰 디코딩하여 토큰 정보 가져오기
          const decoded = decodeToken(token);
          setTokenInfo(decoded);
        }

        // 둘 다 없으면 로그인 페이지로 이동
        if (!savedUser && !token) {
          router.push("/login");
        }
      } catch (error) {
        console.error("사용자 데이터 로드 실패:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

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

  if (!user && !tokenInfo) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>사용자 정보를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("ko-KR");
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
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
      </Box>
    </Box>
  );
}

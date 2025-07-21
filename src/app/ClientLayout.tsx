"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThemeProvider from "../providers/ThemeProvider";
import GlobalStyles from "./globalStyles";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // QueryClient를 useState로 생성하여 리렌더링 시 새로운 인스턴스가 생성되지 않도록 함
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분
            gcTime: 1000 * 60 * 10, // 10분 (구 cacheTime)
          },
        },
      })
  );

  return (
    <>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SnackbarProvider maxSnack={3}>
            <Box
              sx={{
                width: "100dvw",
                minWidth: "320px",
                maxWidth: "768px",
                minHeight: "100svh",
                overflow: "hidden",
                mx: "auto",
                userSelect: "none",
              }}
            >
              {children}
            </Box>
          </SnackbarProvider>
        </ThemeProvider>
        {/* 개발 환경에서만 로드 */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </>
  );
}

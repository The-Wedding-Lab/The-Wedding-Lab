"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  DialogContentText,
} from "@mui/material";
import {
  Person,
  Visibility,
  Delete,
  Logout,
  CalendarToday,
  Language,
  Refresh,
} from "@mui/icons-material";
import { useUserStore } from "@/store/useUserStore";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import AppButton from "@/components/ui/AppButton";

interface WeddingItem {
  wedding_id: string;
  wedding_domain: string;
  wedding_data: string;
  created_at: string;
  updated_at: string;
}

interface UserWeddingData {
  user: {
    user_id: string;
    user_name: string;
    user_email: string;
  };
  weddingList: WeddingItem[];
  totalCount: number;
}

const PAGE_SIZE = 5;

const MypagePage = () => {
  const { user, actions } = useUserStore();
  const { showStackSnackbar } = useSnackbarStore();
  const router = useRouter();

  const [userData, setUserData] = useState<UserWeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWedding, setSelectedWedding] = useState<WeddingItem | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [weddingListAll, setWeddingListAll] = useState<WeddingItem[]>([]);
  const [renderedList, setRenderedList] = useState<WeddingItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewWedding, setViewWedding] = useState<WeddingItem | null>(null);

  // 모바일 터치 최적화 스타일
  const touchStyle = {
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    MozUserSelect: "none",
  };

  useEffect(() => {
    actions.loadUserData();
  }, [actions]);

  // 최초 1회 전체 데이터 불러오기
  const fetchUserWeddings = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await axios.get(`/api/wedding/user?userId=${user.id}`);
      if (response.data.success) {
        setUserData(response.data);
        setWeddingListAll(response.data.weddingList);
        setRenderedList(response.data.weddingList.slice(0, PAGE_SIZE));
        setPage(1);
        setHasMore(response.data.weddingList.length > PAGE_SIZE);
      } else {
        showStackSnackbar("데이터를 불러오는데 실패했습니다.", {
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error("웨딩 목록 조회 오류:", error);
      showStackSnackbar(
        error.response?.data?.error || "네트워크 오류가 발생했습니다.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id, showStackSnackbar]);

  // 무한스크롤: 렌더링만 5개씩 추가
  useEffect(() => {
    if (!hasMore || loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 100px 0px",
        threshold: 0.01,
      }
    );
    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);
    return () => observer.current?.disconnect();
  }, [hasMore, loading]);

  // page 변경 시 렌더링만 추가
  useEffect(() => {
    if (page === 1) return;
    const next = weddingListAll.slice(0, page * PAGE_SIZE);
    setRenderedList(next);
    setHasMore(weddingListAll.length > next.length);
  }, [page, weddingListAll]);

  // 최초 1회 로드
  useEffect(() => {
    if (user?.id) {
      fetchUserWeddings();
    }
  }, [user?.id, fetchUserWeddings]);

  // 웨딩 삭제
  const handleDeleteWedding = async () => {
    if (!selectedWedding || !user?.id) return;
    try {
      setDeleting(true);
      const response = await axios.delete("/api/wedding/user", {
        data: {
          weddingId: selectedWedding.wedding_id,
          userId: user.id,
        },
      });
      if (response.data.success) {
        showStackSnackbar("웨딩 청첩장이 삭제되었습니다.", {
          variant: "success",
        });
        // 삭제 후 전체 목록 새로고침 및 렌더링 초기화
        fetchUserWeddings();
      }
    } catch (error: any) {
      console.error("웨딩 삭제 오류:", error);
      showStackSnackbar(
        error.response?.data?.error || "삭제 중 오류가 발생했습니다.",
        { variant: "error" }
      );
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedWedding(null);
    }
  };

  // 웨딩 보기
  const handleViewWedding = (wedding: WeddingItem) => {
    window.open(`/card/${wedding.wedding_domain}`, "_blank");
  };

  // 로그아웃
  const handleLogout = () => {
    actions.logout();
    router.push("/login");
    showStackSnackbar("로그아웃되었습니다.", { variant: "info" });
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 웨딩 데이터에서 신랑/신부 이름 추출
  const getWeddingNames = (weddingData: string) => {
    try {
      const data = JSON.parse(weddingData);
      const groomName = data.groom?.name || "신랑";
      const brideName = data.bride?.name || "신부";
      return `${groomName} ♥ ${brideName}`;
    } catch {
      return "웨딩 청첩장";
    }
  };

  // 로그인 상태 확인
  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        pb: 4,
        ...touchStyle,
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          backgroundColor: "white",
          p: 3,
          borderBottom: "1px solid #e0e0e0",
          ...touchStyle,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              backgroundColor: "#006ffd",
              fontSize: "1.5rem",
              ...touchStyle,
            }}
          >
            <Person sx={{ fontSize: "2rem" }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} color="#333">
              {userData?.user.user_name || user.name || "사용자"}
            </Typography>
            <Typography variant="body2" color="#666">
              {userData?.user.user_email || user.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 웨딩 목록 */}
      <Box sx={{ p: 3, mb: 3 }}>
        {/* 상단 제목 sticky */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#f5f5f5",
            pb: 1,
            ...touchStyle,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography fontSize={18} fontWeight={700} color="#333">
              내 청첩장 목록 ({userData?.totalCount || 0})
            </Typography>
            <IconButton onClick={fetchUserWeddings}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {/* 카드 목록 maxHeight + 스크롤 */}
        <Box
          sx={{
            maxHeight: "50vh",
            overflowY: "auto",
            pr: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            ...touchStyle,
          }}
        >
          {loading && page === 1 ? (
            <Box
              sx={{
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : renderedList.length === 0 ? (
            <Card
              sx={{
                textAlign: "center",
                py: 4,
                ...touchStyle,
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  py: 4,
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#666",
                  ...touchStyle,
                }}
              >
                아직 만든 청첩장이 없습니다!
              </Typography>
            </Card>
          ) : (
            <>
              {renderedList.map((wedding: WeddingItem) => (
                <Card
                  key={wedding.wedding_id}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    position: "relative",
                    ...touchStyle,
                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: "0 4px 16px rgba(0,111,253,0.08)",
                    background:
                      "linear-gradient(145deg, #fff 0%, #f8fbff 100%)",
                    border: "1px solid rgba(0,111,253,0.08)",
                    cursor: "pointer",
                    height: "120px",
                    display: "flex",
                    alignItems: "stretch",
                    minHeight: "120px",
                    maxHeight: "140px",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,111,253,0.15)",
                      transform: "translateY(-2px) scale(1.01)",
                    },
                    "&:active": {
                      boxShadow: "0 2px 8px rgba(0,111,253,0.08)",
                      transform: "translateY(1px) scale(0.99)",
                    },
                    "@media (hover: none)": {
                      "&:hover": {
                        boxShadow: "0 4px 16px rgba(0,111,253,0.08)",
                        transform: "none",
                      },
                      "&:active": {
                        boxShadow: "0 8px 24px rgba(0,111,253,0.15)",
                        transform: "translateY(-2px) scale(1.01)",
                      },
                    },
                  }}
                  onClick={() => {
                    setViewWedding(wedding);
                    setViewDialogOpen(true);
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      ...touchStyle,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="#333"
                          mb={0.5}
                          noWrap
                        >
                          {getWeddingNames(wedding.wedding_data)}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Language sx={{ fontSize: 16, color: "#666" }} />
                          <Typography variant="body2" color="#666" noWrap>
                            {wedding.wedding_domain}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarToday sx={{ fontSize: 16, color: "#666" }} />
                          <Typography variant="body2" color="#666">
                            {formatDate(wedding.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWedding(wedding);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ color: "#f44336", ...touchStyle }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {/* 무한스크롤 로딩/더보기 */}
              <Box ref={loadMoreRef} sx={{ height: 32 }} />
              {loading && page > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              {!hasMore && renderedList.length > 0 && (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#aaa",
                    fontSize: 13,
                    py: 2,
                  }}
                >
                  더 이상 불러올 청첩장이 없습니다.
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* 로그아웃 버튼 */}
      <Box sx={{ p: 3, pt: 0 }}>
        <AppButton
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ py: 1.5, ...touchStyle }}
        >
          로그아웃
        </AppButton>
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 20 }}>
          청첩장 삭제
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ fontSize: 16, fontWeight: 500, color: "#777" }}
          >
            {selectedWedding &&
              `[${selectedWedding.wedding_domain}] 청첩장을 삭제하시겠습니까?`}
            <br />
            삭제된 청첩장은 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <AppButton
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            color="natural"
          >
            취소
          </AppButton>
          <AppButton
            onClick={handleDeleteWedding}
            variant="contained"
            color="highlight"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            {deleting ? "삭제 중..." : "삭제"}
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* 청첩장 열기 다이얼로그 */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 20 }}>
          청첩장 열기
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ fontSize: 16, fontWeight: 500, color: "#777" }}
          >
            {viewWedding && `[${viewWedding.wedding_domain}] 청첩장을 열까요?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <AppButton
            onClick={() => setViewDialogOpen(false)}
            variant="outlined"
            color="natural"
          >
            취소
          </AppButton>
          <AppButton
            onClick={() => {
              if (viewWedding) {
                window.open(`/card/${viewWedding.wedding_domain}`, "_blank");
                setViewDialogOpen(false);
              }
            }}
            variant="contained"
            color="highlight"
          >
            열기
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MypagePage;

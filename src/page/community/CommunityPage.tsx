"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useUserStore } from "@/store/useUserStore";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import axios from "axios";
import AppButton from "@/components/ui/AppButton";
import Image from "next/image";
import { CalendarToday, Language } from "@mui/icons-material";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import AppSwipeableDrawer from "@/components/ui/AppSwipeableDrawer";
import WeddingCardView from "@/components/wedding/WeddingCardView";
import { touchStyle } from "../mypage/MypagePage";

interface InviteCard {
  wedding_data: any;
  user_id: string;
  id: number;
  title: string;
  imageUrl: string;
  liked: boolean;
  likes: number;
  wedding_id: string; // wedding_id 추가
}

interface WeddingItem {
  wedding_id: string;
  wedding_domain: string;
  wedding_data: string;
  created_at: string;
  updated_at: string;
  wedding_cover_image_url?: string | null;
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

const LIMIT = 10;

const CommunityPage = () => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { user } = useUserStore();
  const { showStackSnackbar } = useSnackbarStore();

  // 다이얼로그 관련 상태
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedWeddingId, setSelectedWeddingId] = useState("");

  // 카드 미리보기 drawer 상태
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<InviteCard | null>(null);

  // 선택된 카드의 웨딩 데이터 가져오기
  const {
    data: selectedWeddingData,
    isLoading: isWeddingDataLoading,
    error: weddingDataError,
  } = useQuery({
    queryKey: ["weddingData", selectedCard?.wedding_id],
    queryFn: async () => {
      if (!selectedCard?.wedding_id) return null;

      const response = await axios.get(
        `/api/wedding/${selectedCard.wedding_id}`
      );
      if (response.data.success) {
        return response.data.wedding;
      } else {
        throw new Error("웨딩 데이터를 불러오는데 실패했습니다.");
      }
    },
    enabled: !!selectedCard?.wedding_id && previewDrawerOpen,
    staleTime: 1000 * 60 * 10, // 10분
  });

  // 웨딩 데이터 React Query
  const {
    data: myWeddingList = [],
    isLoading: weddingLoading,
    error: weddingError,
  } = useQuery({
    queryKey: ["userWeddings", user?.id],
    queryFn: async (): Promise<WeddingItem[]> => {
      if (!user?.id) return [];

      const response = await axios.get(`/api/wedding/user?userId=${user.id}`);
      if (response.data.success) {
        return response.data.weddingList;
      } else {
        throw new Error("데이터를 불러오는데 실패했습니다.");
      }
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: true, // 웹뷰 포커스시 리패칭
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 커뮤니티 데이터 무한스크롤 React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: communityLoading,
    error: communityError,
  } = useInfiniteQuery({
    queryKey: ["communityInvites"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/community?offset=${pageParam}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error("커뮤니티 데이터 로드 실패");
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length * LIMIT;
    },
    refetchOnWindowFocus: true, // 웹뷰 포커스시 리패칭
    staleTime: 1000 * 60 * 2, // 2분
  });

  // 평면화된 invites 데이터
  const invites = data?.pages.flat() || [];

  // 글 생성 Mutation
  const createInviteMutation = useMutation({
    mutationFn: async (params: {
      title: string;
      userId: string;
      weddingId: string;
    }) => {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error("생성 실패");
      return res.json();
    },
    onSuccess: () => {
      // 글 생성 성공시 커뮤니티 데이터 리패칭
      queryClient.invalidateQueries({ queryKey: ["communityInvites"] });
      setDialogOpen(false);
      setNewTitle("");
      setSelectedWeddingId("");
      showStackSnackbar("청첩장이 공유되었습니다!", { variant: "success" });
    },
    onError: (error: any) => {
      console.error("청첩장 생성 실패:", error);
      showStackSnackbar("공유에 실패했습니다.", { variant: "error" });
    },
  });

  const handleCreateInvite = () => {
    if (user && selectedWeddingId && newTitle) {
      createInviteMutation.mutate({
        title: newTitle,
        userId: user.id,
        weddingId: selectedWeddingId,
      });
    }
  };
  // 좋아요 Mutation
  const likeMutation = useMutation({
    mutationFn: async ({
      id,
      liked,
      title,
    }: {
      id: number;
      liked: boolean;
      title: string;
    }) => {
      const res = await fetch(`/api/community/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, liked, userId: user?.id, title }),
      });

      if (!res.ok) throw new Error("서버 반영 실패");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.updated.liked) {
        showStackSnackbar("이 게시글을 추천했습니다.", { variant: "success" });
      } else {
        showStackSnackbar("이 게시글의 추천을 취소했습니다.", {
          variant: "info",
        });
      }

      // 좋아요 성공시 커뮤니티 데이터 리패칭
      queryClient.invalidateQueries({ queryKey: ["communityInvites"] });
    },
    onError: (error: any) => {
      console.error("좋아요 처리 실패:", error);
      showStackSnackbar("좋아요에 실패했습니다.", { variant: "error" });
    },
  });

  const handleLike = (id: number, liked: boolean, title: string) => {
    likeMutation.mutate({ id, liked, title });
  };

  // 카드 클릭 핸들러
  const handleCardClick = (card: InviteCard) => {
    setSelectedCard(card);
    setPreviewDrawerOpen(true);
  };

  // 무한스크롤 옵저버
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

  return (
    <>
      {/* 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>청첩장 공유하기</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="청첩장 제목"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            margin="normal"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              공유할 청첩장을 선택하세요
            </Typography>

            {weddingLoading ? (
              <Card
                sx={{ p: 3, textAlign: "center", backgroundColor: "#f5f5f5" }}
              >
                <Typography color="text.secondary">
                  청첩장 목록을 불러오는 중...
                </Typography>
              </Card>
            ) : myWeddingList.length === 0 ? (
              <Card
                sx={{ p: 3, textAlign: "center", backgroundColor: "#f5f5f5" }}
              >
                <Typography color="text.secondary">
                  공유할 청첩장이 없습니다
                </Typography>
              </Card>
            ) : (
              <Box
                sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  px: 2,
                }}
              >
                {myWeddingList.map((wedding) => (
                  <Card
                    key={wedding.wedding_id}
                    onClick={() => setSelectedWeddingId(wedding.wedding_id)}
                    sx={{
                      p: 2,
                      minHeight: "95px ",
                      cursor: "pointer",

                      border:
                        selectedWeddingId === wedding.wedding_id
                          ? "1px solid #006ffd"
                          : "1px solid #e0e0e0",
                      backgroundColor:
                        selectedWeddingId === wedding.wedding_id
                          ? "rgba(0,111,253,0.08)"
                          : "white",

                      borderRadius: 2,

                      ...touchStyle,
                      position: "relative",
                      transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                      boxShadow: "0 4px 16px rgba(0,111,253,0.08)",
                      background:
                        "linear-gradient(145deg, #fff 0%, #f8fbff 100%)",
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
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {/* 썸네일 이미지 */}
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          overflow: "hidden",
                          border: "1px solid #ddd",
                          backgroundColor: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {wedding.wedding_cover_image_url ? (
                          <img
                            src={wedding.wedding_cover_image_url}
                            alt="청첩장 썸네일"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            썸네일
                          </Typography>
                        )}
                      </Box>

                      {/* 청첩장 정보 */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Language sx={{ fontSize: 16, color: "#666" }} />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{
                              color:
                                selectedWeddingId === wedding.wedding_id
                                  ? "#006ffd"
                                  : "#333",
                            }}
                          >
                            {wedding.wedding_domain}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarToday sx={{ fontSize: 16, color: "#666" }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(wedding.created_at).toLocaleDateString(
                              "ko-KR"
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>취소</Button>
          <Button
            onClick={handleCreateInvite}
            variant="contained"
            disabled={
              !newTitle || !selectedWeddingId || createInviteMutation.isPending
            }
          >
            {createInviteMutation.isPending ? "공유 중..." : "공유하기"}
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          borderBottom: "1px solid #e0e0e0;",
        }}
      >
        <Typography variant="h4" sx={{ mt: 4, mb: 1, textAlign: "center" }}>
          커뮤니티
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}
        >
          다른 사람의 청첩장을 확인해보세요.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: 3,
          mt: 1,
          p: 3,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {invites.map((item) => {
          const coverImageUrl =
            item.wedding_data?.wedding_cover_image_url || "/og.png";

          return (
            <Card
              key={item.id}
              onClick={() => handleCardClick(item)}
              sx={{
                cursor: "pointer",
                ...touchStyle,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                position: "relative",
                transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 4px 16px rgba(0,111,253,0.08)",
                background: "linear-gradient(145deg, #fff 0%, #f8fbff 100%)",
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
            >
              <CardMedia
                component="img"
                height="400"
                image={coverImageUrl}
                alt={item.title}
              />
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Chip
                    label={
                      item.user_id === user?.id
                        ? "내가 만든 청첩장"
                        : "다른 사람 작품"
                    }
                    size="small"
                    color={item.user_id === user?.id ? "primary" : "default"}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                      handleLike(item.id, item.liked, item.title);
                    }}
                  >
                    <FavoriteIcon
                      color={item.liked ? "error" : "disabled"}
                      fontSize="small"
                    />
                  </IconButton>
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {item.likes}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* 무한 스크롤 감지용 요소 */}
      {hasNextPage && <div ref={loaderRef} style={{ height: 50 }} />}
      {(communityLoading || isFetchingNextPage) && (
        <Box
          sx={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* 카드 미리보기 Drawer */}

      <AppSwipeableDrawer
        open={previewDrawerOpen}
        onOpen={() => setPreviewDrawerOpen(true)}
        onClose={() => {
          setPreviewDrawerOpen(false);
          // drawer 닫힐 때 선택된 카드 초기화 (쿼리 비활성화)
          setTimeout(() => setSelectedCard(null), 300);
        }}
        title={""}
      >
        {selectedCard && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              overflow: "auto",
            }}
          >
            {isWeddingDataLoading ? (
              <Box
                sx={{
                  width: "100%",
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <CircularProgress size={40} />
              </Box>
            ) : weddingDataError ? (
              <Box
                sx={{
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 2,
                  p: 3,
                }}
              >
                <Typography variant="h6" color="error">
                  청첩장을 불러올 수 없습니다
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  네트워크 연결을 확인하고 다시 시도해주세요.
                </Typography>
                <AppButton
                  variant="outlined"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["weddingData", selectedCard.wedding_id],
                    });
                  }}
                >
                  다시 시도
                </AppButton>
              </Box>
            ) : selectedWeddingData ? (
              <WeddingCardView
                weddinginfo={selectedWeddingData.wedding_data}
                domain={selectedWeddingData.wedding_domain || "preview"}
                weddingId={selectedWeddingData.wedding_id}
                noloading={true}
              />
            ) : null}
          </Box>
        )}
      </AppSwipeableDrawer>
      {/* 버튼 박스 */}
      <Box
        className="ButtonContainer"
        sx={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100vw",
          maxWidth: "768px", // 원하는 최대 너비로 제한 (예: 480px)
          zIndex: 100,
          px: 3,
          pt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto", // 가운데 정렬
          right: 0, // 좌우 모두 0으로 두면 가운데 정렬됨
          // 모바일에서 스크롤바 생기는 것 방지
          boxSizing: "border-box",
        }}
      >
        {/* 공유하기 버튼 */}
        <AppButton
          variant="contained"
          color="highlight"
          fullWidth
          sx={{ my: 2 }}
          onClick={() => {
            setDialogOpen(true);
            // 웨딩 데이터 수동 새로고침
            queryClient.invalidateQueries({
              queryKey: ["userWeddings", user?.id],
            });
          }}
        >
          내 청첩장도 공유하기
        </AppButton>
      </Box>
    </>
  );
};

export default CommunityPage;

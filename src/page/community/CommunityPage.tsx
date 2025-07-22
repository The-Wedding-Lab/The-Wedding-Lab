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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useUserStore } from "@/store/useUserStore";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import axios from "axios";

interface InviteCard {
  wedding_data: any;
  user_id: string;
  id: number;
  title: string;
  imageUrl: string;
  liked: boolean;
  likes: number;
}

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

const LIMIT = 10;

const CommunityPage = () => {
  const [invites, setInvites] = useState<InviteCard[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { user } = useUserStore();
  const { showStackSnackbar } = useSnackbarStore();

  // 다이얼로그 관련 상태
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedWeddingId, setSelectedWeddingId] = useState("");
  const [myWeddingList, setMyWeddingList] = useState<WeddingItem[]>([]);

  // 웨딩 데이터 가져오기
  const fetchUserWeddings = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await axios.get(`/api/wedding/user?userId=${user.id}`);
      if (response.data.success) {
        setMyWeddingList(response.data.weddingList);
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

  const fetchInvites = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/community?offset=${offset}&limit=${LIMIT}`);
      const data = await res.json();

      if (data.length < LIMIT) setHasMore(false);

      if (offset === 0) {
        setInvites(data);
      } else {
        setInvites((prev) => [...prev, ...data]);
      }

      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore]);

  const handleCreateInvite = async () => {
    try {
      if (user && selectedWeddingId && newTitle) {
        const res = await fetch("/api/community", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTitle,
            userId: user.id,
            weddingId: selectedWeddingId,
          }),
        });

        if (!res.ok) throw new Error("생성 실패");

        const newInvite = await res.json();
        setInvites((prev) => [newInvite, ...prev]);
        setDialogOpen(false);
        setNewTitle("");
        setSelectedWeddingId("");
      }
    } catch (err) {
      console.error("청첩장 생성 실패:", err);
    }
  };
  const handleLike = async (id: number, liked: boolean) => {
    try {
      const res = await fetch(`/api/community/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, liked }),
      });

      if (!res.ok) throw new Error("서버 반영 실패");

      // 서버 반영 성공 후, 클라이언트 상태도 변경
      setInvites((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                liked: !item.liked,
                likes: item.liked ? item.likes - 1 : item.likes + 1,
              }
            : item
        )
      );
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchInvites();
      },
      { rootMargin: "100px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchInvites]);

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
    <Container>
      {/* 공유하기 버튼 */}
      <Button
        variant="contained"
        color="primary"
        sx={{ my: 2 }}
        onClick={() => {
          setDialogOpen(true);
          fetchUserWeddings();
        }}
      >
        청첩장 공유하기
      </Button>

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
          <Select
            fullWidth
            value={selectedWeddingId}
            onChange={(e) => setSelectedWeddingId(e.target.value)}
            displayEmpty
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>
              청첩장을 선택하세요
            </MenuItem>
            {myWeddingList.map((w) => (
              <MenuItem key={w.wedding_id} value={w.wedding_id}>
                {getWeddingNames(w.wedding_data)}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>취소</Button>
          <Button
            onClick={handleCreateInvite}
            variant="contained"
            disabled={!newTitle || !selectedWeddingId}
          >
            공유하기
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h4" sx={{ mt: 4, mb: 3, textAlign: "center" }}>
        Community
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: 3,
          mt: 1,
        }}
      >
        {invites.map((item) => {
          let coverImageUrl;

          try {
            // wedding_data가 있고 string이면 파싱
            if (item.wedding_data?.wedding_data) {
              const parsedData = JSON.parse(item.wedding_data.wedding_data);
              coverImageUrl = parsedData?.pages?.coverDesign?.image?.url;
            }
          } catch (e) {
            console.error("wedding_data 파싱 오류:", e);
          }

          return (
            <Card key={item.id}>
              <CardMedia
                component="img"
                height="200"
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
                  <IconButton onClick={() => handleLike(item.id, item.liked)}>
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
      {hasMore && <div ref={loaderRef} style={{ height: 50 }} />}
      {loading && (
        <Typography align="center" sx={{ my: 2 }}>
          불러오는 중...
        </Typography>
      )}
    </Container>
  );
};

export default CommunityPage;

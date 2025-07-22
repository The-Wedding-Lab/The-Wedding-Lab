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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface InviteCard {
  id: number;
  title: string;
  imageUrl: string;
  liked: boolean;
  likes: number;
  author: "me" | "others";
}

const LIMIT = 10;

const CommunityPage = () => {
  const [invites, setInvites] = useState<InviteCard[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [page, setPage] = useState(0);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // API 호출 함수
  const fetchInvites = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/community?offset=${offset}&limit=${LIMIT}`);
      const data = await res.json();

      //: 서버에서 불러온 데이터의 길이가 limit보다 작으면 그 이후의 데이터는 더이상 없다는 의미
      //: 마지막 페이지인지 판단하는 기준
      //: 무한 스크롤을 멈추는 트리거 역할
      if (data.length < LIMIT) {
        setHasMore(false);
      }

      setInvites((prev) => [...prev, ...data]);
      //: offset은 +10씩 계속 누적
      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore]);

  const handleCreateInvite = async () => {
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "새로운 청첩장",
          imageUrl: "/default.jpg", // 원하는 기본 이미지 경로
        }),
      });

      if (!res.ok) throw new Error("생성 실패");

      const newInvite = await res.json();
      setInvites((prev) => [newInvite, ...prev]);
    } catch (err) {
      console.error("청첩장 생성 실패:", err);
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchInvites();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      //: 콜백함수
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchInvites();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchInvites]);

  const handleLike = (id: number) => {
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
  };

  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        sx={{ my: 2 }}
        onClick={handleCreateInvite}
      >
        청첩장 공유하기
      </Button>
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
        {invites.map((item) => (
          <Card key={item.id}>
            <CardMedia
              component="img"
              height="200"
              image={item.imageUrl}
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
                    item.author === "me" ? "내가 만든 청첩장" : "다른 사람 작품"
                  }
                  size="small"
                  color={item.author === "me" ? "primary" : "default"}
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => handleLike(item.id)}>
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
        ))}
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

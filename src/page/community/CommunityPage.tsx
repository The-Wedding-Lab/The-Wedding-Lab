"use client";

import { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Box,
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

const CommunityPage = () => {
  const [invites, setInvites] = useState<InviteCard[]>([]);
  const [page, setPage] = useState(0);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 더미 데이터 생성 함수
  const generateInvites = (page: number): InviteCard[] => {
    const startId = page * 4 + 1;
    return Array.from({ length: 4 }, (_, idx) => ({
      id: startId + idx,
      title: `청첩장 ${startId + idx}`,
      imageUrl: `/invites/invite${((startId + idx) % 4) + 1}.png`,
      liked: false,
      likes: Math.floor(Math.random() * 100),
      author: Math.random() > 0.5 ? "me" : "others",
    }));
  };

  useEffect(() => {
    // 초기 데이터 로딩
    setInvites(generateInvites(0));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      // 콜백함수
      (entries) => {
        if (entries[0].isIntersecting) {
          // 다음 페이지 데이터 추가
          setInvites((prev) => [...prev, ...generateInvites(page + 1)]);
          setPage((prev) => prev + 1);
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
  }, [page]);

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
      <Typography variant="h4" sx={{ mt: 4, mb: 3, textAlign: "center" }}>
        Commnuity
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            // md: "1fr 1fr 1fr",
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
      <div ref={loaderRef} style={{ height: 50 }} />
    </Container>
  );
};

export default CommunityPage;

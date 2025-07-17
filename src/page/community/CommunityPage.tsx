"use client";

import { useEffect, useState } from "react";
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
  author: "me" | "others";
}

const CommunityPage = () => {
  const [invites, setInvites] = useState<InviteCard[]>([]);

  useEffect(() => {
    setInvites([
      {
        id: 1,
        title: "우리 결혼합니다!",
        imageUrl: "/invites/invite1.png",
        liked: false,
        author: "me",
      },
      {
        id: 2,
        title: "김철수 💕 박영희",
        imageUrl: "/invites/invite2.png",
        liked: false,
        author: "others",
      },
      {
        id: 3,
        title: "드디어 저희도!",
        imageUrl: "/invites/invite3.png",
        liked: false,
        author: "others",
      },
      {
        id: 4,
        title: "초대합니다 💍",
        imageUrl: "/invites/invite4.png",
        liked: false,
        author: "me",
      },
    ]);
  }, []);

  const handleLike = (id: number) => {
    setInvites((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 3, textAlign: "center" }}>
        Community
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
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
              <IconButton onClick={() => handleLike(item.id)}>
                <FavoriteIcon color={item.liked ? "error" : "disabled"} />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default CommunityPage;

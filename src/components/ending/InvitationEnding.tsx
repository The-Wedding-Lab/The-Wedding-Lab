/** @jsxImportSource @emotion/react */
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import AppButton from "@/components/ui/AppButton";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export const InvitationEnding: React.FC = () => {
  const { setupData } = useWeddingDataStore();
  const message = setupData.weddingInfo?.pages?.endingMessage?.text;
  const [input, setInput] = useState(message || "");
  const [openSample, setOpenSample] = useState(false);
  const sampleMessages = [
    "저희 두 사람, 사랑으로 하나 되어 새로운 출발을 하려 합니다. 소중한 분들을 모시고자 하오니 축복해 주시면 감사하겠습니다.",
    "서로의 반쪽이 되어 평생을 함께 하기로 약속했습니다. 저희의 시작을 따뜻한 마음으로 축복해 주세요.",
    "좋은 인연으로 만나 사랑을 키워온 저희가 이제 한 가정을 이루려 합니다. 귀한 걸음 하시어 축복해 주시기 바랍니다.",
    "저희 두 사람이 사랑의 결실을 맺는 자리에 함께해 주셔서 큰 힘이 되어 주세요.",
    "평생을 함께할 동반자를 만나 새로운 출발을 하려 합니다. 오셔서 따뜻한 격려와 축복 부탁드립니다.",
  ];

  return (
    <Box
      sx={{
        minHeight: "60vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        py: 6,
        px: 2,
      }}
    >
      {/* 제목 */}
      <Box sx={{ width: "100%", maxWidth: 700, mb: 4 }}>
        <Typography
          component="div"
          sx={{
            color: "#333",
            fontSize: "1.7rem",
            fontWeight: 700,
            mb: 1.5,
            textAlign: "left",
          }}
        >
          엔딩 글귀
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 2.5,
        }}
      >
        <Typography
          sx={{
            color: "#333",
            fontWeight: 600,
            fontSize: "1.05rem",
            mb: 1,
            ml: 0.5,
            textAlign: "left",
          }}
        >
          내용
        </Typography>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="엔딩 메시지를 입력하세요"
          rows={5}
          style={{
            width: "100%",
            minHeight: 150,
            borderRadius: 10,
            border: "1.5px solid #e0e0e0",
            padding: 16,
            fontSize: "1.1rem",
            fontFamily: "inherit",
            background: "#fff",
            color: "#222",
            outline: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            resize: "vertical",
            marginTop: 0,
            marginBottom: 0,
          }}
        />

        <Typography
          sx={{
            color: "#e53935",
            fontSize: "1rem",
            fontWeight: 600,
            mb: 2,
            textAlign: "right",
          }}
        >
          ⛔ 필수 입력정보입니다
        </Typography>

        <Typography
          sx={{
            color: "#888",
            fontSize: "1rem",
            fontWeight: 500,
            mb: 2,
            textAlign: "left",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: 6, fontSize: "1.1em" }}>💡</span>
          샘플 문구를 활용하여 엔딩 메시지를 자유롭게 수정하실 수 있습니다.
        </Typography>

        <AppButton
          color="highlight"
          variant="contained"
          fullWidth
          size="large"
          sx={{
            fontWeight: 600,
            fontSize: "1.05rem",
            height: 48,
          }}
          onClick={() => setOpenSample(true)}
        >
          샘플문구 활용하기
        </AppButton>
      </Box>

      <Dialog open={openSample} onClose={() => setOpenSample(false)}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 2,
          }}
        >
          샘플 문구 선택
          <IconButton
            aria-label="닫기"
            onClick={() => setOpenSample(false)}
            edge="end"
            size="small"
            sx={{ ml: 1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {sampleMessages.map((msg, idx) => (
              <ListItemButton
                key={idx}
                onClick={() => {
                  setInput(msg);
                  setOpenSample(false);
                }}
                sx={{ mb: 1, borderRadius: 2 }}
              >
                <ListItemText primary={msg} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

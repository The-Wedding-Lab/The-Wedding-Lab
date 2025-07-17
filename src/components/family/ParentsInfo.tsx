/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Box,
  Typography,
  Dialog,
  Tab,
  Tabs,
  Button,
  IconButton,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import { useState } from "react";
import { Close, Message, Phone, Person } from "@mui/icons-material";

export const ParentsInfo: React.FC = () => {
  const { setupData } = useWeddingDataStore();
  const familyInfo = setupData.weddingInfo?.pages?.familyInfo;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  if (!familyInfo?.enabled) {
    return null;
  }

  const handleSMS = (phoneNumber: string, name: string) => {
    if (phoneNumber) {
      const message = encodeURIComponent(`축하합니다! 🎉`);
      window.location.href = `sms:${phoneNumber}?body=${message}`;
    }
  };

  const handleCall = (phoneNumber: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const ContactButton = ({
    icon,
    label,
    onClick,
    color = "primary",
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: "primary" | "secondary";
  }) => (
    <Button
      variant="outlined"
      startIcon={icon}
      onClick={onClick}
      size="small"
      color={color}
      sx={{
        borderRadius: "20px",
        px: 2,
        py: 0.5,
        fontSize: "12px",
        minWidth: "auto",
      }}
    >
      {label}
    </Button>
  );

  const ContactSection = ({
    name,
    phone,
    role,
  }: {
    name: string;
    phone: string;
    role: string;
  }) => {
    if (!name || !phone) {
      return null;
    }

    return (
      <Box
        sx={{
          width: "100%",
          p: 2,
          border: "1px solid #f0f0f0",
          borderRadius: "12px",
          mb: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography fontSize={16} fontWeight={600} color="#333">
              {name}
            </Typography>
            <Typography fontSize={12} color="#666">
              {role}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <ContactButton
              icon={<Message fontSize="small" />}
              label="문자"
              onClick={() => handleSMS(phone, name)}
              color="primary"
            />
            <ContactButton
              icon={<Phone fontSize="small" />}
              label="전화"
              onClick={() => handleCall(phone)}
              color="secondary"
            />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      css={css`
        background-color: #f4f0ea;
        padding: 48px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: "Nanum Myeongjo", serif;
      `}
    >
      <Box
        css={css`
          margin-bottom: 32px;
          text-align: center;
        `}
      >
        <Typography
          css={css`
            font-size: 1.1rem;
            color: #444;
            margin-bottom: 4px;
          `}
        >
          {setupData.weddingInfo?.groom?.father?.name} ·{" "}
          {setupData.weddingInfo?.groom?.mother?.name} 의 아들
        </Typography>
        <Typography
          css={css`
            font-size: 1.3rem;
            font-weight: 500;
            color: #2d2d2d;
          `}
        >
          신랑 {setupData.weddingInfo?.groom?.name}
        </Typography>
      </Box>

      <Box
        css={css`
          text-align: center;
        `}
      >
        <Typography
          css={css`
            font-size: 1.1rem;
            color: #444;
            margin-bottom: 4px;
          `}
        >
          {setupData.weddingInfo?.bride?.father?.name} ·{" "}
          {setupData.weddingInfo?.bride?.mother?.name} 의 딸
        </Typography>
        <Typography
          css={css`
            font-size: 1.3rem;
            font-weight: 500;
            color: #2d2d2d;
          `}
        >
          신부 {setupData.weddingInfo?.bride?.name}
        </Typography>
      </Box>

      {setupData.weddingInfo.pages.familyInfo.telEnabled && (
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          sx={{
            mt: 4,
            borderRadius: "25px",
            px: 4,
            py: 1.5,
            fontSize: "14px",
            fontWeight: 600,
            backgroundColor: "#2C83E9",
            "&:hover": {
              backgroundColor: "#1e5fa3",
            },
          }}
        >
          축하 연락하기
        </Button>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            maxHeight: "80vh",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography fontSize={20} fontWeight={700} color="#333">
                축하 연락하기
              </Typography>
              <Typography fontSize={14} color="#666" mt={0.5}>
                소중한 분들께 따뜻한 마음을 전해보세요
              </Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                fontSize: "14px",
                fontWeight: 600,
                minWidth: "auto",
                flex: 1,
              },
            }}
          >
            <Tab
              label={
                <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                  신랑측
                </Typography>
              }
            />
            <Tab
              label={
                <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                  신부측
                </Typography>
              }
            />
          </Tabs>

          <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
            {selectedTab === 0 ? (
              // 신랑측
              <Box>
                <ContactSection
                  name={setupData.weddingInfo?.groom?.name || ""}
                  phone={setupData.weddingInfo?.groom?.tel || ""}
                  role="신랑"
                />
                <ContactSection
                  name={setupData.weddingInfo?.groom?.father?.name || ""}
                  phone={setupData.weddingInfo?.groom?.father?.tel || ""}
                  role="신랑 아버님"
                />
                <ContactSection
                  name={setupData.weddingInfo?.groom?.mother?.name || ""}
                  phone={setupData.weddingInfo?.groom?.mother?.tel || ""}
                  role="신랑 어머님"
                />
              </Box>
            ) : (
              // 신부측
              <Box>
                <ContactSection
                  name={setupData.weddingInfo?.bride?.name || ""}
                  phone={setupData.weddingInfo?.bride?.tel || ""}
                  role="신부"
                />
                <ContactSection
                  name={setupData.weddingInfo?.bride?.father?.name || ""}
                  phone={setupData.weddingInfo?.bride?.father?.tel || ""}
                  role="신부 아버님"
                />
                <ContactSection
                  name={setupData.weddingInfo?.bride?.mother?.name || ""}
                  phone={setupData.weddingInfo?.bride?.mother?.tel || ""}
                  role="신부 어머님"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Paper,
} from "@mui/material";
import { Person, ContentCopy } from "@mui/icons-material";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import AppTwemoji from "@/components/ui/AppTwemoji";

interface AccountInfo {
  bank: string;
  account: string;
  name: string;
  deceased?: boolean;
}

interface AccountData {
  groom: AccountInfo;
  groomFather: AccountInfo;
  groomMother: AccountInfo;
  bride: AccountInfo;
  brideFather: AccountInfo;
  brideMother: AccountInfo;
}

const AccountPage = () => {
  const { setupData } = useWeddingDataStore();
  const accountInfo = setupData.weddingInfo?.pages?.accountInfo;
  const [selectedTab, setSelectedTab] = useState(0);
  const showStackSnackbar = useSnackbarStore(
    (state) => state.showStackSnackbar
  );

  const accountData: AccountData = {
    groom: {
      bank: setupData.weddingInfo.groom.bank,
      account: setupData.weddingInfo.groom.account,
      name: setupData.weddingInfo.groom.name,
    },
    groomFather: {
      bank: setupData.weddingInfo.groom.father.bank,
      account: setupData.weddingInfo.groom.father.account,
      name: setupData.weddingInfo.groom.father.name,
      deceased: setupData.weddingInfo.groom.father.deceased,
    },
    groomMother: {
      bank: setupData.weddingInfo.groom.mother.bank,
      account: setupData.weddingInfo.groom.mother.account,
      name: setupData.weddingInfo.groom.mother.name,
      deceased: setupData.weddingInfo.groom.mother.deceased,
    },
    bride: {
      bank: setupData.weddingInfo.bride.bank,
      account: setupData.weddingInfo.bride.account,
      name: setupData.weddingInfo.bride.name,
    },
    brideFather: {
      bank: setupData.weddingInfo.bride.father.bank,
      account: setupData.weddingInfo.bride.father.account,
      name: setupData.weddingInfo.bride.father.name,
      deceased: setupData.weddingInfo.bride.father.deceased,
    },
    brideMother: {
      bank: setupData.weddingInfo.bride.mother.bank,
      account: setupData.weddingInfo.bride.mother.account,
      name: setupData.weddingInfo.bride.mother.name,
      deceased: setupData.weddingInfo.bride.mother.deceased,
    },
  };

  const handleCopy = async (account: string, name: string) => {
    try {
      // 최신 브라우저 clipboard API 시도
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(account);
        showStackSnackbar(`${name}님의 계좌번호가 복사되었습니다`, {
          variant: "success",
        });
        return;
      }

      // 폴백: 임시 input 요소를 사용한 복사 (모바일 호환)
      const textArea = document.createElement("input");
      textArea.value = account;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);

      // 모바일에서 키보드가 나타나지 않도록 readonly 설정
      textArea.setAttribute("readonly", "");
      textArea.setAttribute("contenteditable", "true");

      // iOS Safari 호환성을 위한 추가 설정
      if (navigator.userAgent.match(/ipad|iPhone/i)) {
        textArea.contentEditable = "true";
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
        textArea.setSelectionRange(0, 999999);
      }

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        showStackSnackbar(`${name}님의 계좌번호가 복사되었습니다`, {
          variant: "success",
        });
      } else {
        throw new Error("복사 실패");
      }
    } catch (error) {
      console.error("복사 에러:", error);
      showStackSnackbar("복사에 실패했습니다", { variant: "error" });
    }
  };

  const AccountSection = ({
    bank,
    account,
    name,
    role,
    deceased = false,
  }: {
    bank: string;
    account: string;
    name: string;
    role: string;
    deceased?: boolean;
  }) => {
    if (!name || !account || !bank || deceased) {
      return null;
    }

    return (
      <Box sx={{ width: "100%" }}>
        <Card
          sx={{
            mb: 2,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#333", fontSize: 16 }}
              >
                <AppTwemoji>{role}</AppTwemoji>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography
                  variant="caption"
                  color="#666"
                  sx={{ fontSize: "12px", display: "block" }}
                >
                  은행
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, fontSize: 14 }}
                >
                  {bank}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="#666"
                  sx={{ fontSize: "12px", display: "block" }}
                >
                  계좌번호
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontFamily: "monospace",
                    fontSize: 14,
                    mb: 1,
                  }}
                >
                  {account}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="#666"
                  sx={{ fontSize: "12px", display: "block" }}
                >
                  예금주
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, fontSize: 14, mb: 1 }}
                >
                  {name}
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopy fontSize="small" />}
                  onClick={() => handleCopy(account, name)}
                  size="small"
                  sx={{
                    borderRadius: "20px",
                    px: 2,
                    py: 0.5,
                    fontSize: "12px",
                    minWidth: "auto",
                  }}
                  fullWidth
                >
                  계좌번호 복사
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        background: `linear-gradient(135deg, ${accountInfo?.backgroundColor} 0%, ${accountInfo?.backgroundColor2} 100%)`,
      }}
    >
      <Box
        sx={{
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography fontSize={28} fontWeight={700} gutterBottom color="#333">
            마음 전하실 곳
          </Typography>
          <Typography fontSize={16} color="#666" mb={4} width="80%" mx="auto">
            {accountInfo?.description}
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            mb: 3,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#2C83E9",
                height: "3px",
              },
              "& .MuiTab-root": {
                fontSize: "16px",
                fontWeight: 600,
                color: "#666",
                textTransform: "none",
                minHeight: "60px",
                "&.Mui-selected": {
                  color: "#2C83E9",
                },
                flex: 1,
                "&:hover": {
                  backgroundColor: "rgba(44, 131, 233, 0.04)",
                },
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
        </Paper>

        <Box sx={{ px: 1 }}>
          {selectedTab === 0 ? (
            // 신랑측
            <Box>
              <AccountSection
                bank={accountData.groom.bank}
                account={accountData.groom.account}
                name={accountData.groom.name}
                role="🤵 신랑"
              />
              <AccountSection
                bank={accountData.groomFather.bank}
                account={accountData.groomFather.account}
                name={accountData.groomFather.name}
                role="👫 신랑 아버지"
                deceased={accountData.groomFather.deceased}
              />
              <AccountSection
                bank={accountData.groomMother.bank}
                account={accountData.groomMother.account}
                name={accountData.groomMother.name}
                role="👫 신랑 어머니"
                deceased={accountData.groomMother.deceased}
              />
            </Box>
          ) : (
            // 신부측
            <Box>
              <AccountSection
                bank={accountData.bride.bank}
                account={accountData.bride.account}
                name={accountData.bride.name}
                role="👰 신부"
              />
              <AccountSection
                bank={accountData.brideFather.bank}
                account={accountData.brideFather.account}
                name={accountData.brideFather.name}
                role="👫 신부 아버지"
                deceased={accountData.brideFather.deceased}
              />
              <AccountSection
                bank={accountData.brideMother.bank}
                account={accountData.brideMother.account}
                name={accountData.brideMother.name}
                role="👫 신부 어머니"
                deceased={accountData.brideMother.deceased}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountPage;

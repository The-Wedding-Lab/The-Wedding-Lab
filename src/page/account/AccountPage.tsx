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
import { AccountBalance, Person, ContentCopy } from "@mui/icons-material";
import { useSnackbarStore } from "@/store/useSnackbarStore";

interface AccountInfo {
  bankName: string;
  account: string;
  name: string;
  deceased?: boolean; // 고인 여부
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
  // 예시 데이터
  const [accountData] = useState<AccountData>({
    groom: {
      bankName: "신한은행",
      account: "110-123456-789",
      name: "김신랑",
    },
    groomFather: {
      bankName: "국민은행",
      account: "123-456789-012",
      name: "김아버지",
      deceased: false,
    },
    groomMother: {
      bankName: "국민은행",
      account: "123-456789-012",
      name: "김어머님",
      deceased: true,
    },
    bride: {
      bankName: "하나은행",
      account: "123-456789-012",
      name: "이신부",
    },
    brideFather: {
      bankName: "농협은행",
      account: "123-456789-012",
      name: "이아버지",
      deceased: false,
    },
    brideMother: {
      bankName: "기업은행",
      account: "123-456789-012",
      name: "이어머니",
      deceased: false,
    },
  });

  const [activeTab, setActiveTab] = useState(0);
  const showStackSnackbar = useSnackbarStore(
    (state) => state.showStackSnackbar
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderAccountCard = (side: keyof AccountData, title: string) => {
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(accountData[side].account);
        showStackSnackbar("계좌번호가 복사되었습니다", { variant: "success" });
      } catch {
        showStackSnackbar("복사에 실패했습니다", { variant: "error" });
      }
    };

    return (
      <Card
        sx={{
          mb: 1, // margin-bottom 줄임
          borderRadius: "10px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #e0e0e0",
        }}
      >
        <CardContent sx={{ p: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Person sx={{ color: "#0065F8", mr: 0.5, fontSize: 18 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#333", fontSize: 15 }}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccountBalance sx={{ color: "#666", fontSize: 15 }} />
              <Box>
                <Typography
                  variant="caption"
                  color="#666"
                  sx={{ fontSize: "11px" }}
                >
                  은행
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, fontSize: 13 }}
                >
                  {accountData[side].bankName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccountBalance sx={{ color: "#666", fontSize: 15 }} />
              <Box>
                <Typography
                  variant="caption"
                  color="#666"
                  sx={{ fontSize: "11px" }}
                >
                  계좌번호
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontFamily: "monospace",
                      fontSize: 13,
                    }}
                  >
                    {accountData[side].account}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopy sx={{ fontSize: 15 }} />}
                    onClick={handleCopy}
                    sx={{
                      ml: 0.5,
                      fontSize: "11px",
                      minWidth: 0,
                      p: "1px 6px",
                      height: 24,
                    }}
                  >
                    복사
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Person sx={{ color: "#666", fontSize: 15 }} />
              <Box>
                <Typography
                  variant="caption"
                  color="#666"
                  sx={{ fontSize: "11px" }}
                >
                  예금주
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, fontSize: 13 }}
                >
                  {accountData[side].name}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // 부모님 계좌 필터링
  const getParentAccounts = (side: "groom" | "bride") => {
    const fatherKey = side === "groom" ? "groomFather" : "brideFather";
    const motherKey = side === "groom" ? "groomMother" : "brideMother";
    return [
      {
        key: fatherKey as keyof AccountData,
        label: side === "groom" ? "신랑 아버지" : "신부 아버지",
      },
      {
        key: motherKey as keyof AccountData,
        label: side === "groom" ? "신랑 어머니" : "신부 어머니",
      },
    ].filter(
      ({ key }) =>
        accountData[key].deceased !== true && accountData[key].account
    );
  };

  // 신랑측/신부측 가족 수 계산
  const getAliveCount = (side: "groom" | "bride") => {
    const keys: (keyof AccountData)[] =
      side === "groom"
        ? ["groom", "groomFather", "groomMother"]
        : ["bride", "brideFather", "brideMother"];
    return keys.filter((key) => !accountData[key].deceased).length;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 3,
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography fontSize={24} fontWeight={700} gutterBottom>
            제목
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              fontSize: "14px",
            }}
          >
            축하의 마음을 전해주세요
          </Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#0065F8",
                  height: "3px",
                },
                "& .MuiTab-root": {
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#666",
                  textTransform: "none",
                  minHeight: "56px",
                  position: "relative",
                  "&.Mui-selected": {
                    color: "#0065F8",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  },
                  "&:hover": {
                    backgroundColor: "#ffffff",
                    color: "#0065F8",
                  },
                },
                "& .MuiTabs-flexContainer": {
                  gap: 0,
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                      신랑측
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: activeTab === 0 ? "#0065F8" : "#ccc",
                        color: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {getAliveCount("groom")}
                    </Box>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                      신부측
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: activeTab === 1 ? "#0065F8" : "#ccc",
                        color: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {getAliveCount("bride")}
                    </Box>
                  </Box>
                }
              />
            </Tabs>
          </Paper>
        </Box>
        <Box sx={{ mb: 4 }}>
          {activeTab === 0 && (
            <Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                {renderAccountCard("groom", "신랑")}
              </Box>
              {(() => {
                const parents = getParentAccounts("groom");
                return (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        parents.length === 2
                          ? { xs: "1fr", sm: "1fr 1fr" }
                          : "1fr",
                      gap: 1.5,
                    }}
                  >
                    {parents.map((p) =>
                      renderAccountCard(p.key as keyof AccountData, p.label)
                    )}
                  </Box>
                );
              })()}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                {renderAccountCard("bride", "신부")}
              </Box>
              {(() => {
                const parents = getParentAccounts("bride");
                return (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        parents.length === 2
                          ? { xs: "1fr", sm: "1fr 1fr" }
                          : "1fr",
                      gap: 1.5,
                    }}
                  >
                    {parents.map((p) =>
                      renderAccountCard(p.key as keyof AccountData, p.label)
                    )}
                  </Box>
                );
              })()}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountPage;

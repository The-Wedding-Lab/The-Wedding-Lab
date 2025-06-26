"use client";

import React, { useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { ExpandMore, KeyboardArrowDown } from "@mui/icons-material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import AppTextField from "@/components/ui/AppTextField";
import DaumPostcode from "react-daum-postcode";
import AppAccordion from "@/components/ui/AppAccordion";
import AppButton from "@/components/ui/AppButton";

interface StepProps {
  data: any;
  setData: (data: any) => void;
}

const Step1_WeddingInfo = ({ data, setData }: StepProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [addrDialogOpen, setAddrDialogOpen] = useState(false);

  const handleDateTimeChange = (newValue: Dayjs | null) => {
    setData({
      weddingInfo: { ...data.weddingInfo, weddingDateTime: newValue },
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          예식 정보를 입력해주세요.
        </Typography>
        {/* 신랑 정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#666666">신랑 정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField label="신랑 성함" fullWidth />
              <AppTextField label="신랑 연락처" fullWidth />
              <AppTextField label="신랑 계좌번호" fullWidth />
            </Box>
          </AccordionDetails>
        </AppAccordion>
        {/* 신랑 정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#666666">신부 정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField label="신부 성함" fullWidth />
              <AppTextField label="신부 연락처" fullWidth />
              <AppTextField label="신부 계좌번호" fullWidth />
            </Box>
          </AccordionDetails>
        </AppAccordion>
        {/* 예식 일시 DatePicker */}
        <MobileDateTimePicker
          open={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onAccept={handleDateTimeChange}
          value={
            data.weddingInfo?.weddingDateTime
              ? dayjs(data.weddingInfo.weddingDateTime)
              : null
          }
          onChange={handleDateTimeChange}
          ampm={true}
          enableAccessibleFieldDOMStructure={false}
          views={["year", "month", "day", "hours", "minutes"]}
          dayOfWeekFormatter={(day) => day.format("dd")}
          slotProps={{
            toolbar: {
              hidden: true,
            },
            calendarHeader: {
              format: "YYYY년 M월",
            },
          }}
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                label="예식 일시"
                fullWidth
                placeholder=""
                onClick={() => setIsPickerOpen(true)}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    readOnly: true,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    cursor: "pointer",
                  },
                  "& .MuiInputBase-input": {
                    cursor: "pointer",
                  },
                }}
              />
            ),
          }}
        />
        {/* 예식 장소 daum Map */}
        <AppTextField
          label="예식 장소"
          fullWidth
          value={data.weddingInfo?.location || ""}
          onClick={() => setAddrDialogOpen(true)}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        {/* 신랑혼주정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#666666">신랑혼주정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField label="아버님 성함" fullWidth />
              <AppTextField label="아버님 연락처" fullWidth />
              <AppTextField label="아버님 계좌번호" fullWidth />
              <FormControl>
                <InputLabel>참석여부</InputLabel>
                <Select
                  sx={{
                    borderRadius: "12px",
                  }}
                  fullWidth
                  value={data.weddingInfo?.groomParentAttendance || ""}
                  label="참석여부"
                  onChange={(e) =>
                    setData({
                      weddingInfo: {
                        ...data.weddingInfo,
                        groomParentAttendance: e.target.value,
                      },
                    })
                  }
                  defaultValue="참석"
                >
                  <MenuItem value="참석">참석</MenuItem>
                  <MenuItem value="불참">불참</MenuItem>
                </Select>
              </FormControl>
              <Divider />
              <AppTextField label="어머님 성함" fullWidth />
              <AppTextField label="어머님 전화번호" fullWidth />
              <AppTextField label="어머님 계좌번호" fullWidth />
              <FormControl>
                <InputLabel>참석여부</InputLabel>
                <Select
                  sx={{
                    borderRadius: "12px",
                  }}
                  fullWidth
                  value={data.weddingInfo?.groomParentAttendance || ""}
                  label="참석여부"
                  onChange={(e) =>
                    setData({
                      weddingInfo: {
                        ...data.weddingInfo,
                        groomParentAttendance: e.target.value,
                      },
                    })
                  }
                  defaultValue="참석"
                >
                  <MenuItem value="참석">참석</MenuItem>
                  <MenuItem value="불참">불참</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </AccordionDetails>
        </AppAccordion>
        {/* 신부혼주정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#666666">신부혼주정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField label="아버님 성함" fullWidth />
              <AppTextField label="아버님 연락처" fullWidth />
              <AppTextField label="아버님 계좌번호" fullWidth />
              <FormControl>
                <InputLabel>참석여부</InputLabel>
                <Select
                  sx={{
                    borderRadius: "12px",
                  }}
                  fullWidth
                  value={data.weddingInfo?.groomParentAttendance || ""}
                  label="참석여부"
                  onChange={(e) =>
                    setData({
                      weddingInfo: {
                        ...data.weddingInfo,
                        groomParentAttendance: e.target.value,
                      },
                    })
                  }
                  defaultValue="참석"
                >
                  <MenuItem value="참석">참석</MenuItem>
                  <MenuItem value="불참">불참</MenuItem>
                </Select>
              </FormControl>
              <Divider />
              <AppTextField label="어머님 성함" fullWidth />
              <AppTextField label="어머님 전화번호" fullWidth />
              <AppTextField label="어머님 계좌번호" fullWidth />
              <FormControl>
                <InputLabel>참석여부</InputLabel>
                <Select
                  sx={{
                    borderRadius: "12px",
                  }}
                  fullWidth
                  value={data.weddingInfo?.groomParentAttendance || ""}
                  label="참석여부"
                  onChange={(e) =>
                    setData({
                      weddingInfo: {
                        ...data.weddingInfo,
                        groomParentAttendance: e.target.value,
                      },
                    })
                  }
                  defaultValue="참석"
                >
                  <MenuItem value="참석">참석</MenuItem>
                  <MenuItem value="불참">불참</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </AccordionDetails>
        </AppAccordion>
      </Box>

      {/* 주소 검색 SwipeableDrawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={addrDialogOpen}
        onOpen={() => setAddrDialogOpen(true)}
        onClose={() => setAddrDialogOpen(false)}
        sx={{
          zIndex: 999,
          "& .MuiDrawer-paper": {
            width: "100%",
            maxHeight: "90vh",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            pb: "30px",
          },
        }}
      >
        <Box sx={{ width: "100%", maxHeight: "90vh", overflow: "auto" }}>
          <Box
            className="drawer-header"
            sx={{
              position: "sticky",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2000,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "background.paper",
                zIndex: 1,
                position: "relative",
              }}
            >
              <KeyboardArrowDown
                onClick={() => setAddrDialogOpen(false)}
                sx={{
                  cursor: "pointer",
                  color: "#666",
                  position: "absolute",
                  left: 16,
                  zIndex: 2,
                }}
              />
              <Typography
                fontSize={18}
                fontWeight={600}
                sx={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                주소 검색
              </Typography>
            </Box>
          </Box>
          <Box sx={{ p: 2 }}>
            <DaumPostcode
              style={{ width: "100%", height: "420px" }}
              autoClose={false}
              onComplete={(addressData) => {
                setAddrDialogOpen(false);
                setData({
                  weddingInfo: {
                    ...data.weddingInfo,
                    location: addressData.address,
                  },
                });
              }}
            />
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default Step1_WeddingInfo;

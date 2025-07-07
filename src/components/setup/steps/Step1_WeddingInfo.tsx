"use client";

import React, { useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch,
  InputLabel,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import {
  DragHandle,
  ExpandMore,
  FilterVintage,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import AppTextField from "@/components/ui/AppTextField";
import DaumPostcode from "react-daum-postcode";
import AppAccordion from "@/components/ui/AppAccordion";
import AppButton from "@/components/ui/AppButton";
import AppSwipeableDrawer from "@/components/ui/AppSwipeableDrawer";

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
              <Typography color="#333333">신랑 정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField labelText="성함" fullWidth />
              <AppTextField labelText="연락처" fullWidth />
              <AppTextField labelText="계좌번호" fullWidth />
            </Box>
          </AccordionDetails>
        </AppAccordion>
        {/* 신랑 정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#333333">신부 정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField labelText="성함" fullWidth />
              <AppTextField labelText="연락처" fullWidth />
              <AppTextField labelText="계좌번호" fullWidth />
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
              <AppTextField
                {...params}
                placeholder="Click"
                labelText="예식 일시"
                fullWidth
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
          labelText="예식 장소"
          placeholder="Click"
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
              <Typography color="#333333">신랑혼주정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField labelText="아버님 성함" fullWidth />
              <AppTextField labelText="아버님 연락처" fullWidth />
              <AppTextField labelText="아버님 계좌번호" fullWidth />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormGroup>
                  <FormControlLabel control={<Switch />} label="고인표시" />
                </FormGroup>
                <Select
                  size="small"
                  defaultValue="icon"
                  sx={{
                    width: "65px",
                    borderRadius: "12px",
                  }}
                >
                  <MenuItem value="icon">꽃</MenuItem>
                  <MenuItem value="故">故</MenuItem>
                </Select>
              </Box>
              <Divider />
              <AppTextField labelText="어머님 성함" fullWidth />
              <AppTextField labelText="어머님 전화번호" fullWidth />
              <AppTextField labelText="어머님 계좌번호" fullWidth />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormGroup>
                  <FormControlLabel control={<Switch />} label="고인표시" />
                </FormGroup>
                <Select
                  size="small"
                  defaultValue="icon"
                  sx={{
                    width: "65px",
                    borderRadius: "12px",
                  }}
                >
                  <MenuItem value="icon">꽃</MenuItem>
                  <MenuItem value="故">故</MenuItem>
                </Select>
              </Box>
            </Box>
          </AccordionDetails>
        </AppAccordion>
        {/* 신부혼주정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#333333">신부혼주정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField labelText="아버님 성함" fullWidth />
              <AppTextField labelText="아버님 연락처" fullWidth />
              <AppTextField labelText="아버님 계좌번호" fullWidth />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormGroup>
                  <FormControlLabel control={<Switch />} label="고인표시" />
                </FormGroup>
                <Select
                  size="small"
                  defaultValue="icon"
                  sx={{
                    width: "65px",
                    borderRadius: "12px",
                  }}
                >
                  <MenuItem value="icon">꽃</MenuItem>
                  <MenuItem value="故">故</MenuItem>
                </Select>
              </Box>
              <Divider />
              <AppTextField labelText="어머님 성함" fullWidth />
              <AppTextField labelText="어머님 전화번호" fullWidth />
              <AppTextField labelText="어머님 계좌번호" fullWidth />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormGroup>
                  <FormControlLabel control={<Switch />} label="고인표시" />
                </FormGroup>
                <Select
                  size="small"
                  defaultValue="icon"
                  sx={{
                    width: "65px",
                    borderRadius: "12px",
                  }}
                >
                  <MenuItem value="icon">꽃</MenuItem>
                  <MenuItem value="故">故</MenuItem>
                </Select>
              </Box>
            </Box>
          </AccordionDetails>
        </AppAccordion>
      </Box>

      {/* 주소 검색 SwipeableDrawer */}
      <AppSwipeableDrawer
        anchor="bottom"
        open={addrDialogOpen}
        onOpen={() => setAddrDialogOpen(true)}
        onClose={() => setAddrDialogOpen(false)}
        title="주소 검색"
      >
        <Box sx={{ width: "100%", maxHeight: "90vh", overflow: "auto" }}>
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
      </AppSwipeableDrawer>
    </>
  );
};

export default Step1_WeddingInfo;

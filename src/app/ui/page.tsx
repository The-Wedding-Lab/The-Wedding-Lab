"use client";

import AppAccordion from "@/components/ui/AppAccordion";
import AppButton from "@/components/ui/AppButton";
import AppChipCheckBox from "@/components/ui/AppChipCheckBox";
import AppProgressBar from "@/components/ui/AppProgressBar";
import AppTextField from "@/components/ui/AppTextField";
import { Close, DragIndicator, ExpandMore, Send } from "@mui/icons-material";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const CardWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <Card sx={{ padding: "20px", maxWidth: "375px", margin: "50px auto" }}>
      <Typography variant="h5" gutterBottom textAlign="center" mb={3}>
        {title}
      </Typography>
      {children}
    </Card>
  );
};

const ContentBox = ({
  children,
  gridTemplateColumns = "repeat(2, 1fr)",
}: {
  children: React.ReactNode;
  gridTemplateColumns?: string;
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns,
        gap: "16px",
      }}
    >
      {children}
    </Box>
  );
};

const ProgressBarBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        justifyContent: "center",
        alignItems: "center",
        my: 2,
      }}
    >
      {children}
    </Box>
  );
};

const Page = () => {
  const [testSelected, setTestSelected] = useState(true);
  const [chipState, setChipState] = useState({
    primary: true,
    secondary: false,
    highlight: true,
    natural: true,
    dark: true,
  });

  const handleChipChange = (key: keyof typeof chipState) => {
    setChipState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <CardWrapper title="AppButton">
        <ContentBox>
          <AppButton color="primary" variant="contained">
            Primary
          </AppButton>
          <AppButton color="secondary" variant="contained">
            Secondary
          </AppButton>
          <AppButton color="highlight" variant="contained">
            Highlight
          </AppButton>
          <AppButton color="natural" variant="contained">
            Natural
          </AppButton>
          <AppButton color="dark" variant="contained">
            Dark
          </AppButton>
          <AppButton color="primary" variant="outlined">
            Outlined
          </AppButton>
          <AppButton color="secondary" variant="outlined">
            Outlined
          </AppButton>
          <AppButton color="highlight" variant="outlined">
            Outlined
          </AppButton>
          <AppButton color="natural" variant="outlined">
            Outlined
          </AppButton>
          <AppButton color="dark" variant="outlined">
            Outlined
          </AppButton>
          <AppButton color="primary" variant="text">
            Text
          </AppButton>
          <AppButton color="secondary" variant="text">
            Text
          </AppButton>
          <AppButton color="highlight" variant="text">
            Text
          </AppButton>
          <AppButton color="natural" variant="text">
            Text
          </AppButton>
          <AppButton color="dark" variant="text">
            Text
          </AppButton>
        </ContentBox>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <AppButton color="primary" variant="contained" fullWidth>
            fullWidth
          </AppButton>
          {/* <AppButton
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => {
              window.ReactNativeWebView?.postMessage("vibrate");
            }}
          >
            진동테스트
          </AppButton>
          <AppButton
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => {
              window.ReactNativeWebView?.postMessage("openCamera");
            }}
          >
            카메라 테스트
          </AppButton>
          <AppButton
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => {
              window.ReactNativeWebView?.postMessage("openGallery");
            }}
          >
            갤러리 테스트
          </AppButton> */}
        </Box>
      </CardWrapper>
      <CardWrapper title="AppTextField">
        <ContentBox>
          <AppTextField label="Label" />
          <AppTextField placeholder="Placeholder" />
          <AppTextField disabled value="disabled" />
          <AppTextField error value="error" />
          <AppTextField helperText="helperText" value="helperText" />
          <AppTextField helperText="error" error value="error + helperText" />
          <AppTextField success value="success" />
          <AppTextField
            slotProps={{
              input: {
                startAdornment: <Send />,
                endAdornment: <Close />,
              },
            }}
            value="startAdornment,endAdornment"
          />
          <AppTextField labelText="labelText" value="labelText" />
        </ContentBox>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <AppTextField fullWidth label="fullWidth" />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <AppTextField fullWidth label="multiline" multiline rows={4} />
        </Box>
      </CardWrapper>
      <CardWrapper title="AppProgressBar">
        <ProgressBarBox>
          <AppProgressBar value={50} color="primary" sx={{ width: "60%" }} />
          <Typography variant="body2" color="primary" sx={{ width: "40%" }}>
            primary
          </Typography>
        </ProgressBarBox>
        <ProgressBarBox>
          <AppProgressBar value={50} color="secondary" sx={{ width: "60%" }} />
          <Typography variant="body2" color="secondary" sx={{ width: "40%" }}>
            secondary
          </Typography>
        </ProgressBarBox>
        <ProgressBarBox>
          <AppProgressBar value={50} color="highlight" sx={{ width: "60%" }} />
          <Typography variant="body2" color="highlight" sx={{ width: "40%" }}>
            highlight
          </Typography>
        </ProgressBarBox>
        <ProgressBarBox>
          <AppProgressBar value={50} color="natural" sx={{ width: "60%" }} />
          <Typography variant="body2" color="natural" sx={{ width: "40%" }}>
            natural
          </Typography>
        </ProgressBarBox>
        <ProgressBarBox>
          <AppProgressBar value={50} color="dark" sx={{ width: "60%" }} />
          <Typography variant="body2" color="dark" sx={{ width: "40%" }}>
            dark
          </Typography>
        </ProgressBarBox>
        <ProgressBarBox>
          <AppProgressBar value={50} sx={{ width: "60%" }} size="small" />
          <Typography variant="body2" color="primary" sx={{ width: "40%" }}>
            size: small
          </Typography>
        </ProgressBarBox>
        <ProgressBarBox>
          <AppProgressBar value={50} sx={{ width: "60%", height: "10px" }} />
          <Typography variant="body2" color="primary" sx={{ width: "40%" }}>
            height
          </Typography>
        </ProgressBarBox>
      </CardWrapper>

      <CardWrapper title="AppAccordion">
        <ProgressBarBox>
          <AppAccordion sx={{ width: "100%" }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <DragIndicator />
                <Typography>AccordionSummary</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>AccordionDetails</Typography>
            </AccordionDetails>
          </AppAccordion>
        </ProgressBarBox>
        <ProgressBarBox>
          <AppAccordion sx={{ width: "100%" }} selected={testSelected}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <DragIndicator />
                <Typography>Selected</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <AppButton
                color="highlight"
                variant="contained"
                fullWidth
                onClick={() => setTestSelected(!testSelected)}
              >
                선택하기
              </AppButton>
            </AccordionDetails>
          </AppAccordion>
        </ProgressBarBox>
        <ProgressBarBox>
          <AppAccordion sx={{ width: "100%" }} selected={testSelected}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <DragIndicator />
                <Typography>양가 가족 안내</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "flex",

                  gap: "6px",
                  marginBottom: "16px",
                  flexDirection: "column",
                  mx: 1,
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="전화번호 표시"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="계좌번호 표시"
                  />
                </FormGroup>
              </Box>
              <Box>
                <AppButton
                  color="highlight"
                  variant="contained"
                  fullWidth
                  onClick={() => setTestSelected(!testSelected)}
                >
                  선택하기
                </AppButton>
              </Box>
            </AccordionDetails>
          </AppAccordion>
        </ProgressBarBox>
      </CardWrapper>
      <CardWrapper title="AppChipCheckBox">
        <ContentBox gridTemplateColumns="repeat(3, 1fr)">
          <AppChipCheckBox
            label="Primary"
            checked={chipState.primary}
            onCheckedChange={() => handleChipChange("primary")}
            color="primary"
          />
          <AppChipCheckBox
            label="Secondary"
            checked={chipState.secondary}
            onCheckedChange={() => handleChipChange("secondary")}
            color="secondary"
          />
          <AppChipCheckBox
            label="Highlight"
            checked={chipState.highlight}
            onCheckedChange={() => handleChipChange("highlight")}
            color="highlight"
          />
          <AppChipCheckBox
            label="Natural"
            checked={chipState.natural}
            onCheckedChange={() => handleChipChange("natural")}
            color="natural"
          />
          <AppChipCheckBox
            label="Dark"
            checked={chipState.dark}
            onCheckedChange={() => handleChipChange("dark")}
            color="dark"
          />
          <AppChipCheckBox
            label="Disabled"
            checked={true}
            onCheckedChange={() => {}}
            color="natural"
            disabled
          />
        </ContentBox>
      </CardWrapper>
    </>
  );
};

export default Page;

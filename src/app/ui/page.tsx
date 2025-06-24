import AppButton from "@/components/ui/AppButton";
import AppTextField from "@/components/ui/AppTextField";
import { Close, Send } from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import React from "react";

const CardWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <Card sx={{ padding: "50px", maxWidth: "1280px", margin: "50px auto" }}>
      <Typography variant="h5" gutterBottom textAlign="center" mb={3}>
        {title}
      </Typography>
      {children}
    </Card>
  );
};

const ContentBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "16px",
      }}
    >
      {children}
    </Box>
  );
};

const page = () => {
  return (
    <>
      <CardWrapper title="AppButton">
        <ContentBox>
          <AppButton color="primary">Primary</AppButton>
          <AppButton color="secondary">Secondary</AppButton>
          <AppButton color="highlight">Highlight</AppButton>
          <AppButton color="natural">Natural</AppButton>
          <AppButton color="dark">Dark</AppButton>
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <AppButton color="primary" variant="contained" fullWidth>
            fullWidth
          </AppButton>
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
            startIcon={<Send />}
            endIcon={<Close />}
            value="startIcon,endIcon"
          />
        </ContentBox>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <AppTextField fullWidth label="fullWidth" />
        </Box>
      </CardWrapper>
    </>
  );
};

export default page;

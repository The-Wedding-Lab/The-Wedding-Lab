"use client";

import AppButton from "../../components/ui/AppButton";
import { Box, Typography } from "@mui/material";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import KakaoMap from "@/components/map/KakaoMap";
import AppTwemoji from "@/components/ui/AppTwemoji";

const Icon = ({
  src,
  alt,
  style,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}) => {
  return (
    <img src={src} alt={alt} style={{ width: 18, height: 18, ...style }} />
  );
};

const NavigationInfoSection = ({
  title,
  enabled,
  text,
  isLast = false,
}: {
  title: string;
  enabled?: boolean;
  text?: string;
  isLast?: boolean;
}) => {
  if (!enabled || !text) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: isLast ? 0 : 3,
        pb: isLast ? 0 : 3,
        borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: 16,
          color: "#333",
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AppTwemoji>{title}</AppTwemoji>
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "#555",
          pl: 1,
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default function MapPage() {
  const { setupData } = useWeddingDataStore();
  const mapDirections = setupData?.weddingInfo?.pages?.mapDirections;
  const location = setupData.weddingInfo.location;

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffffff",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            mb: 2,
            fontSize: 24,
            textAlign: "center",
            color: "#333",
          }}
        >
          오시는 길
        </Typography>
        <KakaoMap
          position={{
            lat: location.lat,
            lng: location.lng,
          }}
        />
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          {mapDirections?.googleMap && (
            <AppButton
              variant="outlined"
              color="highlight"
              fullWidth
              onClick={() => {
                window.location.href = `https://www.google.com/maps/@${location.lat},${location.lng},18z`;
              }}
              sx={{
                px: 1,
              }}
              startIcon={<Icon src="/google.png" alt="구글맵" style={{}} />}
            >
              구글
            </AppButton>
          )}
          {mapDirections?.naverMap && (
            <AppButton
              variant="outlined"
              color="highlight"
              fullWidth
              onClick={() => {
                window.location.href = `https://map.naver.com/?lat=${location.lat}&lng=${location.lng}&dlevel=14`;
              }}
              sx={{
                px: 1,
              }}
              startIcon={<Icon src="/naver.png" alt="네이버맵" style={{}} />}
            >
              네이버
            </AppButton>
          )}
          {mapDirections?.tmap && (
            <AppButton
              variant="outlined"
              color="highlight"
              fullWidth
              onClick={() => {
                window.location.href = `tmap://route?goalname=&goalx=${setupData.weddingInfo.location.lng}&goaly=${setupData.weddingInfo.location.lat}`;
              }}
              sx={{
                px: 1,
              }}
              startIcon={<Icon src="/tmap.svg" alt="티맵" style={{}} />}
            >
              티맵
            </AppButton>
          )}
        </Box>
        <Box
          sx={{
            mt: 3,
            px: 3,
            py: 3,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
          }}
        >
          <NavigationInfoSection
            title="🚗 자차 안내"
            enabled={mapDirections?.naviInfo?.enabled}
            text={mapDirections?.naviInfo?.text}
          />

          <NavigationInfoSection
            title="🚌 버스 안내"
            enabled={mapDirections?.busInfo?.enabled}
            text={mapDirections?.busInfo?.text}
          />

          <NavigationInfoSection
            title="🚇 지하철 안내"
            enabled={mapDirections?.subwayInfo?.enabled}
            text={mapDirections?.subwayInfo?.text}
          />

          <NavigationInfoSection
            title="🅿️ 주차 안내"
            enabled={mapDirections?.parkingInfo?.enabled}
            text={mapDirections?.parkingInfo?.text}
          />

          <NavigationInfoSection
            title="📢 기타 안내"
            enabled={mapDirections?.etcInfo?.enabled}
            text={mapDirections?.etcInfo?.text}
            isLast={true}
          />
        </Box>
      </Box>
    </>
  );
}

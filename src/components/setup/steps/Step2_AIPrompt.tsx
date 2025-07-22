import AppChipCheckBox from "@/components/ui/AppChipCheckBox";
import AppButton from "@/components/ui/AppButton";
import AppTextField from "@/components/ui/AppTextField";
import { Box, Typography, Slider, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { SmartToy, Toys } from "@mui/icons-material";
import axios from "axios";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import { useSnackbarStore } from "@/store/useSnackbarStore";

interface StepProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const Step2_AIPrompt = ({ data, setData }: StepProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [textLength, setTextLength] = useState<number>(data?.textLength || 2);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { actions, setupData } = useWeddingDataStore();
  const { showStackSnackbar } = useSnackbarStore();

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    setData({ ...data, mood });
  };

  const handleTargetChange = (target: string) => {
    setSelectedTarget(target);
    setData({ ...data, target });
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    setData({ ...data, season });
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    setData({ ...data, style });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setData({ ...data, color });
  };

  const handleTextLengthChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    const value = newValue as number;
    setTextLength(value);
    setData({ ...data, textLength: value });
  };

  const handleGenerateClick = async () => {
    // 필수 선택 항목 확인
    if (
      !selectedMood ||
      !selectedTarget ||
      !selectedSeason ||
      !selectedStyle ||
      !selectedColor
    ) {
      showStackSnackbar("모든 항목을 선택해주세요.");
      return;
    }

    actions.setIsLoading(true);
    setIsGenerating(true);

    try {
      console.log("AI 생성 요청 시작:", {
        mood: selectedMood,
        target: selectedTarget,
        season: selectedSeason,
        style: selectedStyle,
        color: selectedColor,
        textLength,
        additionalRequirements: data?.additionalRequirements,
      });

      const response = await axios.post("/api/ai/chat", {
        mood: selectedMood,
        target: selectedTarget,
        season: selectedSeason,
        style: selectedStyle,
        color: selectedColor,
        textLength,
        additionalRequirements: data?.additionalRequirements || "",
      });

      console.log("AI 생성 응답:", response.data);

      if (response.data.success) {
        console.log("생성된 웨딩 데이터:", response.data.weddingData);

        actions.setSetupData({
          ...setupData,
          weddingInfo: {
            ...setupData.weddingInfo,
            pages: response.data.weddingData.pages,
          },
        });

        console.log("전", {
          ...setupData,
        });

        console.log("후", {
          ...setupData,
          weddingInfo: {
            ...setupData.weddingInfo,
            pages: response.data.weddingData.pages,
          },
        });

        showStackSnackbar("AI가 청첩장을 생성했습니다!", {
          variant: "success",
        });
      } else {
        console.error("AI 생성 실패:", response.data.error);
        showStackSnackbar("AI 생성에 실패했습니다: " + response.data.error, {
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error("AI 생성 중 오류:", error);

      if (error.response) {
        console.error("서버 응답:", error.response.data);
        showStackSnackbar(
          "AI 생성 중 오류가 발생했습니다: " +
            (error.response.data.error || error.message),
          {
            variant: "error",
          }
        );
      } else {
        showStackSnackbar("네트워크 오류가 발생했습니다: " + error.message, {
          variant: "error",
        });
      }
    } finally {
      setIsGenerating(false);
      actions.setIsLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          AI 프롬프트를 입력해주세요.
        </Typography>
        <Box>
          <Typography
            sx={{
              marginBottom: "6px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#333",
            }}
          >
            분위기 선택
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <AppChipCheckBox
              label="밝은 분위기"
              checked={selectedMood === "mood1"}
              onCheckedChange={() => handleMoodChange("mood1")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="차분한 분위기"
              checked={selectedMood === "mood2"}
              onCheckedChange={() => handleMoodChange("mood2")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="진지한 분위기"
              checked={selectedMood === "mood3"}
              onCheckedChange={() => handleMoodChange("mood3")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="심플한 분위기"
              checked={selectedMood === "mood4"}
              onCheckedChange={() => handleMoodChange("mood4")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="격식 있는 분위기"
              checked={selectedMood === "mood5"}
              onCheckedChange={() => handleMoodChange("mood5")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="캐주얼한 분위기"
              checked={selectedMood === "mood6"}
              onCheckedChange={() => handleMoodChange("mood6")}
              radioMode={true}
            />
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              marginBottom: "6px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#333",
            }}
          >
            대상 타겟층 선택
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <AppChipCheckBox
              label="20대"
              checked={selectedTarget === "20대"}
              onCheckedChange={() => handleTargetChange("20대")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="30대"
              checked={selectedTarget === "30대"}
              onCheckedChange={() => handleTargetChange("30대")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="40대"
              checked={selectedTarget === "40대"}
              onCheckedChange={() => handleTargetChange("40대")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="50대"
              checked={selectedTarget === "50대"}
              onCheckedChange={() => handleTargetChange("50대")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="60대"
              checked={selectedTarget === "60대"}
              onCheckedChange={() => handleTargetChange("60대")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="70대"
              checked={selectedTarget === "70대"}
              onCheckedChange={() => handleTargetChange("70대")}
              radioMode={true}
            />
          </Box>
        </Box>

        {/* 계절 선택 */}
        <Box>
          <Typography
            sx={{
              marginBottom: "6px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#333",
            }}
          >
            계절 테마 선택
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <AppChipCheckBox
              label="봄"
              checked={selectedSeason === "spring"}
              onCheckedChange={() => handleSeasonChange("spring")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="여름"
              checked={selectedSeason === "summer"}
              onCheckedChange={() => handleSeasonChange("summer")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="가을"
              checked={selectedSeason === "autumn"}
              onCheckedChange={() => handleSeasonChange("autumn")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="겨울"
              checked={selectedSeason === "winter"}
              onCheckedChange={() => handleSeasonChange("winter")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="계절 무관"
              checked={selectedSeason === "none"}
              onCheckedChange={() => handleSeasonChange("none")}
              radioMode={true}
            />
          </Box>
        </Box>

        {/* 디자인 스타일 */}
        <Box>
          <Typography
            sx={{
              marginBottom: "6px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#333",
            }}
          >
            디자인 스타일
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <AppChipCheckBox
              label="모던"
              checked={selectedStyle === "modern"}
              onCheckedChange={() => handleStyleChange("modern")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="클래식"
              checked={selectedStyle === "classic"}
              onCheckedChange={() => handleStyleChange("classic")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="미니멀"
              checked={selectedStyle === "minimal"}
              onCheckedChange={() => handleStyleChange("minimal")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="로맨틱"
              checked={selectedStyle === "romantic"}
              onCheckedChange={() => handleStyleChange("romantic")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="전통적"
              checked={selectedStyle === "traditional"}
              onCheckedChange={() => handleStyleChange("traditional")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="자연친화적"
              checked={selectedStyle === "nature"}
              onCheckedChange={() => handleStyleChange("nature")}
              radioMode={true}
            />
          </Box>
        </Box>

        {/* 주요 색상 */}
        <Box>
          <Typography
            sx={{
              marginBottom: "6px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#333",
            }}
          >
            주요 색상 테마
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <AppChipCheckBox
              label="파스텔"
              checked={selectedColor === "pastel"}
              onCheckedChange={() => handleColorChange("pastel")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="모노톤"
              checked={selectedColor === "monochrome"}
              onCheckedChange={() => handleColorChange("monochrome")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="화이트 & 골드"
              checked={selectedColor === "white_gold"}
              onCheckedChange={() => handleColorChange("white_gold")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="화이트 & 그린"
              checked={selectedColor === "white_green"}
              onCheckedChange={() => handleColorChange("white_green")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="블루 계열"
              checked={selectedColor === "blue"}
              onCheckedChange={() => handleColorChange("blue")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="핑크 계열"
              checked={selectedColor === "pink"}
              onCheckedChange={() => handleColorChange("pink")}
              radioMode={true}
            />
          </Box>
        </Box>

        {/* 텍스트 길이 */}
        <Box>
          <Typography
            sx={{
              marginBottom: "6px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#333",
            }}
          >
            텍스트 길이
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={textLength}
              onChange={handleTextLengthChange}
              step={1}
              marks={[
                { value: 1, label: "짧게" },
                { value: 2, label: "중간" },
                { value: 3, label: "길게" },
              ]}
              min={1}
              max={3}
              sx={{ width: "100%", maxWidth: "400px" }}
            />
          </Box>
        </Box>

        <AppTextField
          labelText="다른 요구 사항을 입력해주세요."
          fullWidth
          multiline
          rows={3}
          placeholder="어르신들을 위한 격식 있는 청첩장"
          value={data?.additionalRequirements || ""}
          onChange={(e) =>
            setData({ ...data, additionalRequirements: e.target.value })
          }
        />
        <AppButton
          variant="contained"
          color="highlight"
          startIcon={
            isGenerating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SmartToy />
            )
          }
          onClick={handleGenerateClick}
          disabled={isGenerating}
        >
          {isGenerating ? "AI 생성 중..." : "AI로 웨딩 청첩장 생성하기"}
        </AppButton>
      </Box>
      {/* 도메인 가이드 텍스트 */}
      <Box
        sx={{
          mt: 4,
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          padding: "12px 16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography fontSize={13} color="#64748b" mb={1} fontWeight={600}>
          AI 청첩장 생성 가이드
        </Typography>
        <Typography fontSize={12} color="#64748b" lineHeight={1.4}>
          • 상황에 맞는 프롬프트를 입력해주세요.
          <br />• 생성 버튼을 누르면 AI가 웨딩 청첩장을 생성합니다.
          <br />• 생성된 청첩장은 자유롭게 수정할 수 있습니다.
          <br />• 마음에 들지 않으면 다시 생성해보세요.
          <br />
          <br />※ 사진은 직접 추가해주세요.
        </Typography>
      </Box>
    </>
  );
};

export default Step2_AIPrompt;

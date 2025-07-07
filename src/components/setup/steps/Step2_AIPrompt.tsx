import AppChipCheckBox from "@/components/ui/AppChipCheckBox";
import AppTextField from "@/components/ui/AppTextField";
import {
  Box,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React, { useState } from "react";

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
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [textLength, setTextLength] = useState<number>(data?.textLength || 2);

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

  const handleLayoutChange = (layout: string) => {
    setSelectedLayout(layout);
    setData({ ...data, layout });
  };

  const handleTextLengthChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    const value = newValue as number;
    setTextLength(value);
    setData({ ...data, textLength: value });
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          생성형 AI 프롬프트를 입력해주세요.
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

        {/* 레이아웃 구성 */}
        <Box>
          <Typography
            sx={{
              marginBottom: "6px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#333",
            }}
          >
            레이아웃 구성
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
              label="사진 중심"
              checked={selectedLayout === "photo_focused"}
              onCheckedChange={() => handleLayoutChange("photo_focused")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="텍스트 중심"
              checked={selectedLayout === "text_focused"}
              onCheckedChange={() => handleLayoutChange("text_focused")}
              radioMode={true}
            />
            <AppChipCheckBox
              label="균형 있는 구성"
              checked={selectedLayout === "balanced"}
              onCheckedChange={() => handleLayoutChange("balanced")}
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
      </Box>
    </>
  );
};

export default Step2_AIPrompt;

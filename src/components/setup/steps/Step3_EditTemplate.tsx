import AppAccordion from "@/components/ui/AppAccordion";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  MenuItem,
  FormGroup,
  Switch,
  Typography,
  Select,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { DragIndicator } from "@mui/icons-material";
import React, { useState } from "react";
import AppButton from "@/components/ui/AppButton";
import AppTextField from "@/components/ui/AppTextField";
import AppChipCheckBox from "@/components/ui/AppChipCheckBox";

interface SelectableAccordionProps {
  title: string;
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

const SelectableAccordion = ({
  title,
  selected,
  onSelect,
  children,
}: SelectableAccordionProps) => {
  return (
    <AppAccordion sx={{ width: "100%" }} selected={selected}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <DragIndicator />
          <Typography>{title}</Typography>
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
          {children}
        </Box>
        <Box>
          <AppButton
            color="highlight"
            variant="contained"
            fullWidth
            onClick={onSelect}
          >
            선택하기
          </AppButton>
        </Box>
      </AccordionDetails>
    </AppAccordion>
  );
};

////////////// 컴포넌트

/**
 * 양가 가족 안내
 */
const FamilyInfoAccordion = () => {
  const [selected, setSelected] = useState(false);
  return (
    <SelectableAccordion
      title="양가 가족 안내"
      selected={selected}
      onSelect={() => setSelected(!selected)}
    >
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={<Switch />}
          label="전화번호 표시"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={<Switch />}
          label="계좌번호 표시"
        />
      </FormGroup>
    </SelectableAccordion>
  );
};

/**
 * 오시는 길
 */

const MapAccordion = () => {
  const [selected, setSelected] = useState(false);
  const [selectedNaviInfo, setSelectedNaviInfo] = useState(false); //자차 안내
  const [selectedBusInfo, setSelectedBusInfo] = useState(false); //버스 안내
  const [selectedSubwayInfo, setSelectedSubwayInfo] = useState(false); //지하철 안내
  const [selectedParkingInfo, setSelectedParkingInfo] = useState(false); //주차 안내
  const [selectedEtcInfo, setSelectedEtcInfo] = useState(false); //기타 안내
  return (
    <SelectableAccordion
      title="오시는 길"
      selected={selected}
      onSelect={() => setSelected(!selected)}
    >
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={<Switch />}
          label="네이버 지도"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={<Switch />}
          label="티맵"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={<Switch />}
          label="구글맵"
        />
      </FormGroup>
      <SelectableAccordion
        title="자차 안내"
        selected={selectedNaviInfo}
        onSelect={() => setSelectedNaviInfo(!selectedNaviInfo)}
      >
        <AppTextField
          multiline
          rows={2}
          fullWidth
          placeholder="더 컨벤션 영등포 검색"
        />
      </SelectableAccordion>
      <SelectableAccordion
        title="버스 안내"
        selected={selectedBusInfo}
        onSelect={() => setSelectedBusInfo(!selectedBusInfo)}
      >
        <AppTextField
          multiline
          rows={2}
          fullWidth
          placeholder="1000번 하차 후 버거킹쪽으로 도보 100m"
        />
      </SelectableAccordion>
      <SelectableAccordion
        title="지하철 안내"
        selected={selectedSubwayInfo}
        onSelect={() => setSelectedSubwayInfo(!selectedSubwayInfo)}
      >
        <AppTextField
          multiline
          rows={2}
          fullWidth
          placeholder="2호선 영등포구청역 1번 출구"
        />
      </SelectableAccordion>
      <SelectableAccordion
        title="주차 안내"
        selected={selectedParkingInfo}
        onSelect={() => setSelectedParkingInfo(!selectedParkingInfo)}
      >
        <AppTextField
          multiline
          rows={2}
          fullWidth
          placeholder="상가 지하주차장 이용 가능"
        />
      </SelectableAccordion>
      <SelectableAccordion
        title="기타 안내"
        selected={selectedEtcInfo}
        onSelect={() => setSelectedEtcInfo(!selectedEtcInfo)}
      >
        <AppTextField
          multiline
          rows={2}
          fullWidth
          placeholder="셔틀 운행 A역 - B역 12시 30분 출발"
        />
      </SelectableAccordion>
    </SelectableAccordion>
  );
};

/**
 * 갤러리
 */
const GalleryAccordion = () => {
  const [selected, setSelected] = useState(false);
  const [selectedSliderDesign, setSelectedSliderDesign] = useState("mode1"); // 슬라이더 디자인

  return (
    <SelectableAccordion
      title="갤러리"
      selected={selected}
      onSelect={() => setSelected(!selected)}
    >
      <Box
        sx={{
          background: "#f0f0f0",
          width: "100%",
          height: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        파일 업로드 영역
      </Box>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "row",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <AppChipCheckBox
          label="페이징"
          checked={selectedSliderDesign === "mode1"}
          onCheckedChange={() => setSelectedSliderDesign("mode1")}
          radioMode={true}
        />
        <AppChipCheckBox
          label="스와이프"
          checked={selectedSliderDesign === "mode2"}
          onCheckedChange={() => setSelectedSliderDesign("mode2")}
          radioMode={true}
        />
        <AppChipCheckBox
          label="그리드"
          checked={selectedSliderDesign === "mode3"}
          onCheckedChange={() => setSelectedSliderDesign("mode3")}
          radioMode={true}
        />
      </Box>

      <FormGroup>
        <FormControlLabel
          defaultChecked
          {...FormControlLabelProps}
          control={<Switch />}
          label="이미지 클릭 시 크게보기"
        />
      </FormGroup>
    </SelectableAccordion>
  );
};
/////////////////////////////

const FormControlLabelProps = {
  labelPlacement: "start",
  sx: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 0,
  },
} as const;

interface StepProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const Step3_EditTemplate = ({ data, setData }: StepProps) => {
  const [testSelected, setTestSelected] = useState(false);
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          추가할 템플릿을 선택해주세요.
        </Typography>
        <FamilyInfoAccordion />
        <MapAccordion />
        <GalleryAccordion />
      </Box>
    </>
  );
};

export default Step3_EditTemplate;

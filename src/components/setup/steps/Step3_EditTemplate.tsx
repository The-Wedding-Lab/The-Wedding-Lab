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
  Dialog,
  DialogContent,
  DialogTitle,
  SwipeableDrawer,
  IconButton,
} from "@mui/material";
import { Close, ExpandMore } from "@mui/icons-material";
import { DragIndicator } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import AppButton from "@/components/ui/AppButton";
import AppTextField from "@/components/ui/AppTextField";
import AppChipCheckBox from "@/components/ui/AppChipCheckBox";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  Modifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AppSwipeableDrawer from "@/components/ui/AppSwipeableDrawer";
import UploadForm from "@/components/uploadForm/UploadForm";
import ImageGallery from "@/components/uploadForm/ImageGallery";
import StackedGallery from "@/components/gallery/StackedGallery";
import GridGallery from "@/components/gallery/GridGallery";
import SwipeGallery from "@/components/gallery/SwipeGallery";
import { nanoid } from "nanoid";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useKakaoSdk } from "@/hooks/useKakaoSdk";
import { useUserStore } from "@/store/useUserStore";

// 공통 FileData 인터페이스
interface FileData {
  file: File;
  name: string;
  size: number;
  binaryData: ArrayBuffer;
  url: string; // data URL 추가
}

interface SelectableAccordionProps {
  title: string;
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  id: string;
  isDragOverlay?: boolean;
  isNoDrage?: boolean;
  isNoSwitch?: boolean;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SelectableAccordion = ({
  title,
  selected,
  onSelect,
  children,
  id,
  isDragOverlay = false,
  isNoDrage = false,
  isNoSwitch = false,
}: SelectableAccordionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id, disabled: isDragOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "default",
  };

  return (
    <Box ref={setNodeRef} style={style} sx={{}}>
      <AppAccordion
        sx={{
          width: "100%",
          backgroundColor: isDragOverlay ? "background.paper" : "transparent",
          ...(isDragOverlay && {
            border: "none",
            boxShadow: "none",
          }),
          ...(isDragging &&
            !isDragOverlay && {
              border: "2px dashed #90a4ae",
              borderRadius: "12px",
              backgroundColor: "#f5f5f5",
              transition: "all 0.2s ease",
            }),
        }}
        selected={selected}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {!isNoDrage && (
                <DragIndicator
                  {...attributes}
                  {...listeners}
                  sx={{
                    cursor: "grab",
                    "&:active": { cursor: "grabbing" },
                    "&:focus": { outline: "none" },
                    "&:focus-visible": { outline: "none" },
                    "&:hover": { color: "#90a4ae" },
                    touchAction: "none",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    color: isDragging ? "#90a4ae" : "#bdbdbd",
                    transition: "color 0.2s ease",
                  }}
                />
              )}
              <Typography fontWeight={500}>{title}</Typography>
            </Box>

            <Switch
              checked={selected}
              onChange={onSelect}
              disabled={isNoSwitch}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "16px",
            borderTop: "1px solid",
            borderColor: selected ? "#90baff" : "#C5C6CC",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "6px",
              flexDirection: "column",
              mx: 1,
            }}
          >
            {children}
          </Box>
        </AccordionDetails>
      </AppAccordion>
    </Box>
  );
};

////////////// 컴포넌트

/**
 * 컬러피커 섹션
 */
const ColorPickerSection = ({
  selectedColor,
  onColorChange,
  title = "배경색 선택",
}: {
  selectedColor: string;
  onColorChange: (color: string) => void;
  title?: string;
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 미리 정의된 색상 팔레트
  const colorPalette = [
    "#f4f0ea", // 기본 베이지
    "#ffffff", // 화이트
    "#fdf6f0", // 연한 복숭아
    "#f0f8ff", // 연한 하늘색
    "#fff5f5", // 연한 핑크
    "#f0fff0", // 연한 민트
    "#fff8dc", // 연한 노랑
    "#f5f5dc", // 베이지
    "#f0f8ff", // 라벤더
    "#ffe4e1", // 미스티로즈
    "#f0ffff", // 아주어
    "#fafad2", // 라이트골든로드
  ];

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Typography fontSize={14} fontWeight={500} mb={1} color="#333">
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            onClick={() => setDrawerOpen(true)}
            sx={{
              width: "50px",
              height: "40px",
              backgroundColor: selectedColor,
              border: "2px solid #ddd",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#2C83E9",
                transform: "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          ></Box>
          <Typography fontSize={12} color="#666">
            {selectedColor}
          </Typography>
        </Box>
      </Box>

      <AppSwipeableDrawer
        open={drawerOpen}
        title="배경색 선택"
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      >
        <Box>
          <Typography fontSize={16} fontWeight={600} mb={2}>
            추천 색상
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
              mb: 3,
            }}
          >
            {colorPalette.map((color) => (
              <Box
                key={color}
                onClick={() => {
                  onColorChange(color);
                  setDrawerOpen(false);
                }}
                sx={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: color,
                  border:
                    selectedColor === color
                      ? "3px solid #2C83E9"
                      : "2px solid #ddd",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                }}
              >
                {selectedColor === color && (
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#2C83E9",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography fontSize={12} color="white">
                      ✓
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          <Typography fontSize={16} fontWeight={600} mb={2}>
            사용자 지정 색상
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="input"
              type="color"
              value={selectedColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onColorChange(e.target.value);
              }}
              sx={{
                width: "60px",
                height: "60px",
                border: "2px solid #ddd",
                borderRadius: "12px",
                cursor: "pointer",
                "&::-webkit-color-swatch": {
                  border: "none",
                  borderRadius: "8px",
                },
                "&::-webkit-color-swatch-wrapper": {
                  padding: "4px",
                  borderRadius: "12px",
                },
              }}
            />
            <Typography fontSize={14} color="#666">
              직접 색상을 선택하세요
            </Typography>
          </Box>
        </Box>
      </AppSwipeableDrawer>
    </>
  );
};

/**
 * 양가 가족 안내
 */
const FamilyInfoAccordion = ({
  id,
  isDragOverlay = false,
}: {
  id: string;
  isDragOverlay?: boolean;
}) => {
  const { setupData, actions } = useWeddingDataStore();
  const familyInfo = setupData.weddingInfo?.pages?.familyInfo;

  const updateFamilyInfo = (updates: any) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          familyInfo: {
            ...familyInfo,
            ...updates,
          },
        },
      },
    });
  };

  return (
    <SelectableAccordion
      id={id}
      title="양가 가족 안내"
      selected={familyInfo?.enabled}
      onSelect={() => updateFamilyInfo({ enabled: !familyInfo.enabled })}
      isDragOverlay={isDragOverlay}
    >
      <Box className="info-box">
        <Typography
          sx={{ fontSize: 18, color: "#666", mb: 1, fontWeight: 600 }}
        >
          안내사항
        </Typography>
        <Typography
          sx={{ fontSize: 14, color: "#aaa", mb: 2, fontWeight: 500 }}
        >
          예식 정보 입력에서 <b>혼주님 전화 번호</b>를 입력해주세요.
          <br />
          입력 란을 비워두시면 표시되지 않습니다.
        </Typography>
      </Box>
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={
            <Switch
              checked={familyInfo?.telEnabled}
              onChange={(e) =>
                updateFamilyInfo({ telEnabled: e.target.checked })
              }
            />
          }
          label="전화번호 표시"
        />
      </FormGroup>

      <ColorPickerSection
        selectedColor={familyInfo?.backgroundColor2 || "#f0f8ff"}
        onColorChange={(color) => updateFamilyInfo({ backgroundColor2: color })}
      />
    </SelectableAccordion>
  );
};

/**
 * 오시는 길
 */
const MapAccordion = ({
  id,
  isDragOverlay = false,
}: {
  id: string;
  isDragOverlay?: boolean;
}) => {
  const { setupData, actions } = useWeddingDataStore();
  const mapDirections = setupData.weddingInfo?.pages?.mapDirections;

  const updateMapDirections = (updates: any) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          mapDirections: {
            ...mapDirections,
            ...updates,
          },
        },
      },
    });
  };

  return (
    <SelectableAccordion
      id={id}
      title="오시는 길"
      selected={mapDirections.enabled}
      onSelect={() => updateMapDirections({ enabled: !mapDirections.enabled })}
      isDragOverlay={isDragOverlay}
    >
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={
            <Switch
              checked={mapDirections.naverMap}
              onChange={(e) =>
                updateMapDirections({ naverMap: e.target.checked })
              }
            />
          }
          label="네이버 지도"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={
            <Switch
              checked={mapDirections.tmap}
              onChange={(e) => updateMapDirections({ tmap: e.target.checked })}
            />
          }
          label="티맵"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={
            <Switch
              checked={mapDirections.googleMap}
              onChange={(e) =>
                updateMapDirections({ googleMap: e.target.checked })
              }
            />
          }
          label="구글맵"
        />
      </FormGroup>
      {!isDragOverlay && (
        <>
          <SelectableAccordion
            id={"naviInfo"}
            title="자차 안내"
            isNoDrage={true}
            selected={mapDirections.naviInfo.enabled}
            onSelect={() =>
              updateMapDirections({
                naviInfo: { enabled: !mapDirections.naviInfo.enabled },
              })
            }
          >
            <AppTextField
              multiline
              rows={2}
              fullWidth
              placeholder="'더컨벤션 영등포' 검색"
              value={mapDirections.naviInfo.text}
              onChange={(e) =>
                updateMapDirections({
                  naviInfo: { ...mapDirections.naviInfo, text: e.target.value },
                })
              }
            />
          </SelectableAccordion>
          <SelectableAccordion
            id={"busInfo"}
            title="버스 안내"
            isNoDrage={true}
            selected={mapDirections.busInfo.enabled}
            onSelect={() =>
              updateMapDirections({
                busInfo: { enabled: !mapDirections.busInfo.enabled },
              })
            }
          >
            <AppTextField
              multiline
              rows={2}
              fullWidth
              placeholder="11번 하차 후 버거킹쪽으로 도보 100m"
              value={mapDirections.busInfo.text}
              onChange={(e) =>
                updateMapDirections({
                  busInfo: { ...mapDirections.busInfo, text: e.target.value },
                })
              }
            />
          </SelectableAccordion>
          <SelectableAccordion
            id={"subwayInfo"}
            title="지하철 안내"
            isNoDrage={true}
            selected={mapDirections.subwayInfo.enabled}
            onSelect={() =>
              updateMapDirections({
                subwayInfo: { enabled: !mapDirections.subwayInfo.enabled },
              })
            }
          >
            <AppTextField
              multiline
              rows={2}
              fullWidth
              placeholder="2호선 영등포구청역 1번 출구 도보 100m"
              value={mapDirections.subwayInfo.text}
              onChange={(e) =>
                updateMapDirections({
                  subwayInfo: {
                    ...mapDirections.subwayInfo,
                    text: e.target.value,
                  },
                })
              }
            />
          </SelectableAccordion>
          <SelectableAccordion
            id={"parkingInfo"}
            title="주차 안내"
            isNoDrage={true}
            selected={mapDirections.parkingInfo.enabled}
            onSelect={() =>
              updateMapDirections({
                parkingInfo: { enabled: !mapDirections.parkingInfo.enabled },
              })
            }
          >
            <AppTextField
              multiline
              rows={2}
              fullWidth
              placeholder="상가 지하주차장 이용 가능"
              value={mapDirections.parkingInfo.text}
              onChange={(e) =>
                updateMapDirections({
                  parkingInfo: {
                    ...mapDirections.parkingInfo,
                    text: e.target.value,
                  },
                })
              }
            />
          </SelectableAccordion>
          <SelectableAccordion
            id={"etcInfo"}
            title="기타 안내"
            isNoDrage={true}
            selected={mapDirections.etcInfo.enabled}
            onSelect={() =>
              updateMapDirections({
                etcInfo: { enabled: !mapDirections.etcInfo.enabled },
              })
            }
          >
            <AppTextField
              multiline
              rows={2}
              fullWidth
              placeholder="셔틀 운행 A역 - 웨딩홀 12시 30분 출발"
              value={mapDirections.etcInfo.text}
              onChange={(e) =>
                updateMapDirections({
                  etcInfo: { ...mapDirections.etcInfo, text: e.target.value },
                })
              }
            />
          </SelectableAccordion>

          <ColorPickerSection
            selectedColor={mapDirections.backgroundColor2 || "#f0f8ff"}
            onColorChange={(color) =>
              updateMapDirections({ backgroundColor2: color })
            }
          />
        </>
      )}
    </SelectableAccordion>
  );
};

/**
 * 갤러리
 */
const GalleryAccordion = ({
  id,
  isDragOverlay = false,
}: {
  id: string;
  isDragOverlay?: boolean;
}) => {
  const [previewOpen, setPreviewOpen] = useState(true);
  const { setupData, actions } = useWeddingDataStore();
  const gallery = setupData.weddingInfo?.pages?.gallery;

  const updateGallery = (updates: any) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          gallery: {
            ...gallery,
            ...updates,
          },
        },
      },
    });
  };

  //이미지 업로드 상태 관리 - FileData 타입으로 변경
  const [uploadedImages, setUploadedImages] = useState<FileData[]>([]);

  const handleUpload = async (filesData: FileData[]) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          gallery: {
            ...gallery,
            images: [...filesData],
          },
        },
      },
    });

    console.log(setupData.weddingInfo.pages.gallery.images);
  };

  return (
    <SelectableAccordion
      id={id}
      title="갤러리"
      selected={gallery.enabled}
      onSelect={() => updateGallery({ enabled: !gallery.enabled })}
      isDragOverlay={isDragOverlay}
    >
      <UploadForm
        title="갤러리 이미지 업로드"
        description="최대 10개까지 업로드 가능합니다."
        onFilesChange={handleUpload}
        accept="image/*"
        multiple={true}
        maxFiles={10}
      />
      {uploadedImages.length > 0 && <></>}

      {!isDragOverlay && (
        <>
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
              label="스택형"
              checked={gallery.displayType === "stacked"}
              onCheckedChange={() => updateGallery({ displayType: "stacked" })}
              radioMode={true}
            />
            <AppChipCheckBox
              label="무한 스와이프"
              checked={gallery.displayType === "swipe"}
              onCheckedChange={() => updateGallery({ displayType: "swipe" })}
              radioMode={true}
            />
            <AppChipCheckBox
              label="그리드"
              checked={gallery.displayType === "grid"}
              onCheckedChange={() => updateGallery({ displayType: "grid" })}
              radioMode={true}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormGroup>
              <FormControlLabel
                {...FormControlLabelProps}
                control={
                  <Switch
                    checked={previewOpen}
                    onChange={(e) => setPreviewOpen(e.target.checked)}
                  />
                }
                label="미리보기 표시"
              />
            </FormGroup>
            <ColorPickerSection
              selectedColor={gallery.backgroundColor2 || "#f0f8ff"}
              onColorChange={(color) =>
                updateGallery({ backgroundColor2: color })
              }
            />
          </Box>

          <Box py={2} sx={{ display: previewOpen ? "block" : "none" }}>
            <Typography variant="h6" mb={2}>
              미리보기
            </Typography>
            <Box key={gallery.images.length}>
              {gallery.displayType === "stacked" && (
                <StackedGallery images={gallery.images} />
              )}
              {gallery.displayType === "swipe" && (
                <SwipeGallery images={gallery.images} />
              )}
              {gallery.displayType === "grid" && (
                <GridGallery images={gallery.images} />
              )}
            </Box>
          </Box>
        </>
      )}
    </SelectableAccordion>
  );
};

/**
 * 커버 디자인
 */
const CoverDesignAccordion = ({
  id,
  isDragOverlay = false,
}: {
  id: string;
  isDragOverlay?: boolean;
}) => {
  const { setupData, actions } = useWeddingDataStore();
  const coverDesign = setupData.weddingInfo?.pages?.coverDesign;

  const updateCoverDesign = (updates: any) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          coverDesign: {
            ...coverDesign,
            ...updates,
          },
        },
      },
    });
  };

  const handleUpload = async (filesData: FileData[]) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          coverDesign: { ...coverDesign, image: filesData[0] },
        },
      },
    });
  };

  return (
    <SelectableAccordion
      id={id}
      title="커버 디자인"
      selected={coverDesign?.enabled}
      onSelect={() => updateCoverDesign({ enabled: !coverDesign?.enabled })}
      isDragOverlay={isDragOverlay}
    >
      <UploadForm
        title="커버 이미지 업로드"
        description="커버 이미지를 업로드하세요"
        onFilesChange={handleUpload}
        accept="image/*"
        multiple={false}
        maxFiles={1}
      />
      {coverDesign?.image?.url && (
        <ImageGallery
          images={[coverDesign.image.file]}
          onImageRemove={() => {}}
          mode="single"
          imageHeight={200}
        />
      )}
      <AppTextField
        sx={{ mt: 2 }}
        fullWidth
        placeholder="텍스트를 입력하세요"
        value={coverDesign?.text || ""}
        onChange={(e) => updateCoverDesign({ text: e.target.value })}
      />

      <ColorPickerSection
        selectedColor={coverDesign?.backgroundColor2 || "#f0f8ff"}
        onColorChange={(color) =>
          updateCoverDesign({ backgroundColor2: color })
        }
      />
    </SelectableAccordion>
  );
};

/**
 * 모시는 글
 */
const IntroMessageAccordion = ({
  id,
  isDragOverlay = false,
}: {
  id: string;
  isDragOverlay?: boolean;
}) => {
  const { setupData, actions } = useWeddingDataStore();
  const introMessage = setupData.weddingInfo?.pages?.introMessage;

  const updateIntroMessage = (updates: any) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          introMessage: {
            ...introMessage,
            ...updates,
          },
        },
      },
    });
  };

  //이미지 업로드 상태 관리
  const [uploadedImages, setUploadedImages] = useState<FileData[]>([]);

  const handleUpload = async (filesData: FileData[]) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          introMessage: { ...introMessage, image: filesData[0] },
        },
      },
    });
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <SelectableAccordion
        id={id}
        title="모시는 글"
        selected={introMessage?.enabled}
        onSelect={() => updateIntroMessage({ enabled: !introMessage?.enabled })}
        isDragOverlay={isDragOverlay}
      >
        <UploadForm
          title="모시는 글 이미지 업로드"
          description="모시는 글 이미지를 업로드하세요"
          onFilesChange={handleUpload}
          accept="image/*"
          multiple={false}
          maxFiles={1}
        />
        {introMessage?.image?.url && (
          <ImageGallery
            images={[introMessage.image.file]}
            onImageRemove={() => {
              updateIntroMessage({
                image: { ...introMessage?.image, url: "" },
              });
            }}
            mode="single"
            imageHeight={200}
          />
        )}
        <AppTextField
          sx={{ mt: 2 }}
          fullWidth
          placeholder="제목을 입력하세요"
          value={introMessage?.title || ""}
          onChange={(e) => updateIntroMessage({ title: e.target.value })}
        />
        <AppTextField
          sx={{ mt: 2 }}
          multiline
          rows={4}
          fullWidth
          placeholder="모시는 글을 입력하세요"
          value={introMessage?.text || ""}
          onChange={(e) => updateIntroMessage({ text: e.target.value })}
        />
        <AppButton
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setDrawerOpen(true)}
        >
          예시 텍스트
        </AppButton>

        <ColorPickerSection
          selectedColor={introMessage?.backgroundColor2 || "#f0f8ff"}
          onColorChange={(color) =>
            updateIntroMessage({ backgroundColor2: color })
          }
        />
      </SelectableAccordion>
      <AppSwipeableDrawer
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
        title="예시 텍스트"
      >
        <Box
          sx={{
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            원하는 문구를 선택하면 자동으로 입력됩니다.
          </Typography>

          {/* 예시 문구 카드들 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              overflowY: "auto",
            }}
          >
            {[
              {
                title: "편안한 동반자",
                text: "서로에게 가장 편안한 사람이 되어\n함께 살아가기로 했습니다.\n새롭게 시작하는\n저희 두 사람의 앞날을\n함께 축복해주시면\n더없이 감사하겠습니다.",
              },
              {
                title: "평생의 약속",
                text: "평생을 함께하고 싶은\n사람을 만났습니다.\n서로를 아끼고 사랑하며\n행복한 가정을 이루어\n살아가겠습니다.\n저희의 새로운 시작을\n축복해 주세요.",
              },
              {
                title: "따뜻한 인연",
                text: "따뜻한 봄날\n꽃이 피어나듯\n저희도 아름다운 사랑을\n꽃피우게 되었습니다.\n소중한 분들과 함께\n이 기쁨을 나누고 싶어\n모시게 되었습니다.",
              },
              {
                title: "운명적 만남",
                text: "오래도록 기다려온\n소중한 인연을 만나\n하나가 되려 합니다.\n저희의 결혼을\n진심으로 축하해 주시고\n앞날을 응원해 주시면\n감사하겠습니다.",
              },
              {
                title: "사랑의 결실",
                text: "사랑하는 사람과\n인생을 함께 하기로\n약속했습니다.\n서로를 믿고 의지하며\n행복한 가정을 꾸려\n가겠습니다.\n축복해 주세요.",
              },
              {
                title: "새로운 출발",
                text: "두 사람이 만나\n하나의 꿈을 꾸게 되었습니다.\n서로를 아끼고 존중하며\n사랑이 가득한 가정을\n만들어 가겠습니다.\n여러분의 축복 속에서\n새로운 출발을 하겠습니다.",
              },
            ].map((sample, index) => (
              <Box
                key={index}
                onClick={() => {
                  updateIntroMessage({
                    text: sample.text,
                    title: sample.title,
                  });
                  setDrawerOpen(false);
                }}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "action.hover",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  {sample.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {sample.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </AppSwipeableDrawer>
    </>
  );
};

/**
 * 캘린더
 */
const CalendarAccordion = ({
  id,
  isDragOverlay = false,
}: {
  id: string;
  isDragOverlay?: boolean;
}) => {
  const { setupData, actions } = useWeddingDataStore();
  const calendar = setupData.weddingInfo?.pages?.calendar;

  const updateCalendar = (updates: any) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          calendar: {
            ...calendar,
            ...updates,
          },
        },
      },
    });
  };

  return (
    <SelectableAccordion
      id={id}
      title="캘린더"
      selected={calendar?.enabled}
      onSelect={() => updateCalendar({ enabled: !calendar?.enabled })}
      isDragOverlay={isDragOverlay}
    >
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={
            <Switch
              checked={calendar?.view?.calendar}
              onChange={(e) =>
                updateCalendar({
                  view: { ...calendar?.view, calendar: e.target.checked },
                })
              }
            />
          }
          label="캘린더 표시"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={
            <Switch
              checked={calendar?.view?.countdown}
              onChange={(e) =>
                updateCalendar({
                  view: { ...calendar?.view, countdown: e.target.checked },
                })
              }
            />
          }
          label="카운트다운 표시"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={
            <Switch
              checked={calendar?.view?.dDay}
              onChange={(e) =>
                updateCalendar({
                  view: { ...calendar?.view, dDay: e.target.checked },
                })
              }
            />
          }
          label="D-Day 표시"
        />
      </FormGroup>
      <ColorPickerSection
        selectedColor={calendar?.backgroundColor2 || "#f0f8ff"}
        onColorChange={(color) => updateCalendar({ backgroundColor2: color })}
      />
    </SelectableAccordion>
  );
};

/**
 * 계좌 정보
 */
const AccountInfoAccordion = ({
  id,
  isDragOverlay = false,
}: {
  id: string;
  isDragOverlay?: boolean;
}) => {
  const { setupData, actions } = useWeddingDataStore();
  const accountInfo = setupData.weddingInfo?.pages?.accountInfo;

  const updateAccountInfo = (updates: any) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          accountInfo: {
            ...accountInfo,
            ...updates,
          },
        },
      },
    });
  };

  //dialog
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [exampleTextDrawerOpen, setExampleTextDrawerOpen] = useState(false);

  return (
    <>
      <SelectableAccordion
        id={id}
        title="계좌 정보"
        selected={accountInfo?.enabled}
        onSelect={() => updateAccountInfo({ enabled: !accountInfo?.enabled })}
        isDragOverlay={isDragOverlay}
      >
        <Box className="info-box">
          <Typography
            sx={{ fontSize: 18, color: "#666", mb: 1, fontWeight: 600 }}
          >
            안내사항
          </Typography>
          <Typography
            sx={{ fontSize: 14, color: "#aaa", mb: 2, fontWeight: 500 }}
          >
            예식 정보 입력에서 <b>혼주님 계좌 정보</b>를 입력해주세요.
            <br />
            입력 란을 비워두시면 표시되지 않습니다.
          </Typography>
        </Box>
        <AppTextField
          fullWidth
          labelText="안내 문구"
          placeholder="안내 문구를 입력하세요"
          value={accountInfo?.description || ""}
          onChange={(e) => updateAccountInfo({ description: e.target.value })}
          multiline
          rows={3}
        />

        <AppButton
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setExampleTextDrawerOpen(true)}
        >
          예시 텍스트
        </AppButton>

        <ColorPickerSection
          selectedColor={accountInfo?.backgroundColor2 || "#c3cfe2"}
          onColorChange={(color) =>
            updateAccountInfo({ backgroundColor2: color })
          }
        />

        {/* <AppTextField
          fullWidth
          labelText="카카오페이 QR 코드 사용시"
          placeholder="카카오페이 링크를 입력하세요"
          value={accountInfo?.kakaopayLink || ""}
          onChange={(e) => updateAccountInfo({ kakaopayLink: e.target.value })}
        />
        <AppButton
          variant="outlined"
          color="highlight"
          size="small"
          sx={{ mt: 2 }}
          onClick={() => setDrawerOpen(true)}
        >
          카카오페이 링크 확인하는 방법
        </AppButton> */}
      </SelectableAccordion>
      <AppSwipeableDrawer
        open={drawerOpen}
        title="카카오페이 링크 확인하는 방법"
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ height: "70vh", display: "flex", flexDirection: "column" }}>
          <Typography>1. 카카오페이 앱을 실행합니다.</Typography>
          <Typography>2. 카카오페이 앱을 실행합니다.</Typography>
          <Typography>3. 카카오페이 앱을 실행합니다.</Typography>
          <Typography>4. 카카오페이 앱을 실행합니다.</Typography>
          <Typography>5. 카카오페이 앱을 실행합니다.</Typography>
          <Typography>6. 카카오페이 앱을 실행합니다.</Typography>
        </Box>
      </AppSwipeableDrawer>

      {/* 예시 텍스트 drawer */}
      <AppSwipeableDrawer
        open={exampleTextDrawerOpen}
        onOpen={() => setExampleTextDrawerOpen(true)}
        onClose={() => setExampleTextDrawerOpen(false)}
        title="예시 텍스트"
      >
        <Box
          sx={{
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            원하는 문구를 선택하면 자동으로 입력됩니다.
          </Typography>

          {/* 예시 문구 카드들 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              overflowY: "auto",
            }}
          >
            {[
              {
                title: "정중하고 일반적인 표현",
                text: "축하해주시는 따뜻한 마음만으로도 충분히 감사합니다. 멀리서 마음을 전하고 싶으신 분들을 위해 조심스럽게 안내해 드립니다.",
              },
              {
                title: "감사를 강조하는 부드러운 표현",
                text: "저희 두 사람의 시작을 축복해주시는 마음에 진심으로 감사합니다. 혹시 마음을 전하고 싶으신 분들을 위해 준비했습니다.",
              },
              {
                title: "간결하고 직접적인 표현",
                text: "참석이 어려워 마음을 전하고 싶어 하시는 분들을 위해 준비했습니다. 따뜻한 마음 감사히 받겠습니다",
              },
              {
                title: "참석에 대한 감사를 강조하는 표현",
                text: "귀한 걸음으로 축하해주시는 마음, 소중히 간직하겠습니다. 혹시 멀리서 응원해주실 분들을 위해 안내해 드립니다.",
              },
            ].map((sample, index) => (
              <Box
                key={index}
                onClick={() => {
                  updateAccountInfo({ description: sample.text });
                  setExampleTextDrawerOpen(false);
                }}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "action.hover",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  {sample.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {sample.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </AppSwipeableDrawer>
    </>
  );
};

/**
 * 마지막 글
 */
const EndingMessageAccordion = ({
  id,
  isDragOverlay = false,
}: {
  id: string;
  isDragOverlay?: boolean;
}) => {
  const { setupData, actions } = useWeddingDataStore();
  const endingMessage = setupData.weddingInfo?.pages?.endingMessage;

  const updateEndingMessage = (updates: any) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          endingMessage: {
            ...endingMessage,
            ...updates,
          },
        },
      },
    });
  };

  //이미지 업로드 상태 관리
  const [uploadedImages, setUploadedImages] = useState<FileData[]>([]);

  const handleUpload = async (filesData: FileData[]) => {
    actions.setSetupData({
      weddingInfo: {
        ...setupData.weddingInfo,
        pages: {
          ...setupData.weddingInfo.pages,
          endingMessage: { ...endingMessage, image: filesData[0] },
        },
      },
    });
  };

  return (
    <SelectableAccordion
      id={id}
      title="마지막 글"
      selected={endingMessage?.enabled}
      onSelect={() => updateEndingMessage({ enabled: !endingMessage?.enabled })}
      isDragOverlay={isDragOverlay}
    >
      <UploadForm
        title="마지막 글 이미지 업로드"
        description="마지막 글 이미지를 업로드하세요"
        onFilesChange={handleUpload}
        accept="image/*"
        multiple={false}
        maxFiles={1}
      />
      {endingMessage?.image?.url && (
        <ImageGallery
          images={[endingMessage?.image?.url]}
          onImageRemove={(index: number) => {
            updateEndingMessage({
              image: { ...endingMessage?.image, url: "" },
            });
          }}
          mode="single"
          imageHeight={200}
        />
      )}
      <AppTextField
        sx={{ mt: 2 }}
        multiline
        rows={4}
        fullWidth
        placeholder="마지막 글을 입력하세요"
        value={endingMessage?.text || ""}
        onChange={(e) => updateEndingMessage({ text: e.target.value })}
      />
    </SelectableAccordion>
  );
};

/**
 * 썸네일 업로드
 */
const ThumbnailUploadAccordion = ({
  id,
  isDragOverlay = false,
}: {
  id: string;
  isDragOverlay?: boolean;
}) => {
  const { setupData, actions } = useWeddingDataStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { kakao, isLoaded, isInitialized } = useKakaoSdk();
  const { user } = useUserStore();

  // 썸네일은 항상 활성화되어 있으므로 enabled 상태는 관리하지 않음
  const thumbnailEnabled = true;

  // React Query mutation 정의
  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);

      // 사용자 ID (임시로 'user_123' 사용, 실제로는 인증된 사용자 ID 사용)
      const userId = user?.id; // 실제 구현시 auth 상태에서 가져와야 함

      const response = await axios.post("/api/upload/thumbnail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-User-Id": userId,
        },
      });

      return response.data.path; // 서버에서 반환하는 상대 경로
    },
    onSuccess: (thumbnailPath) => {
      // 스토어에 썸네일 경로 저장
      actions.setSetupData({
        weddingInfo: {
          ...setupData.weddingInfo,
          thumbnail: thumbnailPath,
        },
      });
      console.log("썸네일 업로드 성공:", thumbnailPath);
    },
    onError: (error) => {
      console.error("썸네일 업로드 실패:", error);
      // 에러 처리 (토스트 메시지 등)
    },
  });

  // 파일 선택 처리
  const handleFileSelect = (filesData: FileData[]) => {
    if (filesData.length === 0) return;

    const file = filesData[0].file;
    setSelectedFile(file);

    // 미리보기 생성
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  // 업로드 버튼 클릭 처리
  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  // 선택된 파일 제거
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  };

  return (
    <SelectableAccordion
      id={id}
      title="썸네일 업로드"
      selected={thumbnailEnabled}
      onSelect={() => {}} // 썸네일은 항상 활성화되므로 빈 함수
      isDragOverlay={isDragOverlay}
      isNoDrage={true} // 썸네일은 드래그 불가
      isNoSwitch={true}
    >
      <Box className="info-box">
        <Typography
          sx={{ fontSize: 18, color: "#666", mb: 1, fontWeight: 600 }}
        >
          안내사항
        </Typography>
        <Typography
          sx={{ fontSize: 14, color: "#aaa", mb: 2, fontWeight: 500 }}
        >
          카카오톡 공유시 표시될 썸네일 이미지를 업로드하세요.
          <br />
          권장 크기: 800x400px 이상, 5MB 이내
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <UploadForm
          title="썸네일 이미지 업로드"
          description="썸네일로 사용할 이미지를 선택하세요"
          onFilesChange={handleFileSelect}
          accept="image/*"
          multiple={false}
          maxFiles={1}
        />

        {previewImage && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              미리보기
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
              <Box sx={{ position: "relative" }}>
                <img
                  src={previewImage}
                  alt="Thumbnail Preview"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
                <IconButton
                  onClick={handleRemoveFile}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    minWidth: "auto",
                    bgcolor: "rgba(255,255,255,0.9)",
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {setupData.weddingInfo?.groom?.name} ♥{" "}
                  {setupData.weddingInfo?.bride?.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {formatDate(setupData.weddingInfo?.weddingDateTime)}
                  <br />
                  {setupData.weddingInfo?.location?.venueName}{" "}
                  {setupData.weddingInfo?.location?.hall}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <AppButton
                variant="contained"
                onClick={handleUpload}
                disabled={uploadMutation.isPending || !selectedFile}
                sx={{ flex: 1 }}
              >
                {uploadMutation.isPending ? "업로드 중..." : "업로드"}
              </AppButton>
            </Box>

            {uploadMutation.isError && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, textAlign: "center" }}
              >
                업로드 실패: {uploadMutation.error?.message}
              </Typography>
            )}

            {uploadMutation.isSuccess && (
              <Typography
                variant="body2"
                color="success.main"
                sx={{ mt: 1, textAlign: "center" }}
              >
                업로드 성공!
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* {setupData.weddingInfo?.thumbnail && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            현재 썸네일: {setupData.weddingInfo.thumbnail}
          </Typography>
        </Box>
      )} */}
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
  const { setupData, actions } = useWeddingDataStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  // 드래그 상태를 추적하는 ref
  const isDraggingRef = React.useRef(false);

  // 스크롤 오프셋을 보정하는 modifier
  const adjustForScrollOffset: Modifier = ({ transform }) => {
    return {
      ...transform,
      y: transform.y + window.scrollY, // 스크롤된 만큼 아래로 이동
    };
  };

  // Step4_Preview와 동일한 방식으로 스토어에서 직접 순서 계산
  const [sortedItems, setSortedItems] = useState<string[]>([]);

  // store의 order 값을 기반으로 순서 설정 (드래그 중이 아닐 때만)
  React.useEffect(() => {
    if (isDraggingRef.current) {
      console.log("🚫 드래그 중이므로 useEffect 스킵");
      return;
    }

    console.log("🔄 useEffect 트리거 - 스토어 order 변경 감지");
    const pages = setupData.weddingInfo?.pages;
    if (pages) {
      const allPages = [
        ["coverDesign", pages.coverDesign],
        ["introMessage", pages.introMessage],
        ["familyInfo", pages.familyInfo],
        ["calendar", pages.calendar],
        ["gallery", pages.gallery],
        ["mapDirections", pages.mapDirections],
        ["accountInfo", pages.accountInfo],
        ["endingMessage", pages.endingMessage],
      ];

      const sortedPageNames = allPages
        .sort(
          ([, a], [, b]) => ((a as any)?.order || 0) - ((b as any)?.order || 0)
        )
        .map(([key]) => key as string);

      console.log("스토어에서 새로운 순서 설정:", {
        currentItems: sortedItems,
        newSortedItems: sortedPageNames,
        orders: {
          coverDesign: pages.coverDesign?.order,
          introMessage: pages.introMessage?.order,
          familyInfo: pages.familyInfo?.order,
          calendar: pages.calendar?.order,
          gallery: pages.gallery?.order,
          mapDirections: pages.mapDirections?.order,
          accountInfo: pages.accountInfo?.order,
          endingMessage: pages.endingMessage?.order,
        },
      });

      setSortedItems(sortedPageNames);
    }
  }, [
    setupData.weddingInfo?.pages?.coverDesign?.order,
    setupData.weddingInfo?.pages?.introMessage?.order,
    setupData.weddingInfo?.pages?.familyInfo?.order,
    setupData.weddingInfo?.pages?.calendar?.order,
    setupData.weddingInfo?.pages?.gallery?.order,
    setupData.weddingInfo?.pages?.mapDirections?.order,
    setupData.weddingInfo?.pages?.accountInfo?.order,
    setupData.weddingInfo?.pages?.endingMessage?.order,
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 중일 때 스크롤 방지를 제거
  useEffect(() => {
    // 드래그 중에도 스크롤 허용
    if (activeId) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeId]);

  function handleDragStart(event: DragStartEvent) {
    console.log("드래그 시작:", {
      activeId: event.active.id,
      currentItems: sortedItems,
    });

    // 네이티브 앱으로 진동 메시지 전송
    if (typeof window !== "undefined") {
      // React Native WebView의 경우
      if ((window as any).ReactNativeWebView?.postMessage) {
        (window as any).ReactNativeWebView.postMessage("vibrate");
      }
      // 일반 WebView의 경우
      else if (window.postMessage) {
        window.postMessage("vibrate", "*");
      }
      // 안드로이드 WebView 인터페이스의 경우 (예시)
      else if ((window as any).Android?.vibrate) {
        (window as any).Android.vibrate();
      }
    }

    isDraggingRef.current = true;
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log("드래그 종료:", {
      activeId: active.id,
      overId: over?.id,
      currentItems: sortedItems,
      willUpdate: active.id !== over?.id && over,
    });

    if (active.id !== over?.id && over) {
      console.log("아이템 순서 변경 시작");

      setSortedItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        console.log("인덱스 정보:", {
          activeId: active.id,
          overId: over.id,
          oldIndex,
          newIndex,
          currentItems: items,
        });

        if (oldIndex === -1 || newIndex === -1) {
          console.log("잘못된 인덱스, 변경 취소");
          return items;
        }

        const newItems = arrayMove(items, oldIndex, newIndex);
        console.log("새로운 순서:", newItems);

        // store의 order 값도 즉시 업데이트
        const updatedPages = { ...setupData.weddingInfo?.pages };

        newItems.forEach((itemId, index) => {
          const pageKey = itemId as keyof typeof updatedPages;
          if (updatedPages[pageKey]) {
            updatedPages[pageKey] = {
              ...updatedPages[pageKey],
              order: index,
            };
          }
        });

        console.log("스토어 업데이트 준비:", updatedPages);

        // 비동기 업데이트로 state 초기화 방지
        setTimeout(() => {
          console.log("스토어 업데이트 실행");
          actions.setSetupData({
            weddingInfo: {
              ...setupData.weddingInfo,
              pages: updatedPages,
            },
          });
        }, 0);

        return newItems;
      });
    } else {
      console.log("순서 변경 없음");
    }

    console.log("드래그 완료, activeId 초기화");

    // 드래그 완료 후 잠시 후에 ref를 false로 설정 (스토어 업데이트 완료 후)
    setTimeout(() => {
      isDraggingRef.current = false;
      console.log("드래그 상태 해제, useEffect 재활성화");
    }, 100);

    setActiveId(null);
  }

  const renderAccordion = (id: string, isDragOverlay = false) => {
    switch (id) {
      case "coverDesign":
        return <CoverDesignAccordion id={id} isDragOverlay={isDragOverlay} />;
      case "introMessage":
        return <IntroMessageAccordion id={id} isDragOverlay={isDragOverlay} />;
      case "familyInfo":
        return <FamilyInfoAccordion id={id} isDragOverlay={isDragOverlay} />;
      case "calendar":
        return <CalendarAccordion id={id} isDragOverlay={isDragOverlay} />;
      case "gallery":
        return <GalleryAccordion id={id} isDragOverlay={isDragOverlay} />;
      case "mapDirections":
        return <MapAccordion id={id} isDragOverlay={isDragOverlay} />;
      case "accountInfo":
        return <AccountInfoAccordion id={id} isDragOverlay={isDragOverlay} />;
      case "endingMessage":
        return <EndingMessageAccordion id={id} isDragOverlay={isDragOverlay} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          템플릿 추가/수정
        </Typography>
        <ThumbnailUploadAccordion id="thumbnail" isDragOverlay={false} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedItems}
            strategy={verticalListSortingStrategy}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sortedItems.map((id) => renderAccordion(id))}
            </Box>
          </SortableContext>
          <DragOverlay
            modifiers={[adjustForScrollOffset]}
            dropAnimation={{
              duration: 150,
              easing: "cubic-bezier(0.2, 0, 0, 1)",
            }}
            style={{
              position: "absolute",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            {activeId ? (
              <Box
                sx={{
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  backgroundColor: "background.paper",
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  opacity: 0.95,
                  pointerEvents: "none",
                  transformOrigin: "left center",
                  maxWidth: "300px",
                  transform: "translate(20px, -100%)",
                  position: "relative",
                }}
              >
                {renderAccordion(activeId, true)}
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>
    </>
  );
};

export default Step3_EditTemplate;

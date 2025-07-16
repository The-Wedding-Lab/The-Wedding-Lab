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
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
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
}

const SelectableAccordion = ({
  title,
  selected,
  onSelect,
  children,
  id,
  isDragOverlay = false,
  isNoDrage = false,
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
      <FormGroup>
        <FormControlLabel
          {...FormControlLabelProps}
          control={
            <Switch
              checked={familyInfo?.accountEnabled}
              onChange={(e) =>
                updateFamilyInfo({ accountEnabled: e.target.checked })
              }
            />
          }
          label="계좌번호 표시"
        />
      </FormGroup>
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
                updateMapDirections({ naviInfo: { text: e.target.value } })
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
                updateMapDirections({ busInfo: { text: e.target.value } })
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
                updateMapDirections({ subwayInfo: { text: e.target.value } })
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
                updateMapDirections({ parkingInfo: { text: e.target.value } })
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
                updateMapDirections({ etcInfo: { text: e.target.value } })
              }
            />
          </SelectableAccordion>
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
    console.log("업로드 시작 추후에 API 연동:", filesData);
    setUploadedImages(filesData);
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
      {uploadedImages.length > 0 && (
        <ImageGallery
          images={uploadedImages.map((fileData) => fileData.file)}
          onImageRemove={(index: number) => {
            const newImages = uploadedImages.filter((_, i) => i !== index);
            setUploadedImages(newImages);
          }}
          mode="grid"
          imageHeight={100}
        />
      )}

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
              label="페이징"
              checked={gallery.displayType === "paging"}
              onCheckedChange={() => updateGallery({ displayType: "paging" })}
              radioMode={true}
            />
            <AppChipCheckBox
              label="스와이프"
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

          <FormGroup>
            <FormControlLabel
              {...FormControlLabelProps}
              control={
                <Switch
                  checked={gallery.zoomOnClick}
                  onChange={(e) =>
                    updateGallery({ zoomOnClick: e.target.checked })
                  }
                />
              }
              label="이미지 클릭 시 크게보기"
            />
          </FormGroup>
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

  //이미지 업로드 상태 관리 - FileData 타입으로 변경
  const [uploadedImages, setUploadedImages] = useState<FileData[]>([]);

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
      {!isDragOverlay && (
        <AppTextField
          sx={{ mt: 2 }}
          fullWidth
          placeholder="텍스트를 입력하세요"
          value={coverDesign?.text || ""}
          onChange={(e) => updateCoverDesign({ text: e.target.value })}
        />
      )}
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
    console.log("업로드 시작 추후에 API 연동:", filesData);
    setUploadedImages(filesData);
  };

  return (
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
      {uploadedImages.length > 0 && (
        <ImageGallery
          images={uploadedImages.map((fileData) => fileData.file)}
          onImageRemove={(index: number) => {
            const newImages = uploadedImages.filter((_, i) => i !== index);
            setUploadedImages(newImages);
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
        placeholder="모시는 글을 입력하세요"
        value={introMessage?.text || ""}
        onChange={(e) => updateIntroMessage({ text: e.target.value })}
      />

      {!isDragOverlay && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <AppChipCheckBox
              label="이미지 위"
              checked={introMessage?.image?.position === "top"}
              onCheckedChange={() =>
                updateIntroMessage({
                  image: { ...introMessage?.image, position: "top" },
                })
              }
              radioMode={true}
            />
            <AppChipCheckBox
              label="이미지 아래"
              checked={introMessage?.image?.position === "bottom"}
              onCheckedChange={() =>
                updateIntroMessage({
                  image: { ...introMessage?.image, position: "bottom" },
                })
              }
              radioMode={true}
            />
          </Box>
        </>
      )}
    </SelectableAccordion>
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

  return (
    <>
      <SelectableAccordion
        id={id}
        title="계좌 정보"
        selected={accountInfo?.enabled}
        onSelect={() => updateAccountInfo({ enabled: !accountInfo?.enabled })}
        isDragOverlay={isDragOverlay}
      >
        <AppTextField
          fullWidth
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
        </AppButton>
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
    console.log("업로드 시작 추후에 API 연동:", filesData);
    setUploadedImages(filesData);
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
      {uploadedImages.length > 0 && (
        <ImageGallery
          images={uploadedImages.map((fileData) => fileData.file)}
          onImageRemove={(index: number) => {
            const newImages = uploadedImages.filter((_, i) => i !== index);
            setUploadedImages(newImages);
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
      {!isDragOverlay && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <AppChipCheckBox
              label="이미지 위"
              checked={endingMessage?.image?.position === "top"}
              onCheckedChange={() =>
                updateEndingMessage({
                  image: { ...endingMessage?.image, position: "top" },
                })
              }
              radioMode={true}
            />
            <AppChipCheckBox
              label="이미지 아래"
              checked={endingMessage?.image?.position === "bottom"}
              onCheckedChange={() =>
                updateEndingMessage({
                  image: { ...endingMessage?.image, position: "bottom" },
                })
              }
              radioMode={true}
            />
          </Box>
        </>
      )}
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
          추가할 템플릿을 선택해주세요.
        </Typography>

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

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
import React, { useState } from "react";
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
  } = useSortable({ id, disabled: isDragOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? "grabbing" : "default",
  };

  return (
    <Box ref={setNodeRef} style={style} sx={{}}>
      <AppAccordion
        sx={{
          width: "100%",
          backgroundColor: isDragOverlay ? "background.paper" : "transparent",
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
                    touchAction: "none",
                  }}
                />
              )}
              <Typography>{title}</Typography>
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

  return (
    <SelectableAccordion
      id={id}
      title="갤러리"
      selected={gallery.enabled}
      onSelect={() => updateGallery({ enabled: !gallery.enabled })}
      isDragOverlay={isDragOverlay}
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

  return (
    <SelectableAccordion
      id={id}
      title="커버 디자인"
      selected={coverDesign?.enabled}
      onSelect={() => updateCoverDesign({ enabled: !coverDesign?.enabled })}
      isDragOverlay={isDragOverlay}
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
        커버 이미지 업로드 영역
      </Box>
      {!isDragOverlay && (
        <AppTextField
          fullWidth
          placeholder="이미지 아래 텍스트를 입력하세요"
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

  return (
    <SelectableAccordion
      id={id}
      title="모시는 글"
      selected={introMessage?.enabled}
      onSelect={() => updateIntroMessage({ enabled: !introMessage?.enabled })}
      isDragOverlay={isDragOverlay}
    >
      <AppTextField
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
          <Box
            sx={{
              background: "#f0f0f0",
              width: "100%",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              cursor: "pointer",
              mt: 2,
            }}
          >
            이미지 업로드 영역
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

  return (
    <SelectableAccordion
      id={id}
      title="마지막 글"
      selected={endingMessage?.enabled}
      onSelect={() => updateEndingMessage({ enabled: !endingMessage?.enabled })}
      isDragOverlay={isDragOverlay}
    >
      <AppTextField
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
          <Box
            sx={{
              background: "#f0f0f0",
              width: "100%",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              cursor: "pointer",
              mt: 2,
            }}
          >
            이미지 업로드 영역
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
  const [items, setItems] = useState([
    "coverDesign",
    "introMessage",
    "familyInfo",
    "calendar",
    "gallery",
    "mapDirections",
    "accountInfo",
    "endingMessage",
  ]); // 아코디언 순서 관리
  const [activeId, setActiveId] = useState<string | null>(null);

  // store의 order 값을 기반으로 초기 순서 설정
  React.useEffect(() => {
    const pages = setupData.weddingInfo?.pages;
    if (pages) {
      const sortedItems = [
        { id: "coverDesign", order: pages.coverDesign?.order || 0 },
        { id: "introMessage", order: pages.introMessage?.order || 1 },
        { id: "familyInfo", order: pages.familyInfo?.order || 2 },
        { id: "calendar", order: pages.calendar?.order || 3 },
        { id: "gallery", order: pages.gallery?.order || 4 },
        { id: "mapDirections", order: pages.mapDirections?.order || 5 },
        { id: "accountInfo", order: pages.accountInfo?.order || 6 },
        { id: "endingMessage", order: pages.endingMessage?.order || 7 },
      ]
        .sort((a, b) => a.order - b.order)
        .map((item) => item.id);

      setItems(sortedItems);
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

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const newItems = setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });

      // store의 order 값도 업데이트
      setItems((newItems) => {
        const updatedPages = { ...setupData.weddingInfo?.pages };

        newItems.forEach((itemId, index) => {
          const pageKey = itemId;
          if (updatedPages[pageKey]) {
            updatedPages[pageKey] = {
              ...updatedPages[pageKey],
              order: index,
            };
          }
        });

        actions.setSetupData({
          weddingInfo: {
            ...setupData.weddingInfo,
            pages: updatedPages,
          },
        });

        return newItems;
      });
    }

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
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {items.map((id) => renderAccordion(id))}
            </Box>
          </SortableContext>
          <DragOverlay>
            {activeId ? renderAccordion(activeId, true) : null}
          </DragOverlay>
        </DndContext>
      </Box>
    </>
  );
};

export default Step3_EditTemplate;

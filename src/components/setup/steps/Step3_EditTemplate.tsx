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
  const [items, setItems] = useState(["family", "map", "gallery"]); // 아코디언 순서 관리
  const [activeId, setActiveId] = useState<string | null>(null);

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
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  const renderAccordion = (id: string, isDragOverlay = false) => {
    switch (id) {
      case "family":
        return <FamilyInfoAccordion id={id} isDragOverlay={isDragOverlay} />;
      case "map":
        return <MapAccordion id={id} isDragOverlay={isDragOverlay} />;
      case "gallery":
        return <GalleryAccordion id={id} isDragOverlay={isDragOverlay} />;
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

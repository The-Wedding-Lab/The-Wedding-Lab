"use client";

import React, { useState, useEffect } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch,
  InputLabel,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import {
  DragHandle,
  ExpandMore,
  FilterVintage,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import AppTextField from "@/components/ui/AppTextField";
import DaumPostcode from "react-daum-postcode";
import AppAccordion from "@/components/ui/AppAccordion";
import AppButton from "@/components/ui/AppButton";
import AppSwipeableDrawer from "@/components/ui/AppSwipeableDrawer";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import { formatPhoneNumber } from "@/hooks/utils";

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

const Step1_WeddingInfo = () => {
  const { setupData, actions } = useWeddingDataStore();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [addrDialogOpen, setAddrDialogOpen] = useState(false);

  // 필수 필드 유효성 검사
  const isStep1Valid = () => {
    const { weddingInfo } = setupData;

    return (
      // 신랑 정보
      weddingInfo?.groom?.name &&
      weddingInfo?.groom?.tel &&
      weddingInfo?.groom?.account &&
      // 신부 정보
      weddingInfo?.bride?.name &&
      weddingInfo?.bride?.tel &&
      weddingInfo?.bride?.account &&
      // 예식 일시
      weddingInfo?.weddingDateTime &&
      // 예식 장소
      weddingInfo?.location?.searchAddress &&
      // 신랑 혼주 정보
      weddingInfo?.groom?.father?.name &&
      weddingInfo?.groom?.father?.tel &&
      weddingInfo?.groom?.father?.account &&
      weddingInfo?.groom?.mother?.name &&
      weddingInfo?.groom?.mother?.tel &&
      weddingInfo?.groom?.mother?.account &&
      // 신부 혼주 정보
      weddingInfo?.bride?.father?.name &&
      weddingInfo?.bride?.father?.tel &&
      weddingInfo?.bride?.father?.account &&
      weddingInfo?.bride?.mother?.name &&
      weddingInfo?.bride?.mother?.tel &&
      weddingInfo?.bride?.mother?.account
    );
  };

  // 유효성 상태를 스토어에 업데이트
  useEffect(() => {
    const isValid = isStep1Valid();
    actions.setSetupData({ step1Valid: !isValid });
  }, [setupData.weddingInfo, actions]);

  // 카카오맵 로드 상태 체크
  useEffect(() => {
    const checkKakaoLoad = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log("카카오맵 로드 완료");
        });
      } else {
        // 카카오맵이 아직 로드되지 않았다면 100ms 후 다시 체크
        setTimeout(checkKakaoLoad, 100);
      }
    };

    checkKakaoLoad();
  }, []);

  const handleDateTimeChange = (newValue: Dayjs | null) => {
    actions.setWeddingDateTime(newValue?.toISOString() || "");
  };

  // 주소를 좌표로 변환하는 함수
  const getCoordinatesFromAddress = async (address: string) => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵이 아직 로드되지 않았습니다.");
      return;
    }

    try {
      const result = await new Promise((resolve, reject) => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            resolve(result);
          } else {
            reject(new Error(`주소 검색 실패: ${status}`));
          }
        });
      });

      console.log("좌표 변환 결과:", result);
      const coords = (result as any)[0];

      return coords;
    } catch (error) {
      console.error("주소 검색 중 오류:", error);
    }
  };

  return (
    <>
      {/* <Box sx={{ mb: 2 }}>
        <AppButton
          onClick={() => console.log("Setup Data:", setupData)}
          variant="outlined"
          size="small"
        >
          Debug: 데이터 출력
        </AppButton>
      </Box> */}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          예식 정보를 입력해주세요.
        </Typography>
        {/* 신랑 정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#333333">신랑 정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField
                labelText="성함"
                fullWidth
                value={setupData.weddingInfo?.groom?.name || ""}
                onChange={(e) => actions.setGroomInfo({ name: e.target.value })}
              />
              <AppTextField
                labelText="연락처"
                fullWidth
                value={formatPhoneNumber(
                  setupData.weddingInfo?.groom?.tel || ""
                )}
                onChange={(e) =>
                  actions.setGroomInfo({
                    tel: formatPhoneNumber(e.target.value),
                  })
                }
                type="tel"
              />
              <AppTextField
                labelText="계좌번호"
                fullWidth
                value={setupData.weddingInfo?.groom?.account || ""}
                onChange={(e) =>
                  actions.setGroomInfo({ account: e.target.value })
                }
              />
            </Box>
          </AccordionDetails>
        </AppAccordion>
        {/* 신부 정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#333333">신부 정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField
                labelText="성함"
                fullWidth
                value={setupData.weddingInfo?.bride?.name || ""}
                onChange={(e) => actions.setBrideInfo({ name: e.target.value })}
              />
              <AppTextField
                labelText="연락처"
                fullWidth
                value={formatPhoneNumber(
                  setupData.weddingInfo?.bride?.tel || ""
                )}
                onChange={(e) =>
                  actions.setBrideInfo({
                    tel: formatPhoneNumber(e.target.value),
                  })
                }
                type="tel"
              />
              <AppTextField
                labelText="계좌번호"
                fullWidth
                value={setupData.weddingInfo?.bride?.account || ""}
                onChange={(e) =>
                  actions.setBrideInfo({ account: e.target.value })
                }
              />
            </Box>
          </AccordionDetails>
        </AppAccordion>
        {/* 예식 일시 DatePicker */}
        <MobileDateTimePicker
          open={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onAccept={handleDateTimeChange}
          value={
            setupData.weddingInfo?.weddingDateTime
              ? dayjs(setupData.weddingInfo.weddingDateTime)
              : null
          }
          onChange={handleDateTimeChange}
          ampm={true}
          enableAccessibleFieldDOMStructure={false}
          views={["year", "month", "day", "hours", "minutes"]}
          dayOfWeekFormatter={(day) => day.format("dd")}
          slotProps={{
            toolbar: {
              hidden: true,
            },
            calendarHeader: {
              format: "YYYY년 M월",
            },
          }}
          slots={{
            textField: (params) => (
              <AppTextField
                {...params}
                placeholder="Click"
                labelText="예식 일시"
                fullWidth
                onClick={() => setIsPickerOpen(true)}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    readOnly: true,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    cursor: "pointer",
                  },
                  "& .MuiInputBase-input": {
                    cursor: "pointer",
                  },
                }}
              />
            ),
          }}
        />
        {/* 예식 장소 daum Map */}
        <AppTextField
          labelText="예식 장소"
          placeholder="Click"
          fullWidth
          value={setupData.weddingInfo?.location?.searchAddress || ""}
          onClick={() => setAddrDialogOpen(true)}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        {/* 신랑혼주정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#333333">신랑혼주정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField
                labelText="아버님 성함"
                fullWidth
                value={setupData.weddingInfo?.groom?.father?.name || ""}
                onChange={(e) =>
                  actions.setGroomInfo({
                    father: {
                      ...setupData.weddingInfo.groom.father,
                      name: e.target.value,
                    },
                  })
                }
              />
              <AppTextField
                labelText="아버님 연락처"
                fullWidth
                value={formatPhoneNumber(
                  setupData.weddingInfo?.groom?.father?.tel || ""
                )}
                onChange={(e) =>
                  actions.setGroomInfo({
                    father: {
                      ...setupData.weddingInfo.groom.father,
                      tel: formatPhoneNumber(e.target.value),
                    },
                  })
                }
                type="tel"
              />
              <AppTextField
                labelText="아버님 계좌번호"
                fullWidth
                value={setupData.weddingInfo?.groom?.father?.account || ""}
                onChange={(e) =>
                  actions.setGroomInfo({
                    father: {
                      ...setupData.weddingInfo.groom.father,
                      account: e.target.value,
                    },
                  })
                }
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          setupData.weddingInfo?.groom?.father?.deceased ||
                          false
                        }
                        onChange={(e) =>
                          actions.setGroomInfo({
                            father: {
                              ...setupData.weddingInfo.groom.father,
                              deceased: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="고인표시"
                  />
                </FormGroup>
                <Select
                  size="small"
                  value={
                    setupData.weddingInfo?.groom?.father?.deceasedIcon || "icon"
                  }
                  onChange={(e) =>
                    actions.setGroomInfo({
                      father: {
                        ...setupData.weddingInfo.groom.father,
                        deceasedIcon: e.target.value,
                      },
                    })
                  }
                  sx={{
                    width: "65px",
                    borderRadius: "12px",
                  }}
                >
                  <MenuItem value="icon">꽃</MenuItem>
                  <MenuItem value="故">故</MenuItem>
                </Select>
              </Box>
              <Divider />
              <AppTextField
                labelText="어머님 성함"
                fullWidth
                value={setupData.weddingInfo?.groom?.mother?.name || ""}
                onChange={(e) =>
                  actions.setGroomInfo({
                    mother: {
                      ...setupData.weddingInfo.groom.mother,
                      name: e.target.value,
                    },
                  })
                }
              />
              <AppTextField
                labelText="어머님 전화번호"
                fullWidth
                value={formatPhoneNumber(
                  setupData.weddingInfo?.groom?.mother?.tel || ""
                )}
                onChange={(e) =>
                  actions.setGroomInfo({
                    mother: {
                      ...setupData.weddingInfo.groom.mother,
                      tel: formatPhoneNumber(e.target.value),
                    },
                  })
                }
                type="tel"
              />
              <AppTextField
                labelText="어머님 계좌번호"
                fullWidth
                value={setupData.weddingInfo?.groom?.mother?.account || ""}
                onChange={(e) =>
                  actions.setGroomInfo({
                    mother: {
                      ...setupData.weddingInfo.groom.mother,
                      account: e.target.value,
                    },
                  })
                }
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          setupData.weddingInfo?.groom?.mother?.deceased ||
                          false
                        }
                        onChange={(e) =>
                          actions.setGroomInfo({
                            mother: {
                              ...setupData.weddingInfo.groom.mother,
                              deceased: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="고인표시"
                  />
                </FormGroup>
                <Select
                  size="small"
                  value={
                    setupData.weddingInfo?.groom?.mother?.deceasedIcon || "icon"
                  }
                  onChange={(e) =>
                    actions.setGroomInfo({
                      mother: {
                        ...setupData.weddingInfo.groom.mother,
                        deceasedIcon: e.target.value,
                      },
                    })
                  }
                  sx={{
                    width: "65px",
                    borderRadius: "12px",
                  }}
                >
                  <MenuItem value="icon">꽃</MenuItem>
                  <MenuItem value="故">故</MenuItem>
                </Select>
              </Box>
            </Box>
          </AccordionDetails>
        </AppAccordion>
        {/* 신부혼주정보 */}
        <AppAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography color="#333333">신부혼주정보</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AppTextField
                labelText="아버님 성함"
                fullWidth
                value={setupData.weddingInfo?.bride?.father?.name || ""}
                onChange={(e) =>
                  actions.setBrideInfo({
                    father: {
                      ...setupData.weddingInfo.bride.father,
                      name: e.target.value,
                    },
                  })
                }
              />
              <AppTextField
                labelText="아버님 연락처"
                fullWidth
                value={formatPhoneNumber(
                  setupData.weddingInfo?.bride?.father?.tel || ""
                )}
                onChange={(e) =>
                  actions.setBrideInfo({
                    father: {
                      ...setupData.weddingInfo.bride.father,
                      tel: formatPhoneNumber(e.target.value),
                    },
                  })
                }
                type="tel"
              />
              <AppTextField
                labelText="아버님 계좌번호"
                fullWidth
                value={setupData.weddingInfo?.bride?.father?.account || ""}
                onChange={(e) =>
                  actions.setBrideInfo({
                    father: {
                      ...setupData.weddingInfo.bride.father,
                      account: e.target.value,
                    },
                  })
                }
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          setupData.weddingInfo?.bride?.father?.deceased ||
                          false
                        }
                        onChange={(e) =>
                          actions.setBrideInfo({
                            father: {
                              ...setupData.weddingInfo.bride.father,
                              deceased: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="고인표시"
                  />
                </FormGroup>
                <Select
                  size="small"
                  value={
                    setupData.weddingInfo?.bride?.father?.deceasedIcon || "icon"
                  }
                  onChange={(e) =>
                    actions.setBrideInfo({
                      father: {
                        ...setupData.weddingInfo.bride.father,
                        deceasedIcon: e.target.value,
                      },
                    })
                  }
                  sx={{
                    width: "65px",
                    borderRadius: "12px",
                  }}
                >
                  <MenuItem value="icon">꽃</MenuItem>
                  <MenuItem value="故">故</MenuItem>
                </Select>
              </Box>
              <Divider />
              <AppTextField
                labelText="어머님 성함"
                fullWidth
                value={setupData.weddingInfo?.bride?.mother?.name || ""}
                onChange={(e) =>
                  actions.setBrideInfo({
                    mother: {
                      ...setupData.weddingInfo.bride.mother,
                      name: e.target.value,
                    },
                  })
                }
              />
              <AppTextField
                labelText="어머님 전화번호"
                fullWidth
                value={formatPhoneNumber(
                  setupData.weddingInfo?.bride?.mother?.tel || ""
                )}
                onChange={(e) =>
                  actions.setBrideInfo({
                    mother: {
                      ...setupData.weddingInfo.bride.mother,
                      tel: formatPhoneNumber(e.target.value),
                    },
                  })
                }
                type="tel"
              />
              <AppTextField
                labelText="어머님 계좌번호"
                fullWidth
                value={setupData.weddingInfo?.bride?.mother?.account || ""}
                onChange={(e) =>
                  actions.setBrideInfo({
                    mother: {
                      ...setupData.weddingInfo.bride.mother,
                      account: e.target.value,
                    },
                  })
                }
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          setupData.weddingInfo?.bride?.mother?.deceased ||
                          false
                        }
                        onChange={(e) =>
                          actions.setBrideInfo({
                            mother: {
                              ...setupData.weddingInfo.bride.mother,
                              deceased: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="고인표시"
                  />
                </FormGroup>
                <Select
                  size="small"
                  value={
                    setupData.weddingInfo?.bride?.mother?.deceasedIcon || "icon"
                  }
                  onChange={(e) =>
                    actions.setBrideInfo({
                      mother: {
                        ...setupData.weddingInfo.bride.mother,
                        deceasedIcon: e.target.value,
                      },
                    })
                  }
                  sx={{
                    width: "65px",
                    borderRadius: "12px",
                  }}
                >
                  <MenuItem value="icon">꽃</MenuItem>
                  <MenuItem value="故">故</MenuItem>
                </Select>
              </Box>
            </Box>
          </AccordionDetails>
        </AppAccordion>
      </Box>

      {/* 주소 검색 SwipeableDrawer */}
      <AppSwipeableDrawer
        anchor="bottom"
        open={addrDialogOpen}
        onOpen={() => setAddrDialogOpen(true)}
        onClose={() => setAddrDialogOpen(false)}
        title="주소 검색"
      >
        <Box sx={{ width: "100%", maxHeight: "90vh", overflow: "auto" }}>
          <Box sx={{ p: 2 }}>
            <DaumPostcode
              style={{ width: "100%", height: "420px" }}
              autoClose={false}
              onComplete={async (addressData) => {
                console.log(addressData);
                setAddrDialogOpen(false);

                // 주소를 좌표로 변환
                const coords = await getCoordinatesFromAddress(
                  addressData.address
                );

                if (coords) {
                  console.log(coords);
                  actions.setWeddingLocation({
                    searchAddress: coords.address_name,
                    lat: coords.y,
                    lng: coords.x,
                  });
                }
              }}
            />
          </Box>
        </Box>
      </AppSwipeableDrawer>
    </>
  );
};

export default Step1_WeddingInfo;

import { create } from "zustand";
import { Dayjs } from "dayjs";

interface SetupData {
  type: "ai" | "template" | "";
  step: number;
  weddingInfo: any;
  [key: string]: any;
}

interface WeddingDataState {
  setupData: SetupData;
  step: number;
  actions: {
    setStep: (step: number) => void;
    setSetupData: (data: Partial<SetupData>) => void;
    setTypeAndStart: (type: "ai" | "template") => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
    // 기본 설정 액션들
    setWeddingType: (type: "ai" | "template") => void;
    setWeddingDomain: (domain: string) => void;
    // 웨딩 정보 관련 세분화된 액션들
    setWeddingDateTime: (dateTime: string) => void;
    setWeddingLocation: (
      location: Partial<SetupData["weddingInfo"]["location"]>
    ) => void;
    // 신랑/신부 정보 관련 액션들
    setGroomInfo: (groom: Partial<SetupData["weddingInfo"]["groom"]>) => void;
    setBrideInfo: (bride: Partial<SetupData["weddingInfo"]["bride"]>) => void;
    // 페이지 설정 관련 액션들
    setPageConfig: (pageKey: string, config: any) => void;
    // 오픈그래프 설정 액션
    setOpenGraphInfo: (og: Partial<SetupData["weddingInfo"]["og"]>) => void;
    // 폰트 설정 액션
    setWeddingFont: (font: string) => void;
  };
}

// 초기 상태값
const initialState: Omit<WeddingDataState, "actions"> = {
  // Setup Step
  step: -1,
  setupData: {
    // 모청 정보
    weddingInfo: {
      domain: "", // 도메인
      type: "", // AI 혹은 템플릿
      weddingDateTime: "", // 예식일시
      location: {
        // 예식 장소
        searchAddress: "", // 주소
        venueName: "", // 장소명
        hall: "", // 홀,층
        lat: 0, // 위도
        lng: 0, // 경도
      },

      // 신랑 데이터 (신랑 + 혼주)
      groom: {
        name: "", // 이름 (성+이름 혹은 이름만 가능)
        tel: "", // 전화번호
        account: "", // 계좌번호
        // 혼주
        father: {
          name: "", // 아버지 이름
          tel: "", // 전화번호
          bank: "", // 은행
          account: "", // 계좌번호
          deceased: false, // 고인 여부
          deceasedIcon: "🌼", // 고인 아이콘 타입
        },
        mother: {
          name: "", // 어머니 이름
          tel: "", // 전화번호
          bank: "", // 은행
          account: "", // 계좌번호
          deceased: false, // 고인 여부
          deceasedIcon: "🌼", // 고인 아이콘 타입
        },
      },

      // 신부 데이터 (신부 + 혼주)
      bride: {
        name: "", // 이름 (성+이름 혹은 이름만 가능)
        tel: "", // 전화번호
        bank: "", // 은행
        account: "", // 계좌번호
        // 혼주
        father: {
          name: "", // 아버지 이름
          tel: "", // 전화번호
          bank: "", // 은행
          account: "", // 계좌번호
          deceased: false, // 고인 여부
          deceasedIcon: "🌼", // 고인 아이콘 타입
        },
        mother: {
          name: "", // 어머니 이름
          tel: "", // 전화번호
          bank: "", // 은행
          account: "", // 계좌번호
          deceased: false, // 고인 여부
          deceasedIcon: "🌼", // 고인 아이콘 타입
        },
      },
      //폰트
      font: "",

      //페이지
      pages: {
        //커버 디자인
        coverDesign: {
          enabled: true, // 기본값 true
          order: 0, // 순서
          image: "", // 이미지
          text: "", // 이미지 아래 텍스트
          backgroundColor: "#ffffff", // 배경색
          backgroundColor2: "#e6e6fa", // 배경색
        },
        // 모시는 글
        introMessage: {
          enabled: true,
          order: 1, // 순서
          title: "", // 제목
          text: "", // 글
          backgroundColor: "#ffffff", // 배경색
          backgroundColor2: "#e6e6fa", // 배경색
          image: {
            // 이미지
            position: "top", // "top" or "bottom"
            url: "",
          },
        },
        // 양가 가족 안내
        familyInfo: {
          enabled: true, // 기본값 true
          order: 2, // 순서
          telEnabled: true, // 전화번호 표시 여부
          accountEnabled: true, // 계좌번호 표시 여부 (미사용)
          backgroundColor: "#ffffff", // 배경색
          backgroundColor2: "#e6e6fa", // 배경색
          fontColor: "#000000", // 텍스트 색상
        },
        // 캘린더
        calendar: {
          enabled: true, // 기본값 true
          order: 3, // 순서
          view: {
            calendar: true, // 캘린더 표시 여부
            countdown: true, // 카운트다운 표시 여부
            dDay: true, // D-Day 표시 여부
          },
        },
        // 갤러리
        gallery: {
          enabled: true, // 기본값 true
          order: 4, // 순서
          images: [], // 이미지 배열
          displayType: "stacked", // 표시 타입 (stacked, scroll, grid)
        },
        // 오시는 길
        mapDirections: {
          enabled: true, // 기본값 true
          order: 5, // 순서
          kakaoMap: true, // 카카오맵 표시 여부
          naverMap: true, // 네이버맵 표시 여부
          tmap: true, // T맵 표시 여부
          googleMap: true, // 구글맵 표시 여부
          backgroundColor: "#ffffff", // 배경색
          backgroundColor2: "#e6e6fa", // 배경색
          naviInfo: {
            enabled: false, // 기본값 false
            text: "", // 글
          },
          busInfo: {
            enabled: false, // 기본값 false
            text: "", // 글
          },
          subwayInfo: {
            enabled: false, // 기본값 false
            text: "", // 글
          },
          parkingInfo: {
            enabled: false, // 기본값 false
            text: "", // 글
          },
          etcInfo: {
            enabled: false, // 기본값 false
            text: "", // 글
          },
        },
        // 계좌 정보
        accountInfo: {
          enabled: false, // 기본값 false
          order: 6, // 순서
          title: "", // 제목
          description: "", // 설명
          kakaopayLink: "", // 카카오페이 링크
          backgroundColor: "#ffffff", // 배경색
          backgroundColor2: "#e6e6fa", // 배경색
        },
        // 마지막 글
        endingMessage: {
          enabled: false, // 기본값 false
          order: 7, // 순서
          text: "", // 글
          image: {
            // 이미지
            position: "top", // "top" or "bottom"
            url: "",
          },
        },
      },

      // openGraph 영역 (카카오톡 공유 )
      og: {
        title: "",
        description: "",
        image: "", // 800x400 이상, 5MB 이내
        imageWidth: 800,
        imageHeight: 400,
        url: "",
        siteName: "",
        locale: "ko-KR",
      },
    },
  } as SetupData,
};

export const useWeddingDataStore = create<WeddingDataState>((set, get) => ({
  ...initialState,
  actions: {
    // 단계 설정
    setStep: (step) => set({ step }),

    // 데이터 부분 설정
    setSetupData: (data) =>
      set((state) => ({
        setupData: { ...state.setupData, ...data },
      })),

    // 청첩장 타입 선택 및 설정 시작
    setTypeAndStart: (type) =>
      set((state) => ({
        setupData: { ...state.setupData, type },
        step: 0,
      })),

    // 다음 단계로 이동
    nextStep: () =>
      set((state) => {
        const { step, setupData } = state;
        const totalSteps = setupData.type === "ai" ? 5 : 4;

        if (step >= totalSteps - 1) {
          return { step };
        }

        return { step: step + 1 };
      }),

    // 이전 단계로 이동
    prevStep: () => {
      const { step } = get();

      if (step === 0) {
        get().actions.reset(); // 1단계(index 0)에서 이전으로 가면 초기화
      } else if (step > 0) {
        set({ step: step - 1 });
      }
    },

    // 전체 상태 초기화
    reset: () => set({ ...initialState }),

    // 기본 설정 액션들
    setWeddingType: (type) =>
      set((state) => ({
        setupData: {
          ...state.setupData,
          weddingInfo: {
            ...state.setupData.weddingInfo,
            type,
          },
        },
      })),
    setWeddingDomain: (domain) =>
      set((state) => ({
        setupData: {
          ...state.setupData,
          weddingInfo: {
            ...state.setupData.weddingInfo,
            domain,
          },
        },
      })),
    // 웨딩 정보 관련 세분화된 액션들
    setWeddingDateTime: (dateTime) =>
      set((state) => ({
        setupData: {
          ...state.setupData,
          weddingInfo: {
            ...state.setupData.weddingInfo,
            weddingDateTime: dateTime,
          },
        },
      })),
    setWeddingLocation: (location) =>
      set((state) => ({
        setupData: {
          ...state.setupData,
          weddingInfo: {
            ...state.setupData.weddingInfo,
            location: {
              ...state.setupData.weddingInfo.location,
              ...location,
            },
          },
        },
      })),
    // 신랑/신부 정보 관련 액션들
    setGroomInfo: (groom) =>
      set((state) => ({
        setupData: {
          ...state.setupData,
          weddingInfo: {
            ...state.setupData.weddingInfo,
            groom: {
              ...state.setupData.weddingInfo.groom,
              ...groom,
            },
          },
        },
      })),
    setBrideInfo: (bride) =>
      set((state) => ({
        setupData: {
          ...state.setupData,
          weddingInfo: {
            ...state.setupData.weddingInfo,
            bride: {
              ...state.setupData.weddingInfo.bride,
              ...bride,
            },
          },
        },
      })),
    // 페이지 설정 관련 액션들
    setPageConfig: (pageKey, config) =>
      set((state) => ({
        setupData: {
          ...state.setupData,
          pages: {
            ...state.setupData.pages,
            [pageKey]: {
              ...state.setupData.pages[pageKey],
              ...config,
            },
          },
        },
      })),
    // 오픈그래프 설정 액션
    setOpenGraphInfo: (og) =>
      set((state) => ({
        setupData: {
          ...state.setupData,
          weddingInfo: {
            ...state.setupData.weddingInfo,
            og: {
              ...state.setupData.weddingInfo.og,
              ...og,
            },
          },
        },
      })),
    // 폰트 설정 액션
    setWeddingFont: (font) =>
      set((state) => ({
        setupData: {
          ...state.setupData,
          weddingInfo: {
            ...state.setupData.weddingInfo,
            font,
          },
        },
      })),
  },
}));

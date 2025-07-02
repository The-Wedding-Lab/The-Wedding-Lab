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
      date: "", // 예식일
      time: "", // 예식 시간
      location: {
        // 예식 장소
        searchAddress: "", // 주소
        venueName: "", // 장소명
        hall: "", // 홀
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
          account: "", // 계좌번호
          deceased: false, // 고인 여부
          deceasedIcon: "", // 고인 아이콘 타입
        },
        mother: {
          name: "", // 어머니 이름
          tel: "", // 전화번호
          account: "", // 계좌번호
          deceased: false, // 고인 여부
          deceasedIcon: "", // 고인 아이콘 타입
        },
      },

      // 신부 데이터 (신부 + 혼주)
      bride: {
        name: "", // 이름 (성+이름 혹은 이름만 가능)
        tel: "", // 전화번호
        account: "", // 계좌번호
        // 혼주
        father: {
          name: "", // 아버지 이름
          tel: "", // 전화번호
          account: "", // 계좌번호
          deceased: false, // 고인 여부
          deceasedIcon: "", // 고인 아이콘 타입
        },
        mother: {
          name: "", // 어머니 이름
          tel: "", // 전화번호
          account: "", // 계좌번호
          deceased: false, // 고인 여부
          deceasedIcon: "", // 고인 아이콘 타입
        },
      },

      //커버 디자인
      coverDesign: {
        enabled: true, // 기본값 true
        image: "", // 이미지
        text: "", // 이미지 아래 텍스트
      },
      //폰트
      font: "",

      // 모시는 글
      introMessage: {
        enabled: true,
        text: "", // 글
        image: {
          // 이미지
          position: "top", // "top" or "bottom"
          url: "",
        },
      },

      familyInfo: {
        enabled: true, // 기본값 true
        telEnabled: true, // 전화번호 표시 여부
        accountEnabled: true, // 계좌번호 표시 여부
      },
      calendar: {
        enabled: true, // 기본값 true
        view: {
          calendar: true, // 캘린더 표시 여부
          countdown: true, // 카운트다운 표시 여부
          dDay: true, // D-Day 표시 여부
        },
      },
      gallery: {
        enabled: true, // 기본값 true
        images: [], // 이미지 배열
        displayType: "swipe", // 표시 타입 (swipe, paging, grid)
        zoomOnClick: true, // 클릭 시 확대 여부
      },
      mapDirections: {
        enabled: true, // 기본값 true
        kakaoMap: true, // 카카오맵 표시 여부
        naverMap: true, // 네이버맵 표시 여부
        tmap: true, // T맵 표시 여부
        googleMap: true, // 구글맵 표시 여부
      },
      accountInfo: {
        enabled: false, // 기본값 false
        kakaopayLink: "", // 카카오페이 링크
      },
      endingMessage: {
        enabled: false, // 기본값 false
        text: "", // 글
        image: {
          // 이미지
          position: "top", // "top" or "bottom"
          url: "",
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
  },
}));

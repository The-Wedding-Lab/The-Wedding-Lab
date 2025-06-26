import { create } from "zustand";

// 스토어에서 관리할 상태의 타입 정의
interface WeddingInfo {
  groomName?: string;
  brideName?: string;
  weddingDateTime?: string | null; // 예식 일시
  location?: string; // 예식 장소
}

interface SetupData {
  type: "ai" | "template" | "";
  weddingInfo: WeddingInfo;
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
const initialState = {
  setupData: {
    type: "" as const,
    weddingInfo: {
      groomName: "",
      brideName: "",
      weddingDateTime: null,
      location: "",
    },
  },
  step: -1,
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
      const { step, setupData } = get();

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

import { create } from "zustand";

export interface AppState {
  initialized: boolean;
  isDM: boolean;
  setInitialized: (isInitialized: boolean) => void;
  setIsDM: (isDM: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  initialized: false,
  isDM: false,
  setInitialized: (isInitialized) => set({ initialized: isInitialized }),
  setIsDM: (isDM) => set({ isDM }),
}));

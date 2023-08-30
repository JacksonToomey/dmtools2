import type { Image } from "@owlbear-rodeo/sdk";
import { create } from "zustand";

export type Token = Image;

export type TokenMeta = {
  inInitiative?: boolean;
};
export interface AppState {
  initialized: boolean;
  isDM: boolean;
  tokens: Token[];
  setInitialized: (isInitialized: boolean) => void;
  setIsDM: (isDM: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  initialized: false,
  isDM: false,
  tokens: [],
  setInitialized: (isInitialized) => set({ initialized: isInitialized }),
  setIsDM: (isDM) => set({ isDM }),
}));

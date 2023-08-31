import type { Image } from "@owlbear-rodeo/sdk";
import { create } from "zustand";

export type Token = Image;

export type TokenMeta = {
  inInitiative?: boolean;
  groupNumber?: number;
  hp?: number;
  ac?: number;
  initiativeCount?: number;
  damage?: number[];
  player?: boolean;
};

export type SceneMeta = {
  inCombat?: boolean;
  currentInitiativeToken?: string;
  rounds?: number;
};

export interface AppState {
  initialized: boolean;
  isDM: boolean;
  tokens: Token[];
  scene: SceneMeta;
  setInitialized: (isInitialized: boolean) => void;
  setIsDM: (isDM: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  initialized: false,
  isDM: false,
  tokens: [],
  scene: {},
  setInitialized: (isInitialized) => set({ initialized: isInitialized }),
  setIsDM: (isDM) => set({ isDM }),
}));

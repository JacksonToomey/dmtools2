import OBR from "@owlbear-rodeo/sdk";
import { type ReactNode } from "react";
import { OwlbearContextProvider } from "../hooks/owlbear";
import { useStore } from "../store";

export default function OwlBearProvider({ children }: { children: ReactNode }) {
  const initialized = useStore((state) => state.initialized);
  if (!initialized) return null;
  return (
    <OwlbearContextProvider value={OBR}>{children}</OwlbearContextProvider>
  );
}

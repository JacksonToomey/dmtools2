import OBR from "@owlbear-rodeo/sdk";
import { createContext, useContext } from "react";
import { useStore } from "../store";

type OBRClient = typeof OBR;
const OwlbearContext = createContext<OBRClient>(OBR);

export const useOwlbear = () => {
  const owlbear = useContext(OwlbearContext);
  return owlbear;
};

export const OwlbearContextProvider = OwlbearContext.Provider;

OBR.onReady(async () => {
  const role = await OBR.player.getRole();
  useStore.getState().setIsDM(role === "GM");
  OBR.scene.onReadyChange((sceneReady) => {
    useStore.getState().setInitialized(sceneReady);
  });
  const isSceneReady = await OBR.scene.isReady();
  if (isSceneReady) useStore.getState().setInitialized(true);
});

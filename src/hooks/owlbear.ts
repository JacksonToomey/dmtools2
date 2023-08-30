import OBR, { Item, isImage } from "@owlbear-rodeo/sdk";
import { createContext, useContext } from "react";
import { Token, TokenMeta, useStore } from "../store";

export const OWLBEAR_ID = "com.jtoid.dmtools2";
export const INITIATIVE_METADATA_KEY = `${OWLBEAR_ID}/initiative-meta`;

type OBRClient = typeof OBR;
const OwlbearContext = createContext<OBRClient>(OBR);

export const useOwlbear = () => {
  const owlbear = useContext(OwlbearContext);
  return owlbear;
};

export const getDefaultMeta: () => TokenMeta = () => ({});

export const getInitiativeMetadata: (item: Item) => TokenMeta = (
  item: Item
) => {
  return item.metadata[INITIATIVE_METADATA_KEY] || getDefaultMeta();
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

useStore.subscribe((state, prev) => {
  if (state.initialized && !prev.initialized) {
    setUpTokenSync();
    setupAddToInitiative();
  }
});

const syncTokens = (items: Item[]) => {
  const tokens = items.filter(
    (item) =>
      item.layer === "CHARACTER" &&
      isImage(item) &&
      getInitiativeMetadata(item).inInitiative
  ) as Token[];
  useStore.setState({ tokens });
};

const setUpTokenSync = async () => {
  const items = await OBR.scene.items.getItems();
  syncTokens(items);
  OBR.scene.items.onChange(syncTokens);
};

const setupAddToInitiative = () => {
  OBR.contextMenu.create({
    id: `${OWLBEAR_ID}/add-context-menu`,
    icons: [
      {
        icon: "/add.svg",
        label: "Add to Initiative",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", INITIATIVE_METADATA_KEY, "inInitiative"],
              value: true,
              operator: "!=",
            },
          ],
        },
      },
    ],
    onClick: () => {
      console.log("click");
    },
  });
};

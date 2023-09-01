import OBR, { Image, Item, Metadata, isImage } from "@owlbear-rodeo/sdk";
import { createContext, useContext } from "react";
import { AppState, SceneMeta, Token, TokenMeta, useStore } from "../store";

export const OWLBEAR_ID = "com.jtoid.dmtools2";
export const INITIATIVE_METADATA_KEY = `${OWLBEAR_ID}/initiative-meta`;
export const SCENE_METADATA_KEY = `${OWLBEAR_ID}/scene-metadata`;

type OBRClient = typeof OBR;
const OwlbearContext = createContext<OBRClient>(OBR);

export const useOwlbear = () => {
  const owlbear = useContext(OwlbearContext);
  return owlbear;
};

export const getDefaultMeta: () => TokenMeta = () => ({
  inInitiative: false,
  groupNumber: 0,
  damage: [],
});

export const getInitiativeMetadata: (item: Item) => TokenMeta | undefined = (
  item: Item
) => {
  return (item.metadata[INITIATIVE_METADATA_KEY] as TokenMeta) || undefined;
};

export const getSceneMetadata = (metadata: Metadata) => {
  return (metadata[SCENE_METADATA_KEY] as SceneMeta) || undefined;
};

export const OwlbearContextProvider = OwlbearContext.Provider;

export const filterTokens = (items: Item[]) =>
  items.filter((item) => item.layer === "CHARACTER" && isImage(item));

OBR.onReady(async () => {
  const role = await OBR.player.getRole();
  useStore.getState().setIsDM(role === "GM");
  OBR.scene.onReadyChange((sceneReady) => {
    OBR.scene.onMetadataChange((metadata) => {
      syncScene(metadata);
    });
    useStore.getState().setInitialized(sceneReady);
  });
  const isSceneReady = await OBR.scene.isReady();
  if (isSceneReady) {
    OBR.scene.onMetadataChange((metadata) => {
      syncScene(metadata);
    });
    useStore.getState().setInitialized(true);
  }
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
      getInitiativeMetadata(item)?.inInitiative
  ) as Token[];
  useStore.setState({ tokens });
};

const syncScene = (metadata: Metadata) => {
  const sceneMeta = getSceneMetadata(metadata) || {};
  useStore.setState({ scene: sceneMeta });
};

const setUpTokenSync = async () => {
  const items = await OBR.scene.items.getItems();
  syncTokens(items);
  OBR.scene.items.onChange(syncTokens);
};

const getTokenGroups = (state: AppState) =>
  state.tokens.reduce((acc, token) => {
    if (acc[token.name]) {
      return {
        ...acc,
        [token.name]: acc[token.name] + 1,
      };
    }
    return {
      ...acc,
      [token.name]: 1,
    };
  }, {} as Record<string, number>);

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
      {
        icon: "/remove.svg",
        label: "Remove from initiative",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", INITIATIVE_METADATA_KEY, "inInitiative"],
              value: true,
            },
          ],
        },
      },
    ],
    onClick: ({ items }) => {
      const selectedTokens = filterTokens(items) as Token[];
      const tokenGroups = getTokenGroups(useStore.getState());
      for (const token of selectedTokens) {
        const inInitiative =
          getInitiativeMetadata(token)?.inInitiative || false;
        const newInitiative = !inInitiative;
        let newGroupNumber = 0;
        if (newInitiative) {
          const maxGroupNumber = tokenGroups[token.name] || 0;
          if (maxGroupNumber > 0) {
            newGroupNumber = maxGroupNumber + 1;
          } else {
            newGroupNumber = 1;
          }
          tokenGroups[token.name] = newGroupNumber;
        }
        OBR.scene.items.updateItems([token.id], (items) => {
          if (items.length === 0) return;
          if (!getInitiativeMetadata(items[0])) {
            items[0].metadata[INITIATIVE_METADATA_KEY] = getDefaultMeta();
          }
          const metadata = getInitiativeMetadata(items[0]) as TokenMeta;
          metadata.inInitiative = newInitiative;
          if (newInitiative) {
            metadata.groupNumber = newGroupNumber;
            if (newGroupNumber === 1) {
              (items[0] as Image).text.plainText = items[0].name;
            } else {
              (
                items[0] as Image
              ).text.plainText = `${items[0].name} ${newGroupNumber}`;
            }
          }
        });
      }
    },
  });
};

export const useTokenIds = () => {
  const tokenIds = useStore((state) =>
    getOrderedTokens(state.tokens).map((token) => token.id)
  );
  return tokenIds;
};

const getOrderedTokens = (tokens: Token[]) =>
  tokens.sort((ta, tb) => {
    const aMeta = getInitiativeMetadata(ta) || ({} as TokenMeta);
    const bMeta = getInitiativeMetadata(tb) || ({} as TokenMeta);
    if (!aMeta && !bMeta) return 0;
    if (!aMeta) return 1;
    if (!bMeta) return -1;
    return (bMeta.initiativeCount || 0) - (aMeta.initiativeCount || 0);
  });

export const setInitiativeMetaData = (
  item: Token,
  changes: Partial<TokenMeta>
) => {
  const tokenMeta = getInitiativeMetadata(item);
  item.metadata = {
    ...item.metadata,
    [INITIATIVE_METADATA_KEY]: {
      ...tokenMeta,
      ...changes,
    },
  };
};

export const useToken: (
  tokenId: string
) => [Token, (update: Partial<TokenMeta>) => void, (name: string) => void] = (
  tokenId: string
) => {
  const token = useStore((state) =>
    state.tokens.find((token) => token.id === tokenId)
  );
  const setToken = (update: Partial<TokenMeta>) => {
    OBR.scene.items.updateItems([tokenId], (items) => {
      if (items.length < 1) return;
      const item = items[0];
      setInitiativeMetaData(item, update);
    });
  };
  const setTokenName = (name: string) => {
    OBR.scene.items.updateItems([tokenId], (items) => {
      if (items.length < 1) return;
      const item = items[0];
      const image = item as Image;
      image.text.plainText = name;
    });
  };
  return [token as Token, setToken, setTokenName];
};

export const useScene: () => [
  SceneMeta,
  (update: Partial<SceneMeta>) => void
] = () => {
  const scene = useStore((state) => state.scene);
  const updateScene = async (update: Partial<SceneMeta>) => {
    const currentScene = await OBR.scene.getMetadata();
    const scene = getSceneMetadata(currentScene);
    OBR.scene.setMetadata({
      [SCENE_METADATA_KEY]: {
        ...scene,
        ...update,
      },
    });
  };
  return [scene, updateScene];
};

export const resetInitiative = (ids: string[]) => {
  OBR.scene.items.updateItems(ids, (items) => {
    for (const item of items) {
      setInitiativeMetaData(item, { initiativeCount: 0 });
    }
  });
};

export const useCurrentInitiative = (tokenId: string) => {
  const [scene] = useScene();
  const isCurrent =
    scene.currentInitiativeToken === tokenId && (scene.inCombat as boolean);
  return isCurrent;
};

export const setNextToken = async () => {
  const metadata = await OBR.scene.getMetadata();
  const scene = getSceneMetadata(metadata);
  const tokens = getOrderedTokens(useStore.getState().tokens);
  const currentId = scene.currentInitiativeToken;
  let currentLocation = tokens.findIndex((v) => v.id === currentId);
  if (currentLocation === null || currentLocation === undefined) {
    currentLocation = -1;
  }
  let rounds = scene.rounds;
  if (rounds === null || rounds === undefined) {
    rounds = 1;
  }
  if (currentLocation === tokens.length - 1) {
    rounds = rounds + 1;
  }
  const newLocation = (currentLocation + 1) % tokens.length;
  const newId = tokens[newLocation].id;
  OBR.scene.setMetadata({
    [SCENE_METADATA_KEY]: {
      ...scene,
      currentInitiativeToken: newId,
      rounds,
    },
  });
};

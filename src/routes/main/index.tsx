import { useStore } from "../../store";
import GMView from "./GMView";
import PlayerView from "./PlayerView";

export default function Main() {
  const isDM = useStore((state) => state.isDM);
  if (isDM) return <GMView />;
  return <PlayerView />;
}

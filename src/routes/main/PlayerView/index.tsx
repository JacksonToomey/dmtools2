import { useScene, useTokenIds } from "../../../hooks/owlbear";
import PlayerTokenRow from "./PlayerTokenRow";

export default function PlayerView() {
  const [scene] = useScene();
  const tokenIds = useTokenIds();
  if (!scene.inCombat) return <div>Not in combat</div>;
  return (
    <div>
      <table className="table table-fixed w-full">
        <thead>
          <tr>
            <th>Order</th>
            <th>Token</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tokenIds.map((tokenId) => (
            <PlayerTokenRow tokenId={tokenId} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

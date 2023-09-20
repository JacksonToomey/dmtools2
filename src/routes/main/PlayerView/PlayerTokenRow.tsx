import {
  getInitiativeMetadata,
  useScene,
  useToken,
} from "../../../hooks/owlbear";
import TokenName from "./TokenName";
import TokenStatus from "./TokenStatus";

export default function PlayerTokenRow({ tokenId }: { tokenId: string }) {
  const [token] = useToken(tokenId);
  const [scene] = useScene();
  const metadata = getInitiativeMetadata(token);
  return (
    <tr
      className={
        scene.inCombat && scene.currentInitiativeToken === tokenId
          ? "bg-primary"
          : ""
      }
    >
      <td>{metadata?.initiativeCount || 0}</td>
      <td className="whitespace-normal">
        <TokenName token={token} />
      </td>
      <td>
        <TokenStatus token={token} />
      </td>
    </tr>
  );
}

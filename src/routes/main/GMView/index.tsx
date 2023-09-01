import { useTokenIds } from "../../../hooks/owlbear";
import Controls from "./Controls";
import InitiativeCard from "./initiativeCard";

export default function GMView() {
  const tokenIds = useTokenIds();
  return (
    <div>
      <Controls />
      {tokenIds.map((id) => (
        <InitiativeCard key={id} tokenId={id} />
      ))}
    </div>
  );
}

import { useTokenIds } from "../../../hooks/owlbear";
import InitiativeCard from "./initiativeCard";

export default function GMView() {
  const tokenIds = useTokenIds();
  return (
    <div>
      {tokenIds.map((id) => (
        <InitiativeCard key={id} tokenId={id} />
      ))}
    </div>
  );
}

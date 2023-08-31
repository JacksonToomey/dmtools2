import { ChangeEvent } from "react";
import { getInitiativeMetadata, useToken } from "../../../../hooks/owlbear";

export default function InitiativeCount({ tokenId }: { tokenId: string }) {
  const [token, setToken] = useToken(tokenId);

  const metadata = getInitiativeMetadata(token) || {};
  const handleInitiativeChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value;
    const newInitiative = parseFloat(newValue);
    if (isNaN(newInitiative)) {
      setToken({ initiativeCount: 0 });
      return;
    }
    setToken({
      initiativeCount: newInitiative,
    });
  };
  return (
    <input
      value={metadata.initiativeCount || 0}
      onChange={handleInitiativeChange}
      type="number"
      className="input input-primary input-xs w-16"
    />
  );
}

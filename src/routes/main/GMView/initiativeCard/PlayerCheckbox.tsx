import { ChangeEvent } from "react";
import { getInitiativeMetadata, useToken } from "../../../../hooks/owlbear";

export default function PlayerCheckbox({ tokenId }: { tokenId: string }) {
  const [token, setToken] = useToken(tokenId);
  const metadata = getInitiativeMetadata(token);
  const handleCheck = (evt: ChangeEvent<HTMLInputElement>) => {
    setToken({ player: evt.target.checked });
  };
  return (
    <input
      checked={metadata?.player}
      className="checkbox checkbox-primary"
      type="checkbox"
      onChange={handleCheck}
    />
  );
}

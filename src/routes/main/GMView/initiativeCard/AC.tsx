import { ChangeEvent } from "react";
import { getInitiativeMetadata, useToken } from "../../../../hooks/owlbear";

export default function AC({ tokenId }: { tokenId: string }) {
  const [token, setToken] = useToken(tokenId);
  const metadata = getInitiativeMetadata(token);
  const handleACChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setToken({ ac: parseInt(evt.target.value, 10) });
  };
  return (
    <input
      className="input input-primary input-xs w-full"
      value={metadata?.ac || ""}
      placeholder="AC"
      onChange={handleACChange}
    />
  );
}

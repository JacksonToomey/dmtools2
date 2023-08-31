import { ChangeEvent, useState } from "react";
import { getInitiativeMetadata, useToken } from "../../../../hooks/owlbear";

export default function Damage({ tokenId }: { tokenId: string }) {
  const [token, setToken] = useToken(tokenId);
  const [input, setInput] = useState(0);
  const metadata = getInitiativeMetadata(token);
  const handleInput = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(evt.target.value, 10);
    if (isNaN(value)) {
      setInput(0);
      return;
    }
    setInput(value);
  };
  const handleAdd = () => {
    const damageList = metadata?.damage || [];
    setToken({
      damage: [...damageList, input],
    });
    setInput(0);
  };
  return (
    <>
      <input
        value={input}
        onChange={handleInput}
        className="input input-primary input-xs w-12 mr-2"
      />
      <button onClick={handleAdd} className="btn btn-primary btn-xs">
        Add
      </button>
    </>
  );
}

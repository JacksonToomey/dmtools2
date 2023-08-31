import { ChangeEvent, useState } from "react";
import { getInitiativeMetadata, useToken } from "../../../../hooks/owlbear";

export default function TokenName({ tokenId }: { tokenId: string }) {
  const [token, , setTokenName] = useToken(tokenId);
  const metadata = getInitiativeMetadata(token) || {};
  const [editMode, setEditMode] = useState(false);
  const handleEditClick = () => {
    setEditMode(!editMode);
  };
  const handleNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTokenName(evt.target.value);
  };
  if (metadata.player)
    return <span className="text-md">{token.text.plainText}</span>;
  return (
    <>
      {!editMode && <span className="text-md">{token.text.plainText}</span>}
      {editMode && (
        <input
          value={token.text.plainText}
          onChange={handleNameChange}
          className="input input-sm"
        />
      )}
      <button onClick={handleEditClick} className="btn btn-xs btn-info">
        {editMode && "Done"}
        {!editMode && "Edit"}
      </button>
    </>
  );
}

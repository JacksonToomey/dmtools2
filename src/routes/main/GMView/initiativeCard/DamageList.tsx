import { useState } from "react";
import { getInitiativeMetadata, useToken } from "../../../../hooks/owlbear";

export default function DamageList({ tokenId }: { tokenId: string }) {
  const [show, setShow] = useState(false);
  const [token, setToken] = useToken(tokenId);
  const handleShowClick = () => {
    setShow(!show);
  };
  const metadata = getInitiativeMetadata(token);
  const damage = metadata?.damage || [];
  const handleRemove = (index: number) => {
    const newDamageLeft = damage.slice(0, index);
    const newDamageRight = damage.slice(index + 1);
    setToken({ damage: [...newDamageLeft, ...newDamageRight] });
  };
  return (
    <>
      <button onClick={handleShowClick} className="btn btn-secondary btn-xs">
        {show ? "Hide" : "Show"} Damage
      </button>
      {show && (
        <table>
          <thead>
            <tr>
              <th>Damage</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {damage.map((damage, index) => (
              <tr key={`${index}`}>
                <td>{damage}</td>
                <td>
                  <button
                    className="btn btn-error btn-sm w-full"
                    onClick={() => handleRemove(index)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

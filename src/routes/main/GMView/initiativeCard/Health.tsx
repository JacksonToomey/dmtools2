import { ChangeEvent, useMemo } from "react";
import { getInitiativeMetadata, useToken } from "../../../../hooks/owlbear";

export default function Health({ tokenId }: { tokenId: string }) {
  const [token, setToken] = useToken(tokenId);
  const metadata = getInitiativeMetadata(token);
  const currentHp = useMemo(() => {
    const damageList = metadata?.damage || [];
    const totalDamage = damageList.reduce((acc, val) => acc + val, 0);
    return (metadata?.hp || 0) - totalDamage;
  }, [metadata?.damage, metadata?.hp]);

  const percent = useMemo(() => {
    if (!metadata?.hp || metadata.hp === 0) return 0.0;

    return ((metadata.hp - currentHp) / metadata.hp) * 100;
  }, [currentHp, metadata?.hp]);
  const handleHPChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setToken({ hp: parseInt(evt.target.value, 10) });
  };
  return (
    <>
      <div className="mr-2">
        {currentHp} /{" "}
        <input
          onChange={handleHPChange}
          value={metadata?.hp || 0}
          className="input input-primary input-xs w-12"
        />
      </div>
      <div>{percent.toFixed(2)}%</div>
    </>
  );
}

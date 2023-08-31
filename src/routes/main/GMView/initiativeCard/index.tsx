import classNames from "classnames";
import { getInitiativeMetadata, useToken } from "../../../../hooks/owlbear";
import AC from "./AC";
import Damage from "./Damage";
import DamageList from "./DamageList";
import Health from "./Health";
import InitiativeCount from "./InitiativeCount";
import PlayerCheckbox from "./PlayerCheckbox";
import TokenName from "./TokenName";

export default function InitiativeCard({ tokenId }: { tokenId: string }) {
  const [token] = useToken(tokenId);
  const metadata = getInitiativeMetadata(token) || {};
  return (
    <div
      className={classNames("card", "mb-2", {
        "bg-primary": false,
        "bg-base-200": true,
      })}
    >
      <div className="card-body p-2">
        <div className="card-title justify-between">
          <InitiativeCount tokenId={tokenId} />
          <TokenName tokenId={tokenId} />
          <PlayerCheckbox tokenId={tokenId} />
        </div>
        {!metadata.player && (
          <>
            <DamageList tokenId={tokenId} />
            <div className="flex flex-row justify-between items-center flex-wrap">
              <div className="w-full flex flex-row justify-between items-center">
                <div className="w-12">
                  <AC tokenId={tokenId} />
                </div>
                <div className="flex flex-row">
                  <Health tokenId={tokenId} />
                </div>
                <div>
                  <Damage tokenId={tokenId} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

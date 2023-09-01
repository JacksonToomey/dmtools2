import classNames from "classnames";
import { useMemo } from "react";
import { getInitiativeMetadata } from "../../../hooks/owlbear";
import { Token } from "../../../store";

type Status =
  | "Unharmed"
  | "Bruised"
  | "Bloodied"
  | "Battered"
  | "Near Death"
  | "Dead";

export default function TokenStatus({ token }: { token: Token }) {
  const metadata = getInitiativeMetadata(token);
  const status: Status = useMemo(() => {
    const damage = metadata?.damage || [];
    const hp = metadata?.hp || 0;
    if (damage.length < 1) return "Unharmed";
    if (hp <= 0) return "Unharmed";

    const totalDamage = damage.reduce((acc, val) => acc + val, 0);

    if (totalDamage >= hp) return "Dead";

    const remaining = 1 - totalDamage / hp;
    if (remaining > 0.5) return "Bruised";

    if (remaining > 0.25) return "Bloodied";

    if (remaining > 0.1) return "Battered";

    return "Near Death";
  }, [metadata]);
  if (metadata?.player) return null;
  return (
    <div
      className={classNames("font-bold", {
        "text-amber-400": status === "Bruised",
        "text-green-700": status === "Unharmed",
        "text-red-200": status === "Bloodied",
        "text-red-600": status === "Battered",
        "text-red-800": status === "Near Death",
        "text-black": status === "Dead",
      })}
    >
      {status}
    </div>
  );
}

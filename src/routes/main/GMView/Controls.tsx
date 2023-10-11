import { formatDuration, intervalToDuration } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  resetInitiative,
  setNextToken,
  useScene,
  useTokenIds,
} from "../../../hooks/owlbear";

export default function Controls() {
  const [scene, setScene] = useScene();
  const start = useRef(new Date());
  const ids = useTokenIds();
  const [currentDate, setCurrentDate] = useState(new Date());
  const handleCombatToggle = () => {
    const inCombat = !scene?.inCombat;
    setScene({ inCombat, rounds: 1, currentInitiativeToken: ids[0] });
    if (!inCombat) {
      resetInitiative(ids);
      setCurrentDate(new Date());
    }
    start.current = new Date();
  };

  const handleNext = () => {
    setNextToken();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [setCurrentDate]);

  return (
    <div className="flex flex-row items-center justify-around mb-2 sticky top-0 z-50 bg-base-100 p-2">
      <button
        disabled={ids.length < 1 && !scene.inCombat}
        onClick={handleCombatToggle}
        className="btn btn-primary btn-sm"
      >
        {scene.inCombat && "End"}
        {!scene.inCombat && "Start"}
      </button>
      {scene.inCombat && <span>Round {scene.rounds}</span>}
      {scene.inCombat && (
        <span>
          {formatDuration(
            intervalToDuration({
              start: start.current,
              end: currentDate,
            }),
            {
              delimiter: ", ",
            }
          )}
        </span>
      )}
      {scene.inCombat && (
        <button onClick={handleNext} className="btn btn-primary btn-sm">
          Next
        </button>
      )}
    </div>
  );
}

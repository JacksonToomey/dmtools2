import { useStore } from "../../../store";

export default function GMView() {
  const tokens = useStore((state) => state.tokens);
  return (
    <div>
      GM
      <pre>{JSON.stringify(tokens, undefined, 2)}</pre>
    </div>
  );
}

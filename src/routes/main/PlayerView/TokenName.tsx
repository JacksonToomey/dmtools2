import { Token } from "../../../store";

export default function TokenName({ token }: { token: Token }) {
  return <span className="text-md">{token.text.plainText}</span>;
}

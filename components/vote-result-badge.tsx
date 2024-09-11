import { Badge } from "./ui/badge";

export function VoteResultBadge({ vote }: { vote: String | undefined | null }) {
    if (!vote) return null;
    const bgColor = vote === "Aprovado" ? "bg-green-500" : "bg-red-500";
  return <Badge
  className={bgColor + " h-fit"}
  >{vote}</Badge>;
}

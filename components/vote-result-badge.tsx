import { Chip } from "@mui/material";

export function VoteResultBadge({ vote }: { vote: String | undefined | null }) {
  if (!vote) return null;
  return (
    <Chip
      label={vote}
      size="small"
      color={vote === "Aprovado" ? "success" : "error"}
    />
  );
}

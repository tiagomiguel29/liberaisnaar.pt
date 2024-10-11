import { RefreshCwIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";

export const NoInitiativesFound = () => {
  return (
    <div className="text-center p-8 rounded-lg bg-card shadow-sm w-full mx-auto">
      <SearchIcon
        className="mx-auto h-12 w-12 text-card-foreground"
        aria-hidden="true"
      />
      <h3 className="mt-4 text-lg font-semibold text-card-foreground">
        Nenhuma iniciativa encontrada
      </h3>
    </div>
  );
};

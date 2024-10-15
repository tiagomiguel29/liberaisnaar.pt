import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

import { ExtendedInitiative, Follow } from "@/types/extended.types";
import { User } from "@supabase/supabase-js";
import { FollowButton } from "./follow-button";
import { VoteResultBadge } from "./vote-result-badge";
import { format } from "date-fns";
import { Button } from "@mui/material";
import Link from "next/link";

export const InitiativeCard = ({
  initiative,
  user,
  followedInitiatives,
  onFollowClick,
}: {
  initiative: ExtendedInitiative;
  user: User | null;
  followedInitiatives: Follow[];
  onFollowClick?: () => void;
}) => {
  return (
    <Card key={initiative.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg font-bold">
            {initiative.title}
          </CardTitle>
          {user && (
            <div className="px-1">
              <FollowButton
                initiativeId={initiative.id}
                userId={user.id}
                followed={followedInitiatives}
                onSuccessClick={onFollowClick}
              />
            </div>
          )}
        </div>
        <CardDescription>
          {initiative.type_description +
            " " +
            initiative.number +
            "/" +
            initiative.legislature +
            "/" +
            initiative.legislative_session}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <VoteResultBadge vote={initiative.firstVoteResult} />
          <p className="text-muted-foreground text-sm mt-2">
            Submetida em{" "}
            {format(new Date(initiative.submission_date), "dd/MM/yyyy")}
          </p>
        </div>
        <PartyAuthors initiative={initiative} />
      </CardContent>
      <CardFooter>
        <div className="flex flex-row-reverse w-full">
          <Link href={`/iniciativas/${initiative.id}`} prefetch={false} className="w-full md:w-auto">
            <Button fullWidth variant="contained">Consultar Iniciativa</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

const PartyAuthors = ({ initiative }: { initiative: ExtendedInitiative }) => {
  if (initiative.party_authors.length > 0) {
    return (
      <p className="text-muted-foreground text-sm mt-2">
        Partidos:{" "}
        {initiative.party_authors.map(({ party }) => party.acronym).join(", ")}
      </p>
    );
  }

  const otherAuthors = initiative.other_authors;

  return (
    <p className="text-muted-foreground text-sm mt-2">
      Autores: {otherAuthors?.map((a) => a).join(", ")}
    </p>
  );
};

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";
import { VoteResultBadge } from "@/components/vote-result-badge";
import { ThumbsDownIcon, ThumbsUpIcon, VoteIcon } from "lucide-react";
import Link from "next/link";
import { ExtendedVote, InitiativeWithParties } from "@/types/extended.types";
import { format } from "date-fns";
import { Metadata } from "next";
import { Paginator } from "@/components/pagination";
import { Button } from "@mui/material";
import { VotesFilters } from "./filters.client";
import { QueryData } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Liberais na AR | Votações",
};

export default async function Index({
  searchParams,
}: {
  searchParams: {
    page: string | undefined;
    limit: string | undefined;
    initiativeType: string | undefined;
    voteType: string | undefined;
    parties: string | undefined;
    from: string | undefined;
    to: string | undefined;
    voteResult: string | undefined;
    votePosition: string | undefined;
  };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const {
    initiativeType,
    voteType,
    parties,
    from,
    to,
    voteResult,
    votePosition,
  } = searchParams;

  let selectQuery = `*,
  inFavor:_InFavorVotes(party:parties(acronym)),
  against:_AgainstVotes(party:parties(acronym)),
  abstained:_AbstainedVotes(party:parties(acronym)),
  event:events(*, initiative:initiatives(*, party_authors:initiatives_party_authors(party:parties(acronym))))
  `;

  if (parties) {
    selectQuery += `, eventQuery:events!inner(phase, initiative:initiatives!inner(type_description, party_authors:initiatives_party_authors!inner(party:parties!inner(acronym))))`;
  }

  if (votePosition && votePosition !== "all") {
    if (votePosition === "inFavor") {
      selectQuery += `, inFavorFilter:_InFavorVotes!inner(party:parties!inner(acronym))`;
    } else if (votePosition === "against") {
      selectQuery += `, againstFilter:_AgainstVotes!inner(party:parties!inner(acronym))`;
    } else if (votePosition === "abstention") {
      selectQuery += `, abstainedFilter:_AbstainedVotes!inner(party:parties!inner(acronym))`;
    }
  }

  if (initiativeType && initiativeType !== "all") {
    selectQuery += `, initiativeQueryEvent:events!inner(phase, initiative:initiatives!inner(type_description))`;
  }

  if (voteType && voteType !== "all") {
    selectQuery += `, voteQueryEvent:events!inner(phase)`;
  }

  let query = supabase
    .from("votes")
    .select(selectQuery, { count: "exact" })
    .order("date", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (initiativeType && initiativeType !== "all") {
    query = query.eq(
      "initiativeQueryEvent.initiative.type_description",
      initiativeType
    );
  }

  if (voteType && voteType !== "all") {
    query = query.eq("voteQueryEvent.phase", voteType);
  }

  if (votePosition && votePosition !== "all") {
    if (votePosition === "inFavor") {
      query = query.eq("inFavorFilter.party.acronym", "IL");
    } else if (votePosition === "against") {
      query = query.eq("againstFilter.party.acronym", "IL");
    } else if (votePosition === "abstention") {
      query = query.eq("abstainedFilter.party.acronym", "IL");
    }
  }

  if (parties) {
    query = query.in(
      "eventQuery.initiative.party_authors.party.acronym",
      parties.split(",") ?? []
    );
  }

  if (voteResult && voteResult !== "all") {
    query = query.eq("result", voteResult);
  }

  if (from && to) {
    query = query.gte("date", from).lte("date", to);
  } else if (from) {
    query = query.gte("date", from);
  } else if (to) {
    query = query.lte("date", to);
  }

  const votesRes = await query;

  const totalVotes = votesRes.count ?? 0;
  const totalPages = Math.ceil(totalVotes / limit);

  if (votesRes.error) {
    console.error(votesRes.error);
    notFound();
  }

  const votes: ExtendedVote[] = votesRes.data as unknown as ExtendedVote[];

  console.log(votes);

  return (
    <>
      <main className="w-full md:w-3/4 lg:w-2/3 xl:w-2/3 px-4 py-8 md:px-8 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between py-6 gap-y-4">
          <h1 className="text-2xl font-bold">Votações</h1>
        </div>
        <VotesFilters />
        <div className="grid gap-4 md:gap-6 md:grid-cols-1 w-full">
          {votes.map((v) => (
            <Card key={v.id} className="w-full">
              <CardHeader>
                <CardTitle>{v.event.initiative.title}</CardTitle>
                <CardDescription>
                  {v.event.initiative.type_description +
                    " " +
                    v.event.initiative.number +
                    "/" +
                    v.event.initiative.legislature +
                    "/" +
                    v.event.initiative.legislative_session}
                </CardDescription>
                <CardDescription>
                  <span className="underline">{v.event.phase}</span>
                  {v.description && <span> - {v.description}</span>}
                </CardDescription>
                <CardDescription>
                  <span className="text-muted-foreground">
                    {format(new Date(v.event.phase_date), "dd/MM/yyyy")}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col-reverse gap-y-3 md:flex-row md:items-center md:justify-between">
                <ILVote vote={v} />
                <div className="flex items-center gap-2">
                  <VoteResultBadge vote={v.result} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row md:justify-between gap-y-2">
                <div className="w-full md:w-auto">
                  <PartyAuthors initiative={v.event.initiative} />
                </div>
                <Link
                  href={`/iniciativas/${v.event.initiative.id}`}
                  prefetch={false}
                  className="w-full md:w-auto"
                >
                  <Button fullWidth variant="contained">
                    Consultar Iniciativa
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="p-4 flex justify-center">
          <Paginator
            currentPage={page}
            limit={limit}
            totalPages={totalPages}
            href={true}
            basePath="/votacoes"
          />
        </div>
      </main>
    </>
  );
}

const ILVote = async ({ vote }: { vote: ExtendedVote }) => {
  if (
    vote.inFavor.some(({ party }) => party.acronym === "IL") ||
    vote.unanimous
  ) {
    return (
      <div className="flex items-center gap-2">
        <ThumbsUpIcon className="w-5 h-5 text-green-500" />
        <span className="font-medium">A Favor</span>
      </div>
    );
  }

  if (vote.against.some(({ party }) => party.acronym === "IL")) {
    return (
      <div className="flex items-center gap-2">
        <ThumbsDownIcon className="w-5 h-5 text-red-500" />
        <span className="font-medium">Contra</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <VoteIcon className="w-5 h-5 text-gray-500" />
      <span className="font-medium">Abstenção</span>
    </div>
  );
};

const PartyAuthors = ({
  initiative,
}: {
  initiative: InitiativeWithParties;
}) => {
  if (initiative.party_authors.length > 0) {
    return (
      <div>
        Partidos Autores:{" "}
        {initiative.party_authors.map(({ party }) => party.acronym).join(", ")}
      </div>
    );
  }

  const otherAuthors = initiative.other_authors;

  return <div>Autores: {otherAuthors?.map((a) => a).join(", ")}</div>;
};

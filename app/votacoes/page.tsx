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
  };
}) {
  // Get current page number from query params
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const { initiativeType, voteType, parties, from, to, voteResult } = searchParams;

  let query = supabase
    .from("votes")
    .select(
      `*,
        inFavor:_InFavorVotes(party:parties(acronym)),
        against:_AgainstVotes(party:parties(acronym)),
        abstained:_AbstainedVotes(party:parties(acronym)),
        event:events!inner(*, initiative:initiatives!inner(*, party_authors:initiatives_party_authors!inner(party:parties!inner(acronym)))),
        eventQuery:events!inner(phase, initiative:initiatives!inner(type_description, party_authors:initiatives_party_authors!inner(party:parties!inner(acronym))))
        `,
      { count: "exact" }
    )
    .order("date", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (initiativeType && initiativeType !== "all") {
    query = query.eq("event.initiative.type_description", initiativeType);
  }

  if (voteType && voteType !== "all") {
    query = query.eq("event.phase", voteType);
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

  const votes: ExtendedVote[] = votesRes.data;

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

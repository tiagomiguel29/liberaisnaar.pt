import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

import { Tables } from "@/database.types";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";
import { VoteResultBadge } from "@/components/vote-result-badge";
import { ThumbsDownIcon, ThumbsUpIcon, VoteIcon } from "lucide-react";
import Link from "next/link";
import { init } from "next/dist/compiled/webpack/webpack";

type Initiative = Tables<"initiatives">;
type Event = Tables<"events">;
type Vote = Tables<"votes">;
type Party = Tables<"parties">;

type ExtendedEvent = Event & {
  initiative: ExtendedInitiative;
};

type ExtendedVote = Vote & {
  inFavor: { party: Party }[];
  against: { party: Party }[];
  abstained: { party: Party }[];
  event: ExtendedEvent;
};

type ExtendedInitiative = Initiative & {
    party_authors: { party: Party }[];
};

export default async function Index({
  searchParams,
}: {
  searchParams: { page: string | undefined; limit: string | undefined };
}) {
  // Get current page number from query params
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;

  const partyAcronym = "IL";

  const votesRes = await supabase
    .from("votes")
    .select(
      `*,
        inFavor:_InFavorVotes(party:parties(acronym)),
        against:_AgainstVotes(party:parties(acronym)),
        abstained:_AbstainedVotes(party:parties(acronym)),
        event:events(*, initiative:initiatives(*, party_authors:initiatives_party_authors(party:parties(acronym))))
        `,
      { count: "exact" }
    )
    .range((page - 1) * limit, page * limit - 1);

  const totalPages = votesRes.count ?? 0;

  if (votesRes.error) {
    console.error(votesRes.error);
    notFound();
  }

  const votes: ExtendedVote[] = votesRes.data;

  console.log(votes[0].event.initiative.party_authors)

  return (
    <>
      <main className="flex-1 w-full md:w-3/4 lg:w-2/3 xl:w-2/3 flex flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
        <div className="container mx-auto grid gap-8 md:gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Votações</h2>
            <div className="grid gap-4 md:gap-6 md:grid-cols-1">
              {votes.map((v) => (
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <CardTitle>{v.event.initiative.title}</CardTitle>
                        <CardDescription>{v.event.phase}</CardDescription>
                        <CardDescription>
                          <span className="text-muted-foreground">
                            {new Date(v.event.phase_date).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col-reverse gap-y-3 md:flex-row md:items-center md:justify-between">
                    <ILVote vote={v} />
                    <div className="flex items-center gap-2">
                      <VoteResultBadge vote={v.result} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col md:flex-row md:justify-between gap-y-2">
                    <div>
                       <PartyAuthors initiative={v.event.initiative} />
                    </div>
                    <Link
                      href={`/iniciativas/${v.event.initiative.id}`}
                      className="inline-flex h-9 w-full md:w-fit items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      prefetch={false}
                    >
                      Consultar Iniciativa
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="p-4">
              <Pagination>
                <PaginationContent className="flex flex-wrap">
                  {/* Previous button */}
                  {page > 1 && (
                    <PaginationPrevious
                      href={`/votacoes?page=${page - 1}&limit=${limit}`}
                      isActive={page > 1}
                    >
                      Anterior
                    </PaginationPrevious>
                  )}
                  {/* Left Ellipsis (only show if page > 2) */}
                  {page > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Page numbers logic */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (n) => n === page || n === page - 1 || n === page + 1
                    ) // Only show current, previous, and next pages
                    .map((n) => (
                      <PaginationItem key={n}>
                        <PaginationLink
                          href={`/votacoes?page=${n}&limit=${limit}`}
                          isActive={n === page}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {/* Right Ellipsis (only show if more than 3 pages left) */}
                  {page < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Next button */}
                  {page < totalPages && (
                    <PaginationNext
                      href={`/votacoes?page=${page + 1}&limit=${limit}`}
                      isActive={page < totalPages}
                    >
                      Seguinte
                    </PaginationNext>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </div>
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

const PartyAuthors = ({initiative}: {initiative: ExtendedInitiative}) => {
    if (initiative.party_authors.length > 0) {
        return (
            <div>
                Partidos: {initiative.party_authors.map(({ party }) => party.acronym).join(", ")}
            </div>
        )
    }

    const otherAuthors = initiative.other_authors

    return (
        <div>
            Autores: {otherAuthors?.map((a) => a).join(", ")}
        </div>
    )
}

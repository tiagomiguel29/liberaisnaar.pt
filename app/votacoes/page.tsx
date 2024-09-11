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

type Initiative = Tables<"initiatives">;
type Event = Tables<"events">;
type Vote = Tables<"votes">;
type Party = Tables<"parties">;

type ExtendedEvent = Event & {
  initiative: Initiative;
};

type ExtendedVote = Vote & {
  inFavor: { party: Party }[];
  against: { party: Party }[];
  abstained: { party: Party }[];
  event: ExtendedEvent;
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
        event:events(*, initiative:initiatives(*))
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

  console.log(votes);

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
        <div className="container mx-auto grid gap-8 md:gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Votações</h2>
            <div className="grid gap-4 md:gap-6 md:grid-cols-1">
              {votes.map((v) => (
                <Card>
                  <CardHeader>
                    <CardTitle>{v.event.initiative.title}</CardTitle>
                    <CardDescription>{v.event.phase}</CardDescription>
                    <CardDescription>ID: {v.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <ILVote vote={v} />
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Dia da votação:{" "}
                        {new Date(v.event.phase_date).toLocaleDateString()}
                      </span>
                      <VoteResultBadge vote={v.result} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="p-4">
              <Pagination>
                <PaginationContent>
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
    console.log(vote.unanimous);
    console.log(vote.id)
    console.log(vote.inFavor)
  if (vote.inFavor.some(({ party }) => party.acronym === "IL") || vote.unanimous) {
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

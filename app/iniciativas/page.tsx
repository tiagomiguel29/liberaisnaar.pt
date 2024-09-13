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
} from "@/components/ui/card";
import { Tables } from "@/types/database.types";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VoteResultBadge } from "@/components/vote-result-badge";
import { ExtendedInitiative } from "@/types/extended.types";

type Initiative = Tables<"initiatives">;
type Party = Tables<"parties">;

export default async function Index({
  searchParams,
}: {
  searchParams: { page: string | undefined; limit: string | undefined };
}) {
  // Get current page number from query params
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;

  const partyAcronym = "IL";

  const initiativesRes = supabase
    .from("initiatives")
    .select(`*,
        initiatives_party_authors!inner(initiativeId, partyAcronym),
        party_authors:initiatives_party_authors(party:parties(*))
        `, {
      count: "exact",
    })
    .eq("initiatives_party_authors.partyAcronym", partyAcronym)
    .order("submission_date", { ascending: true })
    .order("number", { ascending: true })
    .range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await initiativesRes;

  if (error) {
    console.error(error);
    notFound();
  }

  const initiatives: ExtendedInitiative[] = data;
  const totalInitiatives = count ?? 0;
  const totalPages = Math.ceil(totalInitiatives / limit);

  return (
    <>
      <main className="flex-1 w-full md:w-3/4 lg:w-2/3 xl:w-2/3 flex flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
        <div className="container mx-auto grid gap-8 md:gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Iniciativas</h2>
            <div className="grid gap-4 md:gap-6 md:grid-cols-1">
              {initiatives.map((i) => (
                <Card key={i.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold">
                      {i.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <VoteResultBadge vote={i.firstVoteResult} />
                      <p className="text-muted-foreground text-sm mt-2">
                        Submetida em{" "}
                        {new Date(i.submission_date).toLocaleDateString()}
                      </p>
                    </div>
                    <PartyAuthors initiative={i} />
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-row-reverse w-full">
                      <Link
                        href={`/iniciativas/${i.id}`}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                      >
                        Consultar Iniciativa
                      </Link>
                    </div>
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
                      href={`/iniciativas?page=${page - 1}&limit=${limit}`}
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
                          href={`/iniciativas?page=${n}&limit=${limit}`}
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
                      href={`/iniciativas?page=${page + 1}&limit=${limit}`}
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

  return <p className="text-muted-foreground text-sm mt-2">Autores: {otherAuthors?.map((a) => a).join(", ")}</p>;
};

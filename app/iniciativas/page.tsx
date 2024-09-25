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
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VoteResultBadge } from "@/components/vote-result-badge";
import { ExtendedInitiative, Follow } from "@/types/extended.types";
import { createClient } from "@/utils/supabase/server";
import { FollowButton } from "@/components/follow-button";
import { format } from "date-fns";
import { BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Paginator } from "@/components/pagination";

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
    .select(
      `*,
        initiatives_party_authors!inner(initiativeId, partyAcronym),
        party_authors:initiatives_party_authors(party:parties(*))
        `,
      {
        count: "exact",
      }
    )
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

  const {
    data: { user },
  } = await createClient().auth.getUser();

  const initiativesIds: Number[] = initiatives.map((i) => i.id);

  let followedInitiatives: Follow[] = [];

  if (user) {
    const followRes = await createClient()
      .from("followed_initiatives")
      .select("*")
      .eq("user_id", user.id)
      .in("initiative_id", initiativesIds);

    if (followRes.error) {
      console.error(followRes.error);
    } else {
      followedInitiatives = followRes.data;
    }
  }

  return (
    <>
      <main className="flex-1 w-full md:w-3/4 lg:w-2/3 xl:w-2/3 flex flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
        <div className="container mx-auto grid gap-8 md:gap-12">
          <div>
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between py-6 gap-y-4">
              <h2 className="text-2xl font-bold">Iniciativas</h2>
              {user && (
                <Button asChild variant={"outline"}>
                  <Link
                    href="/iniciativas/following"
                    className="flex justify-center items-center gap-x-2"
                  >
                    Guardadas{" "}
                    <BookmarkIcon className="w-5 h-5 fill-white text-primary" />
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-1">
              {initiatives.map((i) => (
                <Card key={i.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-bold">
                        {i.title}
                      </CardTitle>
                      {user && (
                        <FollowButton
                          initiativeId={i.id}
                          userId={user?.id}
                          followed={followedInitiatives}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <VoteResultBadge vote={i.firstVoteResult} />
                      <p className="text-muted-foreground text-sm mt-2">
                        Submetida em{" "}
                        {format(new Date(i.submission_date), "dd/MM/yyyy")}
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
              <Paginator
                currentPage={page}
                limit={limit}
                totalPages={totalPages}
                href={true}
                basePath="/iniciativas"
              />
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

  return (
    <p className="text-muted-foreground text-sm mt-2">
      Autores: {otherAuthors?.map((a) => a).join(", ")}
    </p>
  );
};

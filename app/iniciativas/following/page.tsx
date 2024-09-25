"use client";

import { Spinner } from "@/components/spinner";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";

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

import { VoteResultBadge } from "@/components/vote-result-badge";
import { ExtendedInitiative, Follow } from "@/types/extended.types";
import { FollowButton } from "@/components/follow-button";
import { format } from "date-fns";
import Link from "next/link";

export default function FollowingInitiativesPage() {
  const searchParams = useSearchParams();
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [page, setPage] = useState<number>(
    Number.parseInt(searchParams.get("page") || "1")
  );
  const [limit, setLimit] = useState<number>(
    Number.parseInt(searchParams.get("limit") || "10")
  );
  const [totalPages, setTotalPages] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [followClick, setFollowClick] = useState<boolean>(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        
      }

      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchInitiatives = async () => {
      setLoading(true);
      const initiativesRes = supabase
        .from("initiatives")
        .select(
          `*,
          initiatives_party_authors!inner(initiativeId, partyAcronym),
          party_authors:initiatives_party_authors(party:parties(*)),
          followed_initiatives!inner(initiative_id, user_id)
        `,
          {
            count: "exact",
          }
        )
        .order("submission_date", { ascending: true })
        .order("number", { ascending: true })
        .range((page - 1) * limit, page * limit - 1);

      const { data, error, count } = await initiativesRes;

      setLoading(false);


      if (error) {
        console.error(error);
        return;
      }

      setInitiatives(data);
      setCount(count ?? 0);
      setTotalPages(Math.ceil(count ?? 0 / limit));
    };

    fetchInitiatives();
  }, [page, limit, followClick]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!session?.user) {
    window.location.href = "/sign-in";
    return null;
  }

  return (
    <main className="flex-1 w-full md:w-3/4 lg:w-2/3 xl:w-2/3 flex flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
      <div className="container mx-auto grid gap-8 md:gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Iniciativas Guardadas</h2>
          <div className="grid gap-4 md:gap-6 md:grid-cols-1">
            {loading && (
              <div className="flex justify-center items-center p-20">
                <Spinner />
              </div>
            )}
            {!loading &&
              initiatives.map((i) => (
                <Card key={i.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-bold">
                        {i.title}
                      </CardTitle>
                      <FollowButton
                        initiativeId={i.id}
                        userId={session?.user.id!}
                        followed={i.followed_initiatives}
                        onSuccessClick={() => setFollowClick(!followClick)}
                      />
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
                  .filter((n) => n === page || n === page - 1 || n === page + 1) // Only show current, previous, and next pages
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

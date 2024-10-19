import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExtendedInitiative, Follow } from "@/types/extended.types";
import { createClient } from "@/utils/supabase/server";
import { BookmarkIcon } from "lucide-react";
import { Paginator } from "@/components/pagination";
import { Metadata } from "next";
import { InitiativesFilters } from "./filters.client";
import { NoInitiativesFound } from "@/components/not-found-initiatives";
import { Button } from "@mui/material";
import { InitiativeCard } from "@/components/initiative-card";

export const metadata: Metadata = {
  title: "Liberais na AR | Iniciativas",
};

export default async function Index({
  searchParams,
}: {
  searchParams: {
    page: string | undefined;
    limit: string | undefined;
    type: string | undefined;
    from: string | undefined;
    to: string | undefined;
    firstVote: string | undefined;
    finalVote: string | undefined;
  };
}) {
  // Get current page number from query params
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const { type, from, to, firstVote, finalVote } = searchParams;

  const partyAcronym = "IL";

  // Base query
  let query = supabase
    .from("initiatives")
    .select(
      `*,
        initiatives_party_authors!inner(initiativeId, partyAcronym),
        party_authors:initiatives_party_authors(party:parties(*))`,
      { count: "exact" }
    )
    .eq("initiatives_party_authors.partyAcronym", partyAcronym)
    .order("submission_date", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (type && type !== "all") {
    query = query.eq("type_description", type);
  }

  if (from && to) {
    query = query.gte("submission_date", from).lte("submission_date", to);
  } else if (from) {
    query = query.gte("submission_date", from);
  } else if (to) {
    query = query.lte("submission_date", to);
  }

  if (firstVote && firstVote !== "all") {
    if (firstVote === "no-vote") {
      query = query.is("firstVoteResult", null);
    } else {
      query = query.eq("firstVoteResult", firstVote);
    }
  }

  if (finalVote && finalVote !== "all") {
    if (finalVote === "no-vote") {
      query = query.is("finalVoteResult", null);
    } else {
      query = query.eq("finalVoteResult", finalVote);
    }
  }

  const { data, error, count } = await query;

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
      <main className="w-full md:w-3/4 lg:w-2/3 xl:w-2/3 px-4 py-8 md:px-8 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between py-6 gap-y-4">
          <h1 className="text-2xl font-bold">Iniciativas</h1>
          {user && (
            <Link href="/iniciativas/following">
              <Button
                variant="contained"
                endIcon={<BookmarkIcon className="w-5 h-5" />}
              >
                Guardadas
              </Button>
            </Link>
          )}
        </div>
        <InitiativesFilters />
        <div className="grid gap-4 md:gap-6 md:grid-cols-1 w-full">
          {initiatives.length === 0 && <NoInitiativesFound />}
          {initiatives.map((i) => (
            <InitiativeCard
              key={i.id}
              initiative={i}
              user={user}
              followedInitiatives={followedInitiatives}
            />
          ))}
        </div>
        <div className="p-4 flex justify-center">
          <Paginator
            currentPage={page}
            limit={limit}
            totalPages={totalPages}
            href={true}
            basePath="/iniciativas"
          />
        </div>
      </main>
    </>
  );
}

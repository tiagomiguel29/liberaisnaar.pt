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
  };
}) {
  // Get current page number from query params
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const { type, from, to } = searchParams;

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

  // Apply type filter only if type is defined and not "all"
  if (type && type !== "all") {
    query = query.eq("type_description", type);
  }

  // Apply date range filter if both `from` and `to` are defined
  if (from && to) {
    query = query.gte("submission_date", from).lte("submission_date", to);
  } else if (from) {
    // Apply only from date if defined
    query = query.gte("submission_date", from);
  } else if (to) {
    // Apply only to date if defined
    query = query.lte("submission_date", to);
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
      <main className="flex-1 w-full md:w-3/4 lg:w-2/3 xl:w-2/3 flex flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
        <div className="container mx-auto grid gap-8 md:gap-12">
          <div>
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between py-6 gap-y-4">
              <h1 className="text-2xl font-bold">Iniciativas</h1>
              {user && (
                <Button
                  variant="contained"
                  endIcon={<BookmarkIcon className="w-5 h-5" />}
                >
                  <Link href="/iniciativas/following">Guardadas </Link>
                </Button>
              )}
            </div>
            <InitiativesFilters />
            <div className="grid gap-4 md:gap-6 md:grid-cols-1">
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
          </div>
        </div>
      </main>
    </>
  );
}

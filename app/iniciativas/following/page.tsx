"use client";

import { Spinner } from "@/components/spinner";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Paginator } from "@/components/pagination";
import { ArrowLeftIcon } from "lucide-react";
import { NoInitiativesFound } from "@/components/not-found-initiatives";
import { InitiativeCard } from "@/components/initiative-card";
import { Button } from "@mui/material";

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
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
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
      setTotalPages(Math.ceil((count ?? 0) / limit));
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
      <div className="mx-auto grid gap-8 md:gap-12">
        <div>
          <div className="my-4">
            <Link href="/iniciativas">
              <Button variant="contained" startIcon={<ArrowLeftIcon />}>
                Voltar
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold mb-4">Iniciativas Guardadas</h1>
          <div className="grid gap-4 md:gap-6 md:grid-cols-1">
            {loading && (
              <div className="flex justify-center items-center p-20">
                <Spinner />
              </div>
            )}
            {!loading && initiatives.length === 0 && <NoInitiativesFound />}
            {!loading &&
              initiatives.map((i) => (
                <>
                  <InitiativeCard
                    key={i.id}
                    initiative={i}
                    user={session?.user}
                    followedInitiatives={i.followed_initiatives}
                    onFollowClick={() => setFollowClick((prev) => !prev)}
                  />
                </>
              ))}
          </div>
          <div className="p-4 flex justify-center">
            <Paginator
              currentPage={page}
              limit={limit}
              totalPages={totalPages}
              onPageChange={(page) => {
                setPage(page);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

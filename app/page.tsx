import Hero from "@/components/hero";
import supabase from "@/utils/supabase";
import { Tables } from "@/types/database.types";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import Link from "next/link";

type Party = Tables<"parties">;
type Initiative = Tables<"initiatives">;
type PartyStats = Tables<"party_stats">;

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { format } from "date-fns";


export const revalidate = 120;

const getCachedStats = unstable_cache(async () => {
  const partyAcronym = "IL";
  let { data, error } = await supabase
    .from("party_stats")
    .select("*")
    .eq("party_acronym", partyAcronym);

  if (error || data?.length === 0) {
    console.error(error);
    notFound();
  }

  return data![0];
}, ['party_stats'], { revalidate: 120, tags: ['party_stats'] });

const getCachedLastInitiatives = unstable_cache(async () => {
  const partyAcronym = "IL";
  const res = await supabase
    .from("initiatives")
    .select("*, initiatives_party_authors!inner(initiativeId, partyAcronym)")
    .eq("initiatives_party_authors.partyAcronym", partyAcronym)
    .order("submission_date", { ascending: false })
    .limit(5);

  if (res.error) {
    console.error(res.error);
    notFound();
  }

  return res.data;
}, ['initiatives'], { revalidate: 120, tags: ['initiatives'] });

export default async function Index() {
  

  const stats: PartyStats = await getCachedStats();

  const lastInitiatives: Initiative[] = await getCachedLastInitiatives();

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
        <div className="container mx-auto grid gap-8 md:gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Taxa de Aprovação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{Math.round((stats.approvedInitiativesCount / stats.votedInitiativesCount) * 100)} %</div>
                <p className="text-muted-foreground text-sm">
                  {stats.approvedInitiativesCount + " " + (stats.approvedInitiativesCount !== 1 ? "iniciativas aprovadas" : "iniciativa aprovada")} de {stats.votedInitiativesCount + " " + (stats.votedInitiativesCount !== 1 ? "votadas" : "votada")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">
                  Iniciativas Propostas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {stats.initiativesCount}
                </div>
                <p className="text-muted-foreground text-sm">
                  Na sessão corrente
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">
                  Projetos de Lei
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.billsCount}</div>
                <p className="text-muted-foreground text-sm">{stats.approvedBillsCount + " " + (stats.approvedBillsCount !== 1 ? "Projetos de Lei Aprovados" : "Projeto de Lei Aprovado")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">
                  Projetos de Resolução
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {stats.resolutionsCount}
                </div>
                <p className="text-muted-foreground text-sm">{stats.approvedResolutionsCount + " " + (stats.approvedResolutionsCount !== 1 ? "Projetos de Resolução Aprovados" : "Projeto de Resolução Aprovado")}</p>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Ultimas Iniciativas</h2>
            <div className="grid gap-4 md:gap-6 md:grid-cols-1">
              {lastInitiatives.map((i) => (
                <Card key={i.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold">
                      {i.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Submetida em{" "}
                      {format(new Date(i.submission_date), "dd/MM/yyyy")}
                    </p>
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
          </div>
        </div>
      </main>
    </>
  );
}

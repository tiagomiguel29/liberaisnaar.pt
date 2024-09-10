import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteResultBadge } from "@/components/vote-result-badge";
import { Tables } from "@/database.types";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";
import { consumers } from "stream";

type Initiative = Tables<"initiatives">;
type Deputy = Tables<"deputies">;
type Party = Tables<"parties">;
type Attachment = Tables<"attachments">;

type ExtendedInitiative = Initiative & {
  deputy_authors: { deputy: Deputy }[];
  party_authors: { party: Party }[];
  attachments: Attachment[];
};

export default async function InitiativeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const initiativeRes = await supabase
    .from("initiatives")
    .select(
      `*,
        deputy_authors:initiatives_deputy_authors(
            deputy:deputies(record_id, name)
        ),
        party_authors:initiatives_party_authors(
            party:parties(acronym, name)
        ),
        attachments(*)
        `
    )
    .eq("id", params.id)
    .single();

  if (initiativeRes.error) {
    console.error(initiativeRes.error);
    notFound();
  }

  const initiative: ExtendedInitiative = initiativeRes.data;
  return (
    <main className="flex-1  w-full md:w-3/4 lg:w-2/3 xl:w-2/3 flex flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
      <div className="container mx-auto grid gap-8 md:gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Detalhes Iniciativa</h2>
          <div className="grid gap-4 md:gap-6 md:grid-cols-1">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
                  <CardTitle className="text-2xl font-bold">
                    {initiative.type_description +
                      " " +
                      initiative.number +
                      "/" +
                      initiative.legislature +
                      "/" +
                      initiative.legislative_session}
                  </CardTitle>
                  <VoteResultBadge vote={initiative.firstVoteResult} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 mb-4">
                  <div className="font-bold">Título</div>
                  <div className="text-xl">{initiative.title}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="grid gap-2">
                    <div className="font-bold">ID AR</div>
                    <div>{initiative.initiative_id}</div>
                  </div>
                  <div className="grid gap-2">
                    <div className="font-bold">Número</div>
                    <div>{initiative.number}</div>
                  </div>
                  <div className="grid gap-2">
                    <div className="font-bold">Tipo</div>
                    <div>{initiative.type_description}</div>
                  </div>
                  <div className="grid gap-2">
                    <div className="font-bold">Legislatura</div>
                    <div>{initiative.legislature}</div>
                  </div>
                  <div className="grid gap-2">
                    <div className="font-bold">Data Submissão</div>
                    <div>
                      {new Date(
                        initiative.submission_date
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div className="font-bold">Partidos</div>
                    <div className="flex flex-wrap gap-1">
                      {initiative.party_authors.map(({ party }) => (
                        <Badge
                          className="bg-secondary-foreground"
                          key={party.acronym}
                        >
                          {party.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Deputados Autores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  {initiative.deputy_authors.map(({ deputy }) => (
                    <Badge
                      className="bg-secondary-foreground"
                      key={deputy.record_id}
                    >
                      {deputy.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

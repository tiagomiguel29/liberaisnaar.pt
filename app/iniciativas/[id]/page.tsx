import { EventsInitiative } from "@/components/events-initiative";
import { FollowButton } from "@/components/follow-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteResultBadge } from "@/components/vote-result-badge";
import {
  Attachment,
  EventWithVotes,
  ExtendedInitiative,
  Follow,
} from "@/types/extended.types";
import supabase from "@/utils/supabase";
import { createClient } from "@/utils/supabase/server";
import { Button, Chip } from "@mui/material";
import { format } from "date-fns";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("initiatives")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return {
      title: "Liberais Na AR",
    };
  }

  return {
    title: data.title,
    description:
      data.type_description +
      " " +
      data.number +
      "/" +
      data.legislature +
      "/" +
      data.legislative_session +
      " - " +
      data.title,
  };
}

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
        attachments(*),
        events(*,
        attachments(*), 
        votes:votes(*,
          inFavor:_InFavorVotes(party:parties(acronym)),
          against:_AgainstVotes(party:parties(acronym)),
          abstained:_AbstainedVotes(party:parties(acronym))
        )
          )
        `
    )
    .eq("id", params.id)
    .single();

  if (initiativeRes.error) {
    console.error(initiativeRes.error);
    notFound();
  }

  const initiative: ExtendedInitiative = initiativeRes.data;

  const events: EventWithVotes[] = initiative.events;

  let followed: Follow[] = [];

  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (user) {
    const followedRes = await createClient()
      .from("followed_initiatives")
      .select("*")
      .eq("user_id", user.id)
      .eq("initiative_id", initiative.id);
    if (followedRes.error) {
      console.error(followedRes.error);
    } else {
      followed = followedRes.data;
    }
  }

  return (
    <main className="w-full md:w-3/4 lg:w-2/3 xl:w-2/3 px-4 py-8 md:px-8 md:py-12">
      <div className="py-6">
        <h1 className="text-2xl font-bold">Detalhes Iniciativa</h1>
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-1 w-full">
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
              <div className="flex flex-row gap-x-2 items-center">
                <VoteResultBadge vote={initiative.firstVoteResult} />
                {user && (
                  <FollowButton
                    initiativeId={initiative.id}
                    followed={followed}
                    userId={user.id}
                  />
                )}
              </div>
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
                  {format(new Date(initiative.submission_date), "dd/MM/yyyy")}
                </div>
              </div>
              <div>
                <Link
                  href={initiative.text_link!}
                  target="_blank"
                  className="flex items-center gap-x-2"
                >
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<FileIcon />}
                  >
                    Ver Texto
                  </Button>
                </Link>
              </div>
              <PartyAuthors initiative={initiative} />
            </div>
          </CardContent>
        </Card>
        {initiative.deputy_authors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Deputados Autores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {initiative.deputy_authors.map(({ deputy }) => (
                  <Chip
                    label={deputy.name}
                    key={deputy.record_id}
                    size="small"
                    color="primary"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <EventsInitiative events={events} />
          </CardContent>
        </Card>
        <AttachmentsSection attachments={initiative.attachments} />
      </div>
    </main>
  );
}

const PartyAuthors = ({ initiative }: { initiative: ExtendedInitiative }) => {
  if (initiative.party_authors.length > 0) {
    return (
      <div className="grid gap-2">
        <div className="font-bold">Partidos</div>
        <div className="flex flex-wrap gap-1">
          {initiative.party_authors.map(({ party }) => (
            <Chip
              color="primary"
              size="small"
              key={party.acronym}
              label={party.name}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <div className="font-bold">Autores</div>
      <div className="flex flex-wrap gap-1">
        {initiative.other_authors?.map((a) => (
          <Chip color="primary" size="small" key={a} label={a} />
        ))}
      </div>
    </div>
  );
};

const AttachmentsSection = ({ attachments }: { attachments: Attachment[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Anexos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {attachments.map((attachment: Attachment) => (
            <Link key={attachment.id} href={attachment.file} target="_blank">
              <div
                key={attachment.id}
                className="flex flex-col items-center p-4 gap-2 bg-muted/40 shadow-lg rounded-lg hover:shadow-2xl hover:border-primary border-2"
              >
                <FileIcon className="h-16 w-16" />
                <div>{attachment.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

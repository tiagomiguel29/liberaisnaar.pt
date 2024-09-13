import { EventWithVotes, VoteWithParties } from "@/types/extended.types";

export function EventsInitiative({ events }: { events: EventWithVotes[] }) {
  if (!events.length) return null;

  // Sort by id
  events.sort((a, b) => a.id - b.id);

  return (
    <div className="px-6 sm:px-10">
      <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-muted-foreground/20 after:left-0 grid gap-10">
        {events.map((event) => (
          <div className="grid gap-1 text-sm relative">
            <div className="aspect-square w-3 bg-primary rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1" />
            <div className="font-medium">
              {new Date(event.phase_date).toLocaleDateString()}
            </div>
            <div className="font-medium">{event.phase}</div>
            <div className="text-muted-foreground">ID: {event.oevId}</div>
            {
              event.votes.map((vote) => (
                <VoteDescription vote={vote} />
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}

const VoteDescription = ({ vote }: { vote: VoteWithParties }) => {

  if (vote.unanimous) {
    return (
      <div className="font-medium">Aprovado por unanimidade</div>
    )
  }
  

  return (
    <div>
      <div className="font-medium underline">
        {vote.result}
      </div>
      {vote.inFavor.length > 0 && (
      <div>
        <span className="font-medium">A favor: </span>
        {vote.inFavor.map((p) => 
          p.party.acronym).join(", ")
        }
        </div>
      )}
      {vote.against.length > 0 && (
        <div>
          <span className="font-medium">Contra: </span>
          {vote.against.map((p) => 
            p.party.acronym).join(", ")
          }
        </div>
      )}
      {vote.abstained.length > 0 && (
        <div>
          <span className="font-medium">Abstiveram-se: </span>
          {vote.abstained.map((p) => 
            p.party.acronym).join(", ")
          }
        </div>
      )}
    </div>
  )
};

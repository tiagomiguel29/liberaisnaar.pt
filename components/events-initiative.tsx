import { Tables } from "@/database.types";

type Event = Tables<"events">;

export function EventsInitiative({ events }: { events: Event[] }) {
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
          </div>
        ))}
      </div>
    </div>
  );
}

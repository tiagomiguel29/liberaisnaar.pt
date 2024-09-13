import { Tables } from "./database.types";

type Initiative = Tables<"initiatives">;
type Deputy = Tables<"deputies">;
type Party = Tables<"parties">;
type Attachment = Tables<"attachments">;
type Event = Tables<"events">;
type Vote = Tables<"votes">;

export type VoteWithParties = Vote & {
    inFavor: { party: Party }[];
    against: { party: Party }[];
    abstained: { party: Party }[];
};

export type EventWithVotes = Event & {
    votes: VoteWithParties[];
};

export type ExtendedInitiative = Initiative & {
    deputy_authors: { deputy: Deputy }[];
    party_authors: { party: Party }[];
    events: EventWithVotes[];
    attachments: Attachment[];
};

export type InitiativeWithParties = ExtendedInitiative & {
    party_authors: { party: Party }[];
};

export type EventWithInitiative = Event & {
    initiative: InitiativeWithParties;
};

export type ExtendedVote = VoteWithParties & {
    event: EventWithInitiative;
};
import { Tables } from "./database.types";

export type Initiative = Tables<"initiatives">;
export type Deputy = Tables<"deputies">;
export type Party = Tables<"parties">;
export type Attachment = Tables<"attachments">;
export type Event = Tables<"events">;
export type Vote = Tables<"votes">;
export type Follow = Tables<"followed_initiatives">;

export type VoteWithParties = Vote & {
    inFavor: { party: Party }[];
    against: { party: Party }[];
    abstained: { party: Party }[];
};

export type EventWithVotes = Event & {
    attachments: Attachment[];
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
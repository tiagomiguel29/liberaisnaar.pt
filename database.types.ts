export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _AbstainedVotes: {
        Row: {
          A: number
          B: number
        }
        Insert: {
          A: number
          B: number
        }
        Update: {
          A?: number
          B?: number
        }
        Relationships: [
          {
            foreignKeyName: "_AbstainedVotes_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_AbstainedVotes_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
        ]
      }
      _AgainstVotes: {
        Row: {
          A: number
          B: number
        }
        Insert: {
          A: number
          B: number
        }
        Update: {
          A?: number
          B?: number
        }
        Relationships: [
          {
            foreignKeyName: "_AgainstVotes_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_AgainstVotes_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
        ]
      }
      _InFavorVotes: {
        Row: {
          A: number
          B: number
        }
        Insert: {
          A: number
          B: number
        }
        Update: {
          A?: number
          B?: number
        }
        Relationships: [
          {
            foreignKeyName: "_InFavorVotes_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_InFavorVotes_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
        ]
      }
      _InitiativeToPetition: {
        Row: {
          A: number
          B: number
        }
        Insert: {
          A: number
          B: number
        }
        Update: {
          A?: number
          B?: number
        }
        Relationships: [
          {
            foreignKeyName: "_InitiativeToPetition_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_InitiativeToPetition_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "petitions"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          eventId: number | null
          file: string
          id: number
          initiativeId: number | null
          name: string
        }
        Insert: {
          eventId?: number | null
          file: string
          id?: number
          initiativeId?: number | null
          name: string
        }
        Update: {
          eventId?: number | null
          file?: string
          id?: number
          initiativeId?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_initiativeId_fkey"
            columns: ["initiativeId"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      change_proposals: {
        Row: {
          author: string | null
          change_proposal_id: string
          id: number
          initiativeId: number | null
          publication: string | null
          type: string | null
        }
        Insert: {
          author?: string | null
          change_proposal_id: string
          id?: number
          initiativeId?: number | null
          publication?: string | null
          type?: string | null
        }
        Update: {
          author?: string | null
          change_proposal_id?: string
          id?: number
          initiativeId?: number | null
          publication?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_proposals_initiativeId_fkey"
            columns: ["initiativeId"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          accId: string
          commissionId: string
          competent: string
          distributionDate: string
          eventId: number
          id: number
          name: string
          number: string
          schedulingDatePlenary: string
        }
        Insert: {
          accId: string
          commissionId: string
          competent: string
          distributionDate: string
          eventId: number
          id?: number
          name: string
          number: string
          schedulingDatePlenary: string
        }
        Update: {
          accId?: string
          commissionId?: string
          competent?: string
          distributionDate?: string
          eventId?: number
          id?: number
          name?: string
          number?: string
          schedulingDatePlenary?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      deputies: {
        Row: {
          active: boolean
          id: number
          name: string
          party_acronym: string | null
          record_id: string
        }
        Insert: {
          active?: boolean
          id?: number
          name: string
          party_acronym?: string | null
          record_id: string
        }
        Update: {
          active?: boolean
          id?: number
          name?: string
          party_acronym?: string | null
          record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deputies_party_acronym_fkey"
            columns: ["party_acronym"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["acronym"]
          },
        ]
      }
      documents: {
        Row: {
          commissionId: number
          date: string
          id: number
          title: string
          type: string
          URL: string
        }
        Insert: {
          commissionId: number
          date: string
          id?: number
          title: string
          type: string
          URL: string
        }
        Update: {
          commissionId?: number
          date?: string
          id?: number
          title?: string
          type?: string
          URL?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_commissionId_fkey"
            columns: ["commissionId"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          activity_id: string | null
          approved_texts: string | null
          evId: string | null
          id: number
          initiativeId: number
          oevId: string | null
          oevTextId: string | null
          other_activities_id: string[] | null
          phase: string | null
          phase_code: string | null
          phase_date: string | null
          phase_obs: string | null
        }
        Insert: {
          activity_id?: string | null
          approved_texts?: string | null
          evId?: string | null
          id?: number
          initiativeId: number
          oevId?: string | null
          oevTextId?: string | null
          other_activities_id?: string[] | null
          phase?: string | null
          phase_code?: string | null
          phase_date?: string | null
          phase_obs?: string | null
        }
        Update: {
          activity_id?: string | null
          approved_texts?: string | null
          evId?: string | null
          id?: number
          initiativeId?: number
          oevId?: string | null
          oevTextId?: string | null
          other_activities_id?: string[] | null
          phase?: string | null
          phase_code?: string | null
          phase_date?: string | null
          phase_obs?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_initiativeId_fkey"
            columns: ["initiativeId"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      government_members: {
        Row: {
          government: string
          id: number
          interventionId: number
          name: string
          position: string
        }
        Insert: {
          government: string
          id?: number
          interventionId: number
          name: string
          position: string
        }
        Update: {
          government?: string
          id?: number
          interventionId?: number
          name?: string
          position?: string
        }
        Relationships: [
          {
            foreignKeyName: "government_members_interventionId_fkey"
            columns: ["interventionId"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      initiatives: {
        Row: {
          finalVote: boolean
          finalVoteDate: string | null
          finalVoteResult: string | null
          firstVote: boolean
          firstVoteDate: string | null
          firstVoteResult: string | null
          has_title_text: string | null
          id: number
          initiative_id: string
          legislative_session: string
          legislature: string
          legislature_end: string | null
          legislature_start: string | null
          links: string[] | null
          number: string
          observations: string | null
          other_authors: string[] | null
          replacement_text: string | null
          replacement_text_obs: string | null
          submission_date: string
          text_link: string | null
          title: string
          type: string
          type_description: string | null
        }
        Insert: {
          finalVote?: boolean
          finalVoteDate?: string | null
          finalVoteResult?: string | null
          firstVote?: boolean
          firstVoteDate?: string | null
          firstVoteResult?: string | null
          has_title_text?: string | null
          id?: number
          initiative_id: string
          legislative_session: string
          legislature: string
          legislature_end?: string | null
          legislature_start?: string | null
          links?: string[] | null
          number: string
          observations?: string | null
          other_authors?: string[] | null
          replacement_text?: string | null
          replacement_text_obs?: string | null
          submission_date: string
          text_link?: string | null
          title: string
          type: string
          type_description?: string | null
        }
        Update: {
          finalVote?: boolean
          finalVoteDate?: string | null
          finalVoteResult?: string | null
          firstVote?: boolean
          firstVoteDate?: string | null
          firstVoteResult?: string | null
          has_title_text?: string | null
          id?: number
          initiative_id?: string
          legislative_session?: string
          legislature?: string
          legislature_end?: string | null
          legislature_start?: string | null
          links?: string[] | null
          number?: string
          observations?: string | null
          other_authors?: string[] | null
          replacement_text?: string | null
          replacement_text_obs?: string | null
          submission_date?: string
          text_link?: string | null
          title?: string
          type?: string
          type_description?: string | null
        }
        Relationships: []
      }
      initiatives_deputy_authors: {
        Row: {
          deputy_record_id: string
          initiativeId: number
        }
        Insert: {
          deputy_record_id: string
          initiativeId: number
        }
        Update: {
          deputy_record_id?: string
          initiativeId?: number
        }
        Relationships: [
          {
            foreignKeyName: "initiatives_deputy_authors_deputy_record_id_fkey"
            columns: ["deputy_record_id"]
            isOneToOne: false
            referencedRelation: "deputies"
            referencedColumns: ["record_id"]
          },
          {
            foreignKeyName: "initiatives_deputy_authors_initiativeId_fkey"
            columns: ["initiativeId"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      initiatives_party_authors: {
        Row: {
          initiativeId: number
          partyAcronym: string
        }
        Insert: {
          initiativeId: number
          partyAcronym: string
        }
        Update: {
          initiativeId?: number
          partyAcronym?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiatives_party_authors_initiativeId_fkey"
            columns: ["initiativeId"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "initiatives_party_authors_partyAcronym_fkey"
            columns: ["partyAcronym"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["acronym"]
          },
        ]
      }
      interventions: {
        Row: {
          eventId: number
          id: number
          sessionPhase: string
          summary: string
        }
        Insert: {
          eventId: number
          id?: number
          sessionPhase: string
          summary: string
        }
        Update: {
          eventId?: number
          id?: number
          sessionPhase?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "interventions_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      link_videos: {
        Row: {
          id: number
          interventionId: number
          link: string
        }
        Insert: {
          id?: number
          interventionId: number
          link: string
        }
        Update: {
          id?: number
          interventionId?: number
          link?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_videos_interventionId_fkey"
            columns: ["interventionId"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      parties: {
        Row: {
          acronym: string
          id: number
          name: string | null
        }
        Insert: {
          acronym: string
          id?: number
          name?: string | null
        }
        Update: {
          acronym?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      party_stats: {
        Row: {
          approvedBillsCount: number
          approvedInitiativesCount: number
          approvedResolutionsCount: number
          billsCount: number
          deputiesCount: number | null
          id: number
          initiativesCount: number
          party_acronym: string
          resolutionsCount: number
        }
        Insert: {
          approvedBillsCount: number
          approvedInitiativesCount: number
          approvedResolutionsCount: number
          billsCount: number
          deputiesCount?: number | null
          id?: number
          initiativesCount: number
          party_acronym: string
          resolutionsCount: number
        }
        Update: {
          approvedBillsCount?: number
          approvedInitiativesCount?: number
          approvedResolutionsCount?: number
          billsCount?: number
          deputiesCount?: number | null
          id?: number
          initiativesCount?: number
          party_acronym?: string
          resolutionsCount?: number
        }
        Relationships: [
          {
            foreignKeyName: "party_stats_party_acronym_fkey"
            columns: ["party_acronym"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["acronym"]
          },
        ]
      }
      petitions: {
        Row: {
          id: number
          law_decree: string | null
          legislative_session: string | null
          legislature: string | null
          number: number
          petition_id: string
          subject: string | null
          type: string | null
          type_description: string | null
        }
        Insert: {
          id?: number
          law_decree?: string | null
          legislative_session?: string | null
          legislature?: string | null
          number: number
          petition_id: string
          subject?: string | null
          type?: string | null
          type_description?: string | null
        }
        Update: {
          id?: number
          law_decree?: string | null
          legislative_session?: string | null
          legislature?: string | null
          number?: number
          petition_id?: string
          subject?: string | null
          type?: string | null
          type_description?: string | null
        }
        Relationships: []
      }
      phase_publications: {
        Row: {
          eventId: number
          id: number
          idPage: string
          page: string
          pubdt: string
          pubLeg: string
          pubNr: string
          pubSL: string
          pubTp: string
          pubType: string
          URLDiary: string
        }
        Insert: {
          eventId: number
          id?: number
          idPage: string
          page: string
          pubdt: string
          pubLeg: string
          pubNr: string
          pubSL: string
          pubTp: string
          pubType: string
          URLDiary: string
        }
        Update: {
          eventId?: number
          id?: number
          idPage?: string
          page?: string
          pubdt?: string
          pubLeg?: string
          pubNr?: string
          pubSL?: string
          pubTp?: string
          pubType?: string
          URLDiary?: string
        }
        Relationships: [
          {
            foreignKeyName: "phase_publications_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          id: number
          idInt: string
          interventionId: number
          page: string
          pubdt: string
          pubLeg: string
          pubNr: string
          pubSL: string
          pubTp: string
          pubType: string
          URLDiary: string
        }
        Insert: {
          id?: number
          idInt: string
          interventionId: number
          page: string
          pubdt: string
          pubLeg: string
          pubNr: string
          pubSL: string
          pubTp: string
          pubType: string
          URLDiary: string
        }
        Update: {
          id?: number
          idInt?: string
          interventionId?: number
          page?: string
          pubdt?: string
          pubLeg?: string
          pubNr?: string
          pubSL?: string
          pubTp?: string
          pubType?: string
          URLDiary?: string
        }
        Relationships: [
          {
            foreignKeyName: "publications_interventionId_fkey"
            columns: ["interventionId"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          date: string
          description: string | null
          detail: string | null
          eventCode: string
          eventId: number
          id: number
          meeting: string
          meetingType: string
          result: string
          unanimous: boolean
          voteId: string
        }
        Insert: {
          date: string
          description?: string | null
          detail?: string | null
          eventCode: string
          eventId: number
          id?: number
          meeting: string
          meetingType: string
          result: string
          unanimous: boolean
          voteId: string
        }
        Update: {
          date?: string
          description?: string | null
          detail?: string | null
          eventCode?: string
          eventId?: number
          id?: number
          meeting?: string
          meetingType?: string
          result?: string
          unanimous?: boolean
          voteId?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

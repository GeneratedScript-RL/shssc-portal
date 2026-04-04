export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDef<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

type ViewDef<Row> = {
  Row: Row;
  Relationships: [];
};

type Timestamped = {
  id: string;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      access_levels: TableDef<
        Timestamped & {
          name: string;
          hierarchy_order: number;
          is_sysadmin: boolean;
        }
      >;
      ranks: TableDef<
        Timestamped & {
          name: string;
          color_hex: string;
          hierarchy_order: number;
        }
      >;
      users: TableDef<
        Timestamped & {
          auth_id: string | null;
          email: string;
          student_id: string | null;
          full_name: string;
          avatar_url: string | null;
          access_level_id: string | null;
          privacy_consent: boolean;
          is_active: boolean;
          created_by: string | null;
        }
      >;
      access_level_permissions: TableDef<
        Timestamped & {
          access_level_id: string;
          permission: string;
          granted: boolean;
        }
      >;
      user_ranks: TableDef<{
        id: string;
        user_id: string;
        rank_id: string;
        assigned_by: string | null;
        assigned_at: string;
      }>;
      committees: TableDef<
        Timestamped & {
          name: string;
          description: string | null;
          created_by: string | null;
        }
      >;
      committee_members: TableDef<{
        id: string;
        committee_id: string;
        user_id: string;
        role_in_committee: string | null;
      }>;
      officer_rosters: TableDef<
        Timestamped & {
          school_year: string;
          is_active: boolean;
          achievements: string[];
          impact_summary: string | null;
          milestones: string[];
          president_quote: string | null;
          president_user_id: string | null;
        }
      >;
      officer_roster_entries: TableDef<{
        id: string;
        roster_id: string;
        user_id: string;
        rank_id: string | null;
        position_title: string;
        committee_id: string | null;
        photo_url: string | null;
        order_index: number;
      }>;
      legacy_wall_entries: TableDef<
        Timestamped & {
          roster_id: string;
          title: string;
          description: string;
          order_index: number;
          created_by: string | null;
        }
      >;
      awards: TableDef<
        Timestamped & {
          name: string;
          description: string | null;
          emblem_url: string | null;
          created_by: string | null;
        }
      >;
      user_awards: TableDef<{
        id: string;
        user_id: string;
        award_id: string;
        awarded_by: string | null;
        awarded_at: string;
        note: string | null;
      }>;
      posts: TableDef<{
        id: string;
        title: string;
        slug: string;
        body: Json;
        post_type: "news" | "memorandum" | "announcement" | "resolution" | "minutes";
        status: "draft" | "published" | "archived";
        author_id: string | null;
        published_at: string | null;
        attachments: string[];
        created_at: string;
        updated_at: string;
      }>;
      events: TableDef<
        Timestamped & {
          title: string;
          description: string | null;
          start_at: string;
          end_at: string;
          location: string | null;
          is_registration_open: boolean;
          max_attendees: number | null;
          created_by: string | null;
        }
      >;
      event_registrations: TableDef<{
        id: string;
        event_id: string;
        user_id: string;
        registered_at: string;
        reminder_sent: boolean;
      }>;
      polls: TableDef<
        Timestamped & {
          title: string;
          description: string | null;
          poll_type: "single" | "multiple" | "ranked";
          visibility: string;
          min_access_level_id: string | null;
          is_anonymous: boolean;
          is_satisfaction_poll: boolean;
          closes_at: string | null;
          created_by: string | null;
        }
      >;
      poll_options: TableDef<{
        id: string;
        poll_id: string;
        label: string;
        order_index: number;
      }>;
      poll_votes: TableDef<{
        id: string;
        poll_id: string;
        option_id: string;
        user_id: string | null;
        voted_at: string;
      }>;
      submissions: TableDef<
        Timestamped & {
          submission_type: "concern" | "suggestion" | "complaint" | "feedback";
          subject: string;
          body: string;
          is_anonymous: boolean;
          is_public: boolean;
          submitter_id: string | null;
          status: "pending" | "reviewing" | "resolved" | "dismissed";
          assigned_to: string | null;
          internal_notes: string | null;
          resolved_at: string | null;
        }
      >;
      submission_visibility: TableDef<{
        id: string;
        access_level_id: string;
        submission_type: "concern" | "suggestion" | "complaint" | "feedback";
        can_view: boolean;
        can_respond: boolean;
      }>;
      suggestion_upvotes: TableDef<{
        id: string;
        submission_id: string;
        user_id: string;
      }>;
      forum_channels: TableDef<
        Timestamped & {
          name: string;
          slug: string;
          description: string | null;
          channel_type: "open" | "announcement" | "restricted";
          min_post_level_id: string | null;
          min_view_level_id: string | null;
          order_index: number;
          is_locked: boolean;
        }
      >;
      forum_threads: TableDef<
        Timestamped & {
          channel_id: string;
          title: string;
          body: Json;
          author_id: string;
          is_pinned: boolean;
          is_locked: boolean;
          reply_count: number;
          last_reply_at: string;
        }
      >;
      forum_replies: TableDef<
        Timestamped & {
          thread_id: string;
          body: Json;
          author_id: string;
          is_deleted: boolean;
        }
      >;
      forum_reactions: TableDef<{
        id: string;
        target_type: "thread" | "reply";
        target_id: string;
        user_id: string;
        emoji: string;
      }>;
      forum_reports: TableDef<
        Timestamped & {
          target_type: "thread" | "reply";
          target_id: string;
          reporter_id: string | null;
          reason: string;
          resolved: boolean;
        }
      >;
      financial_summaries: TableDef<{
        id: string;
        period: string;
        total_income: number;
        total_expenses: number;
        balance: number;
        summary_text: string | null;
        attachments: string[];
        published_by: string | null;
        published_at: string;
      }>;
      resolutions: TableDef<{
        id: string;
        title: string;
        resolution_number: string;
        status: "pending" | "approved" | "rejected";
        body: string | null;
        meeting_date: string | null;
        approved_at: string | null;
        published_at: string | null;
      }>;
      qa_sessions: TableDef<
        Timestamped & {
          title: string;
          event_id: string | null;
          is_open: boolean;
          transcript_post_id: string | null;
          created_by: string | null;
          opened_at: string | null;
          closed_at: string | null;
        }
      >;
      qa_questions: TableDef<
        Timestamped & {
          session_id: string;
          body: string;
          submitter_id: string | null;
          is_anonymous: boolean;
          status: "queued" | "answered" | "skipped";
          answered_at: string | null;
        }
      >;
    };
    Views: {
      current_user_permissions: ViewDef<{
        permission: string;
      }>;
    };
    Functions: {
      has_permission: {
        Args: { perm: string };
        Returns: boolean;
      };
      is_sysadmin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Update<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type UserProfile = Tables<"users"> & {
  access_level?: Tables<"access_levels"> | null;
  ranks?: Tables<"ranks">[];
  awards?: Tables<"awards">[];
};

export type PostRecord = Tables<"posts"> & {
  author?: Pick<Tables<"users">, "id" | "full_name" | "avatar_url"> | null;
};

export type EventRecord = Tables<"events"> & {
  registrations?: number;
};

export type PollRecord = Tables<"polls"> & {
  options?: Tables<"poll_options">[];
};

export type ForumChannelRecord = Tables<"forum_channels"> & {
  thread_count?: number;
  last_activity?: string | null;
};

export type ForumThreadRecord = Tables<"forum_threads"> & {
  author?: Pick<Tables<"users">, "id" | "full_name" | "avatar_url"> | null;
};

export type SubmissionRecord = Tables<"submissions"> & {
  upvotes?: number;
};

export type LegacyHighlightRecord = Tables<"legacy_wall_entries"> & {
  school_year?: string;
};

export type LegacyRosterEntryRecord = Tables<"officer_roster_entries"> & {
  rank?: Pick<Tables<"ranks">, "id" | "name" | "color_hex"> | null;
  user?: Pick<Tables<"users">, "id" | "full_name" | "avatar_url"> | null;
  awards?: Pick<Tables<"awards">, "id" | "name" | "emblem_url" | "description">[];
};

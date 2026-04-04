export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type RowWithTimestamps<T> = T & {
  id: string;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      access_levels: {
        Row: RowWithTimestamps<{
          name: string;
          hierarchy_order: number;
          is_sysadmin: boolean;
        }>;
        Insert: Partial<Database["public"]["Tables"]["access_levels"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["access_levels"]["Row"]>;
      };
      ranks: {
        Row: RowWithTimestamps<{
          name: string;
          color_hex: string;
          hierarchy_order: number;
        }>;
        Insert: Partial<Database["public"]["Tables"]["ranks"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["ranks"]["Row"]>;
      };
      users: {
        Row: RowWithTimestamps<{
          auth_id: string | null;
          email: string;
          student_id: string | null;
          full_name: string;
          avatar_url: string | null;
          access_level_id: string | null;
          privacy_consent: boolean;
          is_active: boolean;
          created_by: string | null;
        }>;
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & {
          email: string;
          full_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      access_level_permissions: {
        Row: RowWithTimestamps<{
          access_level_id: string;
          permission: string;
          granted: boolean;
        }>;
        Insert: Partial<Database["public"]["Tables"]["access_level_permissions"]["Row"]> & {
          access_level_id: string;
          permission: string;
        };
        Update: Partial<Database["public"]["Tables"]["access_level_permissions"]["Row"]>;
      };
      user_ranks: {
        Row: {
          id: string;
          user_id: string;
          rank_id: string;
          assigned_by: string | null;
          assigned_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["user_ranks"]["Row"]> & {
          user_id: string;
          rank_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_ranks"]["Row"]>;
      };
      committees: {
        Row: RowWithTimestamps<{
          name: string;
          description: string | null;
          created_by: string | null;
        }>;
        Insert: Partial<Database["public"]["Tables"]["committees"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["committees"]["Row"]>;
      };
      committee_members: {
        Row: {
          id: string;
          committee_id: string;
          user_id: string;
          role_in_committee: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["committee_members"]["Row"]> & {
          committee_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["committee_members"]["Row"]>;
      };
      officer_rosters: {
        Row: RowWithTimestamps<{
          school_year: string;
          is_active: boolean;
          achievements: string[];
          impact_summary: string | null;
          milestones: string[];
          president_quote: string | null;
          president_user_id: string | null;
        }>;
        Insert: Partial<Database["public"]["Tables"]["officer_rosters"]["Row"]> & {
          school_year: string;
        };
        Update: Partial<Database["public"]["Tables"]["officer_rosters"]["Row"]>;
      };
      officer_roster_entries: {
        Row: {
          id: string;
          roster_id: string;
          user_id: string;
          rank_id: string | null;
          position_title: string;
          committee_id: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["officer_roster_entries"]["Row"]> & {
          roster_id: string;
          user_id: string;
          position_title: string;
        };
        Update: Partial<Database["public"]["Tables"]["officer_roster_entries"]["Row"]>;
      };
      legacy_wall_entries: {
        Row: RowWithTimestamps<{
          roster_id: string;
          title: string;
          description: string;
          order_index: number;
          created_by: string | null;
        }>;
        Insert: Partial<Database["public"]["Tables"]["legacy_wall_entries"]["Row"]> & {
          roster_id: string;
          title: string;
          description: string;
        };
        Update: Partial<Database["public"]["Tables"]["legacy_wall_entries"]["Row"]>;
      };
      awards: {
        Row: RowWithTimestamps<{
          name: string;
          description: string | null;
          emblem_url: string | null;
          created_by: string | null;
        }>;
        Insert: Partial<Database["public"]["Tables"]["awards"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["awards"]["Row"]>;
      };
      user_awards: {
        Row: {
          id: string;
          user_id: string;
          award_id: string;
          awarded_by: string | null;
          awarded_at: string;
          note: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["user_awards"]["Row"]> & {
          user_id: string;
          award_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_awards"]["Row"]>;
      };
      posts: {
        Row: {
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
        };
        Insert: Partial<Database["public"]["Tables"]["posts"]["Row"]> & {
          title: string;
          slug: string;
          body: Json;
          post_type: Database["public"]["Tables"]["posts"]["Row"]["post_type"];
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
      };
      events: {
        Row: RowWithTimestamps<{
          title: string;
          description: string | null;
          start_at: string;
          end_at: string;
          location: string | null;
          is_registration_open: boolean;
          max_attendees: number | null;
          created_by: string | null;
        }>;
        Insert: Partial<Database["public"]["Tables"]["events"]["Row"]> & {
          title: string;
          start_at: string;
          end_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          registered_at: string;
          reminder_sent: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["event_registrations"]["Row"]> & {
          event_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["event_registrations"]["Row"]>;
      };
      polls: {
        Row: RowWithTimestamps<{
          title: string;
          description: string | null;
          poll_type: "single" | "multiple" | "ranked";
          visibility: string;
          min_access_level_id: string | null;
          is_anonymous: boolean;
          is_satisfaction_poll: boolean;
          closes_at: string | null;
          created_by: string | null;
        }>;
        Insert: Partial<Database["public"]["Tables"]["polls"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["polls"]["Row"]>;
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          label: string;
          order_index: number;
        };
        Insert: Partial<Database["public"]["Tables"]["poll_options"]["Row"]> & {
          poll_id: string;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["poll_options"]["Row"]>;
      };
      poll_votes: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          user_id: string | null;
          voted_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["poll_votes"]["Row"]> & {
          poll_id: string;
          option_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["poll_votes"]["Row"]>;
      };
      submissions: {
        Row: RowWithTimestamps<{
          submission_type: "concern" | "suggestion" | "complaint" | "feedback";
          subject: string;
          body: string;
          is_anonymous: boolean;
          submitter_id: string | null;
          status: "pending" | "reviewing" | "resolved" | "dismissed";
          assigned_to: string | null;
          internal_notes: string | null;
          resolved_at: string | null;
          is_public: boolean;
        }>;
        Insert: Partial<Database["public"]["Tables"]["submissions"]["Row"]> & {
          submission_type: Database["public"]["Tables"]["submissions"]["Row"]["submission_type"];
          subject: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["submissions"]["Row"]>;
      };
      submission_visibility: {
        Row: {
          id: string;
          access_level_id: string;
          submission_type: Database["public"]["Tables"]["submissions"]["Row"]["submission_type"];
          can_view: boolean;
          can_respond: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["submission_visibility"]["Row"]> & {
          access_level_id: string;
          submission_type: Database["public"]["Tables"]["submissions"]["Row"]["submission_type"];
        };
        Update: Partial<Database["public"]["Tables"]["submission_visibility"]["Row"]>;
      };
      suggestion_upvotes: {
        Row: {
          id: string;
          submission_id: string;
          user_id: string;
        };
        Insert: Partial<Database["public"]["Tables"]["suggestion_upvotes"]["Row"]> & {
          submission_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["suggestion_upvotes"]["Row"]>;
      };
      forum_channels: {
        Row: RowWithTimestamps<{
          name: string;
          slug: string;
          description: string | null;
          channel_type: "open" | "announcement" | "restricted";
          min_post_level_id: string | null;
          min_view_level_id: string | null;
          order_index: number;
          is_locked: boolean;
        }>;
        Insert: Partial<Database["public"]["Tables"]["forum_channels"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["forum_channels"]["Row"]>;
      };
      forum_threads: {
        Row: RowWithTimestamps<{
          channel_id: string;
          title: string;
          body: Json;
          author_id: string;
          is_pinned: boolean;
          is_locked: boolean;
          reply_count: number;
          last_reply_at: string;
        }>;
        Insert: Partial<Database["public"]["Tables"]["forum_threads"]["Row"]> & {
          channel_id: string;
          title: string;
          body: Json;
          author_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["forum_threads"]["Row"]>;
      };
      forum_replies: {
        Row: RowWithTimestamps<{
          thread_id: string;
          body: Json;
          author_id: string;
          is_deleted: boolean;
        }>;
        Insert: Partial<Database["public"]["Tables"]["forum_replies"]["Row"]> & {
          thread_id: string;
          body: Json;
          author_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["forum_replies"]["Row"]>;
      };
      forum_reactions: {
        Row: {
          id: string;
          target_type: "thread" | "reply";
          target_id: string;
          user_id: string;
          emoji: string;
        };
        Insert: Partial<Database["public"]["Tables"]["forum_reactions"]["Row"]> & {
          target_type: "thread" | "reply";
          target_id: string;
          user_id: string;
          emoji: string;
        };
        Update: Partial<Database["public"]["Tables"]["forum_reactions"]["Row"]>;
      };
      forum_reports: {
        Row: RowWithTimestamps<{
          target_type: "thread" | "reply";
          target_id: string;
          reporter_id: string | null;
          reason: string;
          resolved: boolean;
        }>;
        Insert: Partial<Database["public"]["Tables"]["forum_reports"]["Row"]> & {
          target_type: "thread" | "reply";
          target_id: string;
          reason: string;
        };
        Update: Partial<Database["public"]["Tables"]["forum_reports"]["Row"]>;
      };
      financial_summaries: {
        Row: {
          id: string;
          period: string;
          total_income: number;
          total_expenses: number;
          balance: number;
          summary_text: string | null;
          attachments: string[];
          published_by: string | null;
          published_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["financial_summaries"]["Row"]> & {
          period: string;
        };
        Update: Partial<Database["public"]["Tables"]["financial_summaries"]["Row"]>;
      };
      resolutions: {
        Row: {
          id: string;
          title: string;
          resolution_number: string;
          status: "pending" | "approved" | "rejected";
          body: string | null;
          meeting_date: string | null;
          approved_at: string | null;
          published_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["resolutions"]["Row"]> & {
          title: string;
          resolution_number: string;
        };
        Update: Partial<Database["public"]["Tables"]["resolutions"]["Row"]>;
      };
      qa_sessions: {
        Row: RowWithTimestamps<{
          title: string;
          event_id: string | null;
          is_open: boolean;
          transcript_post_id: string | null;
          created_by: string | null;
          opened_at: string | null;
          closed_at: string | null;
        }>;
        Insert: Partial<Database["public"]["Tables"]["qa_sessions"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["qa_sessions"]["Row"]>;
      };
      qa_questions: {
        Row: RowWithTimestamps<{
          session_id: string;
          body: string;
          submitter_id: string | null;
          is_anonymous: boolean;
          status: "queued" | "answered" | "skipped";
          answered_at: string | null;
        }>;
        Insert: Partial<Database["public"]["Tables"]["qa_questions"]["Row"]> & {
          session_id: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["qa_questions"]["Row"]>;
      };
    };
    Views: {
      current_user_permissions: {
        Row: {
          permission: string;
        };
      };
    };
    Functions: {
      has_permission: {
        Args: {
          perm: string;
        };
        Returns: boolean;
      };
      is_sysadmin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
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

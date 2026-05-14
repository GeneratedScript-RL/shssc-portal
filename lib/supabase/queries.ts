import type {
  ForumChannelRecord,
  ForumThreadRecord,
  LegacyHighlightRecord,
  LegacyRosterEntryRecord,
  PollRecord,
  PostRecord,
  SubmissionRecord,
  Tables,
  UserProfile,
} from "@/types";
import { createServiceRoleClient, safeQuery } from "@/lib/supabase/server";

export async function getLatestAnnouncements() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("post_type", "announcement")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(5);
    return (data ?? []) as PostRecord[];
  }, [] as PostRecord[]);
}

export async function getPublishedPosts(postType?: Tables<"posts">["post_type"]) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    let query = supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (postType) {
      query = query.eq("post_type", postType);
    }

    const { data } = await query;
    return (data ?? []) as PostRecord[];
  }, [] as PostRecord[]);
}

export async function getPostBySlug(slug: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return data as PostRecord | null;
  }, null as PostRecord | null);
}

export async function getUpcomingEvents(limit = 3) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .gt("start_at", new Date().toISOString())
      .order("start_at", { ascending: true })
      .limit(limit);

    return (data ?? []) as Tables<"events">[];
  }, [] as Tables<"events">[]);
}

export async function getAllEvents() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("events").select("*").order("start_at", { ascending: true });
    return (data ?? []) as Tables<"events">[];
  }, [] as Tables<"events">[]);
}

export async function getEventById(id: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const [{ data: event }, { count }] = await Promise.all([
      supabase.from("events").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", id),
    ]);

    return event ? { ...event, registrations: count ?? 0 } : null;
  }, null as (Tables<"events"> & { registrations: number }) | null);
}

export async function getPolls() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("polls").select("*").order("created_at", { ascending: false });
    return (data ?? []) as PollRecord[];
  }, [] as PollRecord[]);
}

export async function getPollById(id: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const [{ data: poll }, { data: options }] = await Promise.all([
      supabase.from("polls").select("*").eq("id", id).maybeSingle(),
      supabase.from("poll_options").select("*").eq("poll_id", id).order("order_index"),
    ]);

    return poll ? ({ ...poll, options: options ?? [] } as PollRecord) : null;
  }, null as PollRecord | null);
}

export async function getOpenSatisfactionPoll() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data: poll } = await supabase
      .from("polls")
      .select("*")
      .eq("is_satisfaction_poll", true)
      .or(`closes_at.is.null,closes_at.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!poll) {
      return null;
    }

    const { data: options } = await supabase
      .from("poll_options")
      .select("*")
      .eq("poll_id", poll.id)
      .order("order_index");

    return { ...poll, options: options ?? [] } as PollRecord;
  }, null as PollRecord | null);
}

export async function getSatisfactionHistory() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data: polls } = await supabase
      .from("polls")
      .select("id")
      .eq("is_satisfaction_poll", true);

    const pollIds = (polls ?? []).map((poll) => poll.id);
    if (!pollIds.length) {
      return [];
    }

    const [{ data: options }, { data: votes }] = await Promise.all([
      supabase.from("poll_options").select("id, label, poll_id").in("poll_id", pollIds),
      supabase.from("poll_votes").select("option_id, voted_at").in("poll_id", pollIds),
    ]);

    const optionLookup = new Map((options ?? []).map((option) => [option.id, Number(option.label) || 0]));
    const grouped = new Map<string, { total: number; count: number }>();

    for (const vote of votes ?? []) {
      const value = optionLookup.get(vote.option_id) ?? 0;
      const month = new Date(vote.voted_at).toISOString().slice(0, 7);
      const current = grouped.get(month) ?? { total: 0, count: 0 };
      grouped.set(month, { total: current.total + value, count: current.count + 1 });
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, summary]) => ({
        month,
        average: Number((summary.total / Math.max(summary.count, 1)).toFixed(2)),
      }));
  }, [] as Array<{ month: string; average: number }>);
}

export async function getLegacyRosters() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("officer_rosters")
      .select("*")
      .order("school_year", { ascending: false });
    return (data ?? []) as Tables<"officer_rosters">[];
  }, [] as Tables<"officer_rosters">[]);
}

export async function getRosterEntries(rosterId: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("officer_roster_entries")
      .select("*, ranks(id, name, color_hex), users(id, full_name, avatar_url)")
      .eq("roster_id", rosterId)
      .order("order_index", { ascending: true })
      .order("position_title", { ascending: true });

    const rosterEntries = (data ?? []) as any[];
    const userIds = Array.from(new Set(rosterEntries.map((entry) => entry.user_id)));
    const { data: awardLinks } = userIds.length
      ? await supabase
          .from("user_awards")
          .select("user_id, awards(id, name, emblem_url, description)")
          .in("user_id", userIds)
      : { data: [] as any[] };

    const awardsByUser = (awardLinks ?? []).reduce<
      Map<string, Pick<Tables<"awards">, "id" | "name" | "emblem_url" | "description">[]>
    >((acc, entry: any) => {
      const awards = acc.get(entry.user_id) ?? [];
      const award = Array.isArray(entry.awards) ? entry.awards[0] : entry.awards;

      if (award) {
        awards.push(award);
        acc.set(entry.user_id, awards);
      }

      return acc;
    }, new Map());

    return rosterEntries.map((entry: any) => ({
      ...entry,
      rank: Array.isArray(entry.ranks) ? entry.ranks[0] : entry.ranks,
      user: Array.isArray(entry.users) ? entry.users[0] : entry.users,
      awards: awardsByUser.get(entry.user_id) ?? [],
    })) as LegacyRosterEntryRecord[];
  }, [] as LegacyRosterEntryRecord[]);
}

export async function getLegacyWallEntries(rosterId?: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    let query = supabase
      .from("legacy_wall_entries")
      .select("id, roster_id, title, description, order_index, created_by, created_at, officer_rosters!inner(school_year)")
      .order("order_index", { ascending: true });

    if (rosterId) {
      query = query.eq("roster_id", rosterId);
    }

    const { data } = await query;

    return (data ?? []).map((entry: any) => ({
      id: entry.id,
      roster_id: entry.roster_id,
      title: entry.title,
      description: entry.description,
      order_index: entry.order_index,
      created_by: entry.created_by,
      created_at: entry.created_at,
      school_year: entry.officer_rosters?.school_year ?? "Unknown",
    })) as LegacyHighlightRecord[];
  }, [] as LegacyHighlightRecord[]);
}

export async function getRecognitionData() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const [awards, awardees] = await Promise.all([
      supabase.from("awards").select("*").order("created_at", { ascending: false }),
      supabase.from("user_awards").select("user_id, awards(name, emblem_url)").limit(18),
    ]);

    return {
      awards: (awards.data ?? []) as Tables<"awards">[],
      awardees: awardees.data ?? [],
    };
  }, { awards: [] as Tables<"awards">[], awardees: [] as any[] });
}

export async function getTransparencyData() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const [financials, resolutions] = await Promise.all([
      supabase
        .from("financial_summaries")
        .select("*")
        .order("published_at", { ascending: false }),
      supabase.from("resolutions").select("*").order("published_at", { ascending: false }),
    ]);

    return {
      financials: (financials.data ?? []) as Tables<"financial_summaries">[],
      resolutions: (resolutions.data ?? []) as Tables<"resolutions">[],
    };
  }, { financials: [] as Tables<"financial_summaries">[], resolutions: [] as Tables<"resolutions">[] });
}

export async function getForumChannels() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data: channels } = await supabase
      .from("forum_channels")
      .select("*")
      .order("order_index", { ascending: true });

    const withCounts = await Promise.all(
      (channels ?? []).map(async (channel) => {
        const { count, data: threadData } = await supabase
          .from("forum_threads")
          .select("last_reply_at", { count: "exact" })
          .eq("channel_id", channel.id)
          .order("last_reply_at", { ascending: false })
          .limit(1);

        return {
          ...channel,
          thread_count: count ?? 0,
          last_activity: threadData?.[0]?.last_reply_at ?? null,
        } as ForumChannelRecord;
      }),
    );

    return withCounts;
  }, [] as ForumChannelRecord[]);
}

export async function getForumChannelBySlug(slug: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("forum_channels")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return data as Tables<"forum_channels"> | null;
  }, null as Tables<"forum_channels"> | null);
}

export async function getForumThreads(channelId: string, page = 1) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const start = (page - 1) * 20;
    const end = start + 19;
    const { data } = await supabase
      .from("forum_threads")
      .select("*")
      .eq("channel_id", channelId)
      .order("is_pinned", { ascending: false })
      .order("last_reply_at", { ascending: false })
      .range(start, end);

    return (data ?? []) as ForumThreadRecord[];
  }, [] as ForumThreadRecord[]);
}

export async function getForumThread(threadId: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("forum_threads")
      .select("*")
      .eq("id", threadId)
      .maybeSingle();
    return data as Tables<"forum_threads"> | null;
  }, null as Tables<"forum_threads"> | null);
}

export async function getForumReplies(threadId: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("forum_replies")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    return (data ?? []) as Tables<"forum_replies">[];
  }, [] as Tables<"forum_replies">[]);
}

export async function getActiveQASession() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("qa_sessions")
      .select("*")
      .eq("is_open", true)
      .order("opened_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data as Tables<"qa_sessions"> | null;
  }, null as Tables<"qa_sessions"> | null);
}

export async function getQaQuestions(sessionId: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("qa_questions")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });
    return (data ?? []) as Tables<"qa_questions">[];
  }, [] as Tables<"qa_questions">[]);
}

export async function getPublicSuggestions() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data: suggestions } = await supabase
      .from("submissions")
      .select("*")
      .eq("submission_type", "suggestion")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    const withVotes = await Promise.all(
      (suggestions ?? []).map(async (submission) => {
        const { count } = await supabase
          .from("suggestion_upvotes")
          .select("*", { count: "exact", head: true })
          .eq("submission_id", submission.id);

        return {
          ...submission,
          upvotes: count ?? 0,
        } as SubmissionRecord;
      }),
    );

    return withVotes;
  }, [] as SubmissionRecord[]);
}

export async function getUserProfile(userId: string) {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const [{ data: user }, { data: ranks }, { data: awards }] = await Promise.all([
      supabase.from("users").select("*, access_levels(*)").eq("id", userId).maybeSingle(),
      supabase.from("user_ranks").select("ranks(*)").eq("user_id", userId),
      supabase.from("user_awards").select("awards(*)").eq("user_id", userId),
    ]);

    if (!user) {
      return null;
    }

    return {
      ...user,
      access_level: Array.isArray((user as any).access_levels) ? (user as any).access_levels[0] : (user as any).access_levels,
      ranks: (ranks ?? []).map((entry: any) => entry.ranks).filter(Boolean),
      awards: (awards ?? []).map((entry: any) => entry.awards).filter(Boolean),
    } as UserProfile;
  }, null as UserProfile | null);
}

export async function getUsersWithAccessLevels() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("users")
      .select("*, access_levels(*)")
      .order("created_at", { ascending: false });

    return (data ?? []).map((user: any) => ({
      ...user,
      access_level: Array.isArray(user.access_levels) ? user.access_levels[0] : user.access_levels,
    })) as UserProfile[];
  }, [] as UserProfile[]);
}

export async function getAccessLevels() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("access_levels")
      .select("*")
      .order("hierarchy_order", { ascending: true });
    return (data ?? []) as Tables<"access_levels">[];
  }, [] as Tables<"access_levels">[]);
}

export async function getAccessLevelAssignments() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("access_level_permissions").select("*");

    return (data ?? []).reduce<Record<string, Record<string, boolean>>>((acc, row) => {
      acc[row.access_level_id] = acc[row.access_level_id] ?? {};
      acc[row.access_level_id][row.permission] = row.granted;
      return acc;
    }, {});
  }, {} as Record<string, Record<string, boolean>>);
}

export async function getRanks() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("ranks").select("*").order("hierarchy_order");
    return (data ?? []) as Tables<"ranks">[];
  }, [] as Tables<"ranks">[]);
}

export async function getAwards() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("awards").select("*").order("created_at", { ascending: false });
    return (data ?? []) as Tables<"awards">[];
  }, [] as Tables<"awards">[]);
}

export async function getCommittees() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("committees").select("*").order("name");
    return (data ?? []) as Tables<"committees">[];
  }, [] as Tables<"committees">[]);
}

export async function getRosters() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("officer_rosters").select("*").order("school_year", { ascending: false });
    return (data ?? []) as Tables<"officer_rosters">[];
  }, [] as Tables<"officer_rosters">[]);
}

export async function getSubmissions() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });
    return (data ?? []) as SubmissionRecord[];
  }, [] as SubmissionRecord[]);
}

export async function getAdminDashboardStats() {
  return safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const counts = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("polls").select("*", { count: "exact", head: true }),
      supabase.from("submissions").select("*", { count: "exact", head: true }),
    ]);

    return {
      users: counts[0].count ?? 0,
      events: counts[1].count ?? 0,
      polls: counts[2].count ?? 0,
      submissions: counts[3].count ?? 0,
    };
  }, { users: 0, events: 0, polls: 0, submissions: 0 });
}

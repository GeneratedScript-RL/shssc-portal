# SHSSC Portal — Codex Build Prompt

You are building a full-stack web application called the **SHSSC Portal** — a student council management system for a Senior High School Student Council. Build the entire project from scratch following every specification below exactly. Do not skip any section. Do not add features not listed. Do not use placeholder logic — all implementations must be functional.

---

## STACK

Use exactly these technologies. Do not substitute.

- **Framework**: Next.js 14, App Router, TypeScript strict mode
- **Styling**: Tailwind CSS + shadcn/ui component library
- **Database + Auth + Storage + Realtime**: Supabase (single project)
- **State**: Zustand for client state
- **Forms**: React Hook Form + Zod schemas (all forms, no exceptions)
- **Rich text**: TipTap editor (posts, forum threads, announcements)
- **Email**: Resend SDK (transactional only — verification, event reminders)
- **Analytics**: `@vercel/analytics` (no PII, no third-party trackers)
- **Deployment**: Vercel (free tier), environment variables via Vercel dashboard

Do not use Prisma, tRPC, NextAuth, or any ORM. All DB access goes through the Supabase JS client. All server-side DB calls use the Supabase service role client inside Next.js Route Handlers or Server Components. All client-side DB calls use the anon client subject to Row Level Security.

---

## REPOSITORY STRUCTURE

Scaffold exactly this directory tree:

```
shssc-portal/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                      # /  — Home dashboard
│   │   ├── about/page.tsx                # /about
│   │   ├── news/page.tsx                 # /news
│   │   ├── news/[slug]/page.tsx          # /news/[slug]
│   │   ├── events/page.tsx               # /events
│   │   ├── events/[id]/page.tsx          # /events/[id]
│   │   ├── vote/page.tsx                 # /vote
│   │   ├── vote/[id]/page.tsx            # /vote/[id]
│   │   ├── transparency/page.tsx         # /transparency
│   │   ├── transparency/by-laws/page.tsx # /transparency/by-laws
│   │   ├── officers/page.tsx             # /officers
│   │   ├── legacy/page.tsx               # /legacy
│   │   ├── recognition/page.tsx          # /recognition
│   │   ├── forums/page.tsx               # /forums
│   │   ├── forums/[channel]/page.tsx     # /forums/[channel]
│   │   ├── forums/[channel]/[thread]/page.tsx
│   │   └── ask/page.tsx                  # /ask — Live Q&A
│   ├── (portal)/
│   │   ├── portal/page.tsx               # /portal — Submit concern
│   │   └── portal/tracker/page.tsx       # /portal/tracker
│   ├── (profile)/
│   │   ├── profile/me/page.tsx           # /profile/me
│   │   └── profile/[id]/page.tsx         # /profile/[id]
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx                # Admin shell + sidebar
│   │       ├── dashboard/page.tsx
│   │       ├── users/page.tsx
│   │       ├── users/[id]/page.tsx
│   │       ├── access-levels/page.tsx
│   │       ├── ranks/page.tsx
│   │       ├── awards/page.tsx
│   │       ├── committees/page.tsx
│   │       ├── roster/page.tsx
│   │       ├── posts/page.tsx
│   │       ├── posts/[id]/page.tsx
│   │       ├── events/page.tsx
│   │       ├── polls/page.tsx
│   │       ├── submissions/page.tsx
│   │       ├── forums/page.tsx
│   │       ├── transparency/page.tsx
│   │       ├── recognition/page.tsx
│   │       └── settings/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   └── callback/route.ts
│   │   ├── users/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── access-levels/
│   │   │   ├── route.ts
│   │   │   └── [id]/permissions/route.ts
│   │   ├── ranks/route.ts
│   │   ├── awards/route.ts
│   │   ├── committees/route.ts
│   │   ├── roster/route.ts
│   │   ├── posts/route.ts
│   │   ├── events/route.ts
│   │   ├── polls/
│   │   │   ├── route.ts
│   │   │   └── [id]/vote/route.ts
│   │   ├── submissions/route.ts
│   │   ├── forums/
│   │   │   ├── channels/route.ts
│   │   │   ├── threads/route.ts
│   │   │   └── replies/route.ts
│   │   ├── ask/
│   │   │   ├── sessions/route.ts
│   │   │   └── [id]/questions/route.ts
│   │   └── suggestions/
│   │       ├── route.ts
│   │       └── [id]/upvote/route.ts
│   └── layout.tsx                        # Root layout with Supabase session provider
├── components/
│   ├── ui/                               # shadcn/ui primitives (Button, Input, Dialog, etc.)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── MobileNav.tsx
│   ├── shared/
│   │   ├── UserBadge.tsx                 # Renders rank color chip + award emblems for a user
│   │   ├── AwardEmblem.tsx               # Single award icon with tooltip
│   │   ├── RankChip.tsx                  # Colored rank pill
│   │   ├── RichTextRenderer.tsx          # Renders TipTap JSON to HTML
│   │   ├── RichTextEditor.tsx            # TipTap editor component
│   │   ├── PermissionGate.tsx            # Conditionally renders children based on permission
│   │   └── EmailInput.tsx            # Email input with uniqueness error state
│   └── features/
│       ├── home/
│       │   ├── AnnouncementsCarousel.tsx
│       │   ├── QuickLinks.tsx
│       │   └── SatisfactionPollWidget.tsx
│       ├── events/
│       │   ├── EventCalendar.tsx
│       │   ├── EventCard.tsx
│       │   └── RegistrationButton.tsx
│       ├── polls/
│       │   ├── PollCard.tsx
│       │   ├── PollVoteForm.tsx
│       │   └── PollResultsChart.tsx      # Recharts bar chart
│       ├── forums/
│       │   ├── ChannelList.tsx
│       │   ├── ThreadList.tsx
│       │   ├── ThreadCard.tsx
│       │   ├── ThreadDetail.tsx
│       │   ├── ReplyComposer.tsx
│       │   └── ReactionBar.tsx
│       ├── legacy/
│       │   ├── YearSelector.tsx
│       │   ├── RosterGrid.tsx
│       │   ├── AchievementsList.tsx
│       │   └── LegacyWall.tsx
│       ├── ask/
│       │   ├── LiveQASession.tsx         # Realtime question list
│       │   ├── QuestionSubmitForm.tsx
│       │   └── QuestionModerationPanel.tsx
│       └── admin/
│           ├── UsersTable.tsx
│           ├── PermissionsGrid.tsx       # Checkbox matrix: access levels × permissions
│           ├── RankManager.tsx
│           ├── AwardManager.tsx
│           ├── CommitteeManager.tsx
│           ├── RosterEditor.tsx
│           ├── SubmissionsTable.tsx
│           └── ForumChannelManager.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # createBrowserClient()
│   │   ├── server.ts                     # createServerClient() for Server Components
│   │   └── middleware.ts                 # createMiddlewareClient()
│   ├── auth/
│   │   ├── getSession.ts                 # Server-side session helper
│   │   └── requirePermission.ts          # Throws 403 if user lacks permission
│   ├── rbac/
│   │   ├── permissions.ts                # Canonical permission key list (const enum)
│   │   ├── checkPermission.ts            # (userId, permission) => boolean via DB lookup
│   │   └── getUserPermissions.ts         # Returns string[] of all granted permissions
│   └── utils/
│       ├── slugify.ts
│       ├── formatDate.ts
│       └── anonymize.ts                  # Strips PII from submission objects
├── hooks/
│   ├── usePermissions.ts                 # Client hook: returns user's permissions array
│   ├── useRealtime.ts                    # Generic Supabase Realtime subscription hook
│   ├── usePoll.ts
│   └── useLiveQA.ts
├── types/
│   └── index.ts                          # All DB row types, inferred from Supabase codegen
├── stores/
│   └── authStore.ts                      # Zustand store: session, user profile, permissions
├── supabase/
│   ├── migrations/
│   │   ├── 001_identity.sql
│   │   ├── 002_committees_roster.sql
│   │   ├── 003_awards.sql
│   │   ├── 004_content.sql
│   │   ├── 005_events.sql
│   │   ├── 006_polls.sql
│   │   ├── 007_submissions.sql
│   │   ├── 008_forums.sql
│   │   ├── 009_transparency.sql
│   │   ├── 010_ask.sql
│   │   ├── 011_rls.sql
│   │   └── 012_seed_defaults.sql
│   └── functions/
│       └── send-event-reminders/index.ts # Deno edge function, cron-triggered
├── middleware.ts                          # Route protection: redirect unauthenticated users
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.local.example
```

---

## DATABASE MIGRATIONS

Write all migrations as valid PostgreSQL. Run them in numeric order. Enable `uuid-ossp` extension. All `id` columns are `uuid DEFAULT uuid_generate_v4() PRIMARY KEY`. All timestamps are `timestamptz DEFAULT now()`. Use `text` not `varchar`.

### Migration 001 — Identity & Access Control

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE access_levels (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  hierarchy_order integer NOT NULL DEFAULT 0,
  is_sysadmin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE ranks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  color_hex text NOT NULL DEFAULT '#888888',
  hierarchy_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@gendejesus\.edu\.ph$'),
  full_name text NOT NULL,
  avatar_url text,
  access_level_id uuid REFERENCES access_levels(id),
  privacy_consent boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

CREATE TABLE access_level_permissions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  access_level_id uuid NOT NULL REFERENCES access_levels(id) ON DELETE CASCADE,
  permission text NOT NULL,
  granted boolean NOT NULL DEFAULT true,
  UNIQUE (access_level_id, permission)
);

CREATE TABLE user_ranks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank_id uuid NOT NULL REFERENCES ranks(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES users(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE (user_id, rank_id)
);
```

### Migration 002 — Committees & Officer Roster

```sql
CREATE TABLE committees (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE committee_members (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  committee_id uuid NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_in_committee text,
  UNIQUE (committee_id, user_id)
);

CREATE TABLE officer_rosters (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_year text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT false,
  achievements text[] NOT NULL DEFAULT '{}',
  impact_summary text,
  milestones text[] NOT NULL DEFAULT '{}',
  president_quote text,
  president_user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE officer_roster_entries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  roster_id uuid NOT NULL REFERENCES officer_rosters(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  rank_id uuid REFERENCES ranks(id),
  position_title text NOT NULL,
  committee_id uuid REFERENCES committees(id)
);
```

### Migration 003 — Awards

```sql
CREATE TABLE awards (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  emblem_url text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_awards (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  award_id uuid NOT NULL REFERENCES awards(id) ON DELETE CASCADE,
  awarded_by uuid REFERENCES users(id),
  awarded_at timestamptz DEFAULT now(),
  note text,
  UNIQUE (user_id, award_id)
);
```

### Migration 004 — Content / Posts

```sql
CREATE TABLE posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body jsonb NOT NULL DEFAULT '{}',
  post_type text NOT NULL CHECK (post_type IN ('news','memorandum','announcement','resolution','minutes')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  author_id uuid REFERENCES users(id),
  published_at timestamptz,
  attachments text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_posts_type_status ON posts(post_type, status);
CREATE INDEX idx_posts_slug ON posts(slug);
```

### Migration 005 — Events

```sql
CREATE TABLE events (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  location text,
  is_registration_open boolean NOT NULL DEFAULT true,
  max_attendees integer,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE event_registrations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  reminder_sent boolean NOT NULL DEFAULT false,
  UNIQUE (event_id, user_id)
);
```

### Migration 006 — Polls & Voting

```sql
CREATE TABLE polls (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  poll_type text NOT NULL DEFAULT 'single' CHECK (poll_type IN ('single','multiple','ranked')),
  visibility text NOT NULL DEFAULT 'all',
  min_access_level_id uuid REFERENCES access_levels(id),
  is_anonymous boolean NOT NULL DEFAULT false,
  closes_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE poll_options (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  label text NOT NULL,
  order_index integer NOT NULL DEFAULT 0
);

CREATE TABLE poll_votes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  voted_at timestamptz DEFAULT now(),
  UNIQUE (poll_id, user_id, option_id)
);
```

### Migration 007 — Submissions (Concerns / Complaints / Suggestions)

```sql
CREATE TABLE submissions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_type text NOT NULL CHECK (submission_type IN ('concern','suggestion','complaint','feedback')),
  subject text NOT NULL,
  body text NOT NULL,
  is_anonymous boolean NOT NULL DEFAULT false,
  submitter_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewing','resolved','dismissed')),
  assigned_to uuid REFERENCES users(id),
  internal_notes text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE submission_visibility (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  access_level_id uuid NOT NULL REFERENCES access_levels(id) ON DELETE CASCADE,
  submission_type text NOT NULL,
  can_view boolean NOT NULL DEFAULT false,
  can_respond boolean NOT NULL DEFAULT false,
  UNIQUE (access_level_id, submission_type)
);

-- Public suggestion tracker: upvotes (anonymous count, no PII)
CREATE TABLE suggestion_upvotes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (submission_id, user_id)
);
```

### Migration 008 — Forums

```sql
CREATE TABLE forum_channels (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  channel_type text NOT NULL DEFAULT 'open' CHECK (channel_type IN ('open','announcement','restricted')),
  min_post_level_id uuid REFERENCES access_levels(id),
  min_view_level_id uuid REFERENCES access_levels(id),
  order_index integer NOT NULL DEFAULT 0,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE forum_threads (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  channel_id uuid NOT NULL REFERENCES forum_channels(id) ON DELETE CASCADE,
  title text NOT NULL,
  body jsonb NOT NULL DEFAULT '{}',
  author_id uuid NOT NULL REFERENCES users(id),
  is_pinned boolean NOT NULL DEFAULT false,
  is_locked boolean NOT NULL DEFAULT false,
  reply_count integer NOT NULL DEFAULT 0,
  last_reply_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE forum_replies (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  thread_id uuid NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  body jsonb NOT NULL DEFAULT '{}',
  author_id uuid NOT NULL REFERENCES users(id),
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE forum_reactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  target_type text NOT NULL CHECK (target_type IN ('thread','reply')),
  target_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  UNIQUE (target_type, target_id, user_id, emoji)
);

CREATE TABLE forum_reports (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  target_type text NOT NULL CHECK (target_type IN ('thread','reply')),
  target_id uuid NOT NULL,
  reporter_id uuid REFERENCES users(id),
  reason text NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

### Migration 009 — Transparency

```sql
CREATE TABLE financial_summaries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  period text NOT NULL,
  total_income numeric(12,2) NOT NULL DEFAULT 0,
  total_expenses numeric(12,2) NOT NULL DEFAULT 0,
  balance numeric(12,2) GENERATED ALWAYS AS (total_income - total_expenses) STORED,
  summary_text text,
  attachments text[] NOT NULL DEFAULT '{}',
  published_by uuid REFERENCES users(id),
  published_at timestamptz DEFAULT now()
);

CREATE TABLE resolutions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  resolution_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  body text,
  meeting_date date,
  approved_at timestamptz,
  published_at timestamptz
);
```

### Migration 010 — Ask the Council (Live Q&A)

```sql
CREATE TABLE qa_sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  event_id uuid REFERENCES events(id),
  is_open boolean NOT NULL DEFAULT false,
  transcript_post_id uuid REFERENCES posts(id),
  created_by uuid REFERENCES users(id),
  opened_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE qa_questions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES qa_sessions(id) ON DELETE CASCADE,
  body text NOT NULL,
  submitter_id uuid REFERENCES users(id),
  is_anonymous boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','answered','skipped')),
  answered_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

### Migration 011 — Row Level Security

Enable RLS on every table. Write policies using `auth.uid()` and joins through `users` and `access_level_permissions`.

Key policies to implement:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_questions ENABLE ROW LEVEL SECURITY;
-- (repeat for every table)

-- Helper view: resolves current user's permissions
CREATE OR REPLACE VIEW current_user_permissions AS
  SELECT alp.permission
  FROM users u
  JOIN access_level_permissions alp ON alp.access_level_id = u.access_level_id
  WHERE u.auth_id = auth.uid()
    AND alp.granted = true;

-- Helper function: check single permission
CREATE OR REPLACE FUNCTION has_permission(perm text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM current_user_permissions WHERE permission = perm
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: is sysadmin
CREATE OR REPLACE FUNCTION is_sysadmin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM users u
    JOIN access_levels al ON al.id = u.access_level_id
    WHERE u.auth_id = auth.uid() AND al.is_sysadmin = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- posts: published posts are public; drafts only visible to author + has_permission('post:news')
CREATE POLICY "posts_select_published" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "posts_select_own_draft" ON posts
  FOR SELECT USING (
    author_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "posts_insert" ON posts
  FOR INSERT WITH CHECK (
    has_permission('post:news') OR has_permission('post:announcement') OR
    has_permission('post:memorandum') OR is_sysadmin()
  );

CREATE POLICY "posts_update" ON posts
  FOR UPDATE USING (
    author_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    OR is_sysadmin()
  );

-- submissions: viewers see only what their level allows
CREATE POLICY "submissions_insert" ON submissions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "submissions_select_own" ON submissions
  FOR SELECT USING (
    submitter_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    AND NOT is_anonymous
  );

CREATE POLICY "submissions_select_privileged" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM submission_visibility sv
      JOIN users u ON u.access_level_id = sv.access_level_id
      WHERE u.auth_id = auth.uid()
        AND sv.submission_type = submissions.submission_type
        AND sv.can_view = true
    )
    OR is_sysadmin()
  );

-- Anonymous submissions: strip submitter_id unless sysadmin
CREATE POLICY "anon_submission_identity" ON submissions
  FOR SELECT USING (
    NOT is_anonymous
    OR submitter_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    OR is_sysadmin()
  );

-- poll_votes: user can only see their own votes; insert if authenticated and poll is open
CREATE POLICY "poll_votes_insert" ON poll_votes
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM polls p
      WHERE p.id = poll_votes.poll_id
        AND (p.closes_at IS NULL OR p.closes_at > now())
    )
  );

CREATE POLICY "poll_votes_select_own" ON poll_votes
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- forum_threads and forum_replies: visibility based on channel's min_view_level
CREATE POLICY "forum_threads_select" ON forum_threads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM forum_channels fc
      LEFT JOIN access_levels al ON al.id = fc.min_view_level_id
      JOIN users u ON u.auth_id = auth.uid()
      JOIN access_levels ual ON ual.id = u.access_level_id
      WHERE fc.id = forum_threads.channel_id
        AND (fc.min_view_level_id IS NULL OR ual.hierarchy_order >= al.hierarchy_order)
    )
  );

CREATE POLICY "forum_threads_insert" ON forum_threads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM forum_channels fc
      LEFT JOIN access_levels al ON al.id = fc.min_post_level_id
      JOIN users u ON u.auth_id = auth.uid()
      JOIN access_levels ual ON ual.id = u.access_level_id
      WHERE fc.id = forum_threads.channel_id
        AND NOT fc.is_locked
        AND (fc.min_post_level_id IS NULL OR ual.hierarchy_order >= al.hierarchy_order)
    )
  );
```

Write analogous policies for all remaining tables following the same pattern.

### Migration 012 — Seed Defaults

```sql
-- Default access levels
INSERT INTO access_levels (name, hierarchy_order, is_sysadmin) VALUES
  ('Student', 10, false),
  ('Grade Level Representative', 20, false),
  ('Committee Member', 30, false),
  ('Officer', 40, false),
  ('Sysadmin', 100, true);

-- Default permissions per level
-- Officer level: insert all manage:* and post:* permissions with granted = true
-- Student level: no manage:* permissions
-- (Codex: generate the full cross-product insert statements for all permission keys below)

-- Default forum channels
INSERT INTO forum_channels (name, slug, description, channel_type, order_index) VALUES
  ('Questions', 'questions', 'Ask anything. Open to all.', 'open', 1),
  ('Bulletin', 'bulletin', 'Rules and official announcements.', 'announcement', 0),
  ('Suggestions', 'suggestions', 'Submit ideas for the council.', 'open', 2),
  ('Council Updates', 'council-updates', 'Updates from officers.', 'restricted', 3);
```

---

## PERMISSION KEYS

Define these as a `const` object in `lib/rbac/permissions.ts`. These are the only valid permission strings in the system:

```typescript
export const PERMISSIONS = {
  POST_ANNOUNCEMENT:    'post:announcement',
  POST_NEWS:            'post:news',
  POST_MEMORANDUM:      'post:memorandum',
  MANAGE_EVENTS:        'manage:events',
  MANAGE_POLLS:         'manage:polls',
  MANAGE_MINUTES:       'manage:minutes',
  MANAGE_RESOLUTIONS:   'manage:resolutions',
  MANAGE_FINANCIALS:    'manage:financials',
  VIEW_COMPLAINTS:      'view:complaints',
  RESPOND_COMPLAINTS:   'respond:complaints',
  MANAGE_USERS:         'manage:users',
  MANAGE_ROLES:         'manage:roles',
  MANAGE_COMMITTEES:    'manage:committees',
  MANAGE_AWARDS:        'manage:awards',
  MANAGE_ROSTER:        'manage:roster',
  MODERATE_FORUMS:      'moderate:forums',
  POST_BULLETIN:        'post:bulletin',
  LIVE_QA_RESPOND:      'live_qa:respond',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
```

---

## AUTH SYSTEM

### Registration flow (`/api/auth/register`)

1. Validate request body with Zod: `{ email: z.string().email().refine(e => e.endsWith('@gendejesus.edu.ph')), password: z.string().min(8), full_name: z.string().min(2), privacy_consent: z.literal(true) }`
2. Check if email exists in users table. If so, return 400 { error: 'Email already registered.' }.
3. Call `supabase.auth.admin.createUser({ email, password, email_confirm: false })` using service role client.
4. Insert into `users` table with `auth_id = result.user.id` and the default `Student` access level.
5. Send verification email via Supabase Auth's built-in flow.
6. Return `201`.

### Sysadmin account creation (`POST /api/users`)

1. Require `is_sysadmin()` on caller.
2. Same email ID uniqueness check.
3. Accept `access_level_id` in body. Apply it directly.
4. Send invite email via `supabase.auth.admin.inviteUserByEmail()`.

### Middleware (`middleware.ts`)

Protect all routes under `/(portal)`, `/(profile)`, and `/(admin)` by checking for a valid Supabase session. Redirect unauthenticated requests to `/auth/login`. For `/(admin)` routes, additionally call `has_permission()` or `is_sysadmin()` — return 403 if the user lacks access.

---

## RBAC IMPLEMENTATION

### `lib/rbac/checkPermission.ts`

```typescript
import { createServerClient } from '@/lib/supabase/server';

export async function checkPermission(userId: string, permission: Permission): Promise<boolean> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('access_level_permissions')
    .select('granted')
    .eq('permission', permission)
    .eq('granted', true)
    .in('access_level_id', supabase
      .from('users')
      .select('access_level_id')
      .eq('id', userId)
    )
    .maybeSingle();
  return !!data;
}
```

### `components/shared/PermissionGate.tsx`

Client component. Reads permissions from Zustand `authStore`. Renders children only if user has the required permission. Accepts `permission: Permission` prop. If user lacks it, renders `null` or a `fallback` prop.

### `stores/authStore.ts`

```typescript
interface AuthStore {
  user: UserProfile | null;
  permissions: Permission[];
  isSysadmin: boolean;
  setUser: (user: UserProfile | null) => void;
  setPermissions: (perms: Permission[]) => void;
  hydrate: () => Promise<void>;  // fetches /api/auth/me and populates store
}
```

---

## FEATURE IMPLEMENTATIONS

### Home Dashboard (`/`)

Render four sections as React Server Components with ISR (`revalidate: 60`):

1. **Announcements carousel** — fetch latest 5 published posts where `post_type = 'announcement'`, ordered by `published_at DESC`. Render as an auto-advancing carousel (CSS-only, no JS library). Each card shows title, excerpt (first 120 chars of body text), date.
2. **Quick links** — static grid: Events, Submit Concern, Active Polls, Forums, Transparency.
3. **Upcoming events strip** — next 3 events where `start_at > now()`, ordered ascending.
4. **Student Satisfaction Poll widget** — find the most recent open poll tagged as satisfaction poll. If open, show a 1–5 star vote form. Always show a mini sparkline of historical monthly averages using `recharts`.

### Events System

**Calendar view** (`/events`): Use `react-big-calendar` for month/week/list views. Fetch all events for the visible month range. Color-code by registration status.

**Registration** (`POST /api/events/[id]/register`): Check `max_attendees` — if set, count existing registrations; reject if full. Insert into `event_registrations`. Return 409 if already registered.

**Email reminders** (Edge Function `send-event-reminders`): Cron trigger 24h before `start_at`. Query `event_registrations WHERE reminder_sent = false AND events.start_at < now() + interval '25 hours'`. Send via Resend. Batch update `reminder_sent = true`.

### Polls / Voting

**Vote submission** (`POST /api/polls/[id]/vote`): Validate user hasn't already voted (check `poll_votes` with `UNIQUE` constraint). For `single` polls enforce one option. For `multiple` polls accept array. Insert all vote rows in a transaction. Return updated vote counts.

**Results** (`/vote/[id]`): Show `PollResultsChart` (Recharts `BarChart`, horizontal). If `is_anonymous = true`, never expose individual voter identities.

**Satisfaction Poll Tracker**: A separate section on `/vote` showing a Recharts `LineChart` of monthly average satisfaction scores. Query `poll_votes` joined to `poll_options` for polls tagged as satisfaction, group by month, compute average.

### Legacy / Past Officers Page (`/legacy`)

Page is a Server Component. On load, fetch all `officer_rosters` ordered by `school_year DESC`. Render:

1. `YearSelector` — dropdown, changes URL param `?year=2024-2025`.
2. For the selected year, render:
   - Officer grid: 3-col on desktop, 1-col on mobile. Each card: avatar, name, position title, rank chip(s), award emblems.
   - Committees list for that year.
   - Achievements list (bulleted).
   - Impact summary paragraph.
   - Milestones list.
   - President quote in a `<blockquote>`.
3. **Legacy Wall** section at bottom (all years): top-pinned achievements sorted by sysadmin `order_index`, rendered as large cards with school year badge.

### Forums

**Channel list** (`/forums`): Show all channels user has read access to (enforced by RLS). Show `#bulletin` first. Display thread count and last activity time.

**Thread list** (`/forums/[channel]`): Paginate 20 threads per page. Pinned threads always at top. Each row: author avatar + rank chip, title, reply count, last reply timestamp.

**Thread detail** (`/forums/[channel]/[thread]`): Render OP body via `RichTextRenderer`. Below, render replies in chronological order. Each reply shows author with `UserBadge`. Add `ReactionBar` below each post. Add `ReplyComposer` (TipTap) at the bottom if user has post access to this channel.

**Realtime**: Subscribe to `forum_replies` insert events on the current thread via `useRealtime`. Append new replies without full page reload.

**Moderation**: Users with `moderate:forums` permission see Pin / Lock / Delete buttons on all threads and replies. Delete is soft-delete (`is_deleted = true`), renders as "[deleted]".

### Ask the Council (Live Q&A)

**Session management**: Officers with `live_qa:respond` create a `qa_session`. Toggle `is_open` to open/close. On close, export all answered questions as a post (save to `posts` with `post_type = 'minutes'`).

**Student view** (`/ask`): If a session is open, show `QuestionSubmitForm`. Submitted questions appear in the queue. Use Supabase Realtime to subscribe to `qa_questions` updates. Questions animate in as they arrive.

**Officer moderation panel**: Shows all questions for the active session in three columns: Queued, Answered, Skipped. Drag-and-drop (using `@dnd-kit/core`) between columns updates `status`.

### Suggestion Tracker

Public page under `/portal/tracker` (also embedded on `/portal`). Shows all submissions with `submission_type = 'suggestion'` where `is_anonymous = true` or submitter has consented to public display. Strips all PII via `anonymize()` utility. Columns: Subject, Status badge, Upvote count. Authenticated users can click upvote (calls `POST /api/suggestions/[id]/upvote`). Status updated by officers from admin panel.

### Admin Panel

All admin routes are wrapped by `(admin)/admin/layout.tsx` which renders `AdminSidebar` and enforces permissions. Each sidebar item only renders if the user has the corresponding permission.

**Permissions Grid** (`/admin/access-levels`): Render a full matrix table. Rows = access levels, columns = all permission keys from `PERMISSIONS`. Each cell is a checkbox. Toggling a checkbox calls `PATCH /api/access-levels/[id]/permissions` with `{ permission, granted }`. Optimistically update UI, revert on error.

**Roster Editor** (`/admin/roster`): Select school year. Show current entries in a table. Add entry form: search user by name, select position title, select rank from `ranks` table, optionally assign committee. Save inserts into `officer_roster_entries`. Sysadmin can also edit legacy (past) rosters.

**User detail** (`/admin/users/[id]`): Show all user info. Dropdowns to change access level. Multi-select to assign/remove ranks. Multi-select to assign/remove awards. Toggle `is_active`. Cannot delete — only deactivate.

---

## SHARED COMPONENTS

### `UserBadge.tsx`

Props: `userId: string`, `size?: 'sm' | 'md' | 'lg'`

Renders: avatar, full name, highest-priority rank chip (colored per `rank.color_hex`), then up to 3 award emblems as 16×16px images with a tooltip showing the award name on hover. Fetches data from a Supabase join query of `users + user_ranks + ranks + user_awards + awards`.

### `PermissionGate.tsx`

```typescript
interface Props {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}
```

Reads from `authStore.permissions`. If permission not present and `isSysadmin` is false, render `fallback ?? null`.

### `RichTextEditor.tsx`

Wrap TipTap with extensions: StarterKit, Link, Image (Supabase Storage upload handler), Placeholder. Expose `value: JSONContent` and `onChange: (v: JSONContent) => void` props. Used for all post creation, forum thread/reply composition.

---

## ENVIRONMENT VARIABLES

Define all of these in `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. Use it only in Route Handlers and Server Components.

---

## DESIGN SYSTEM

School colors: `#F5C400` (yellow), `#2D7D32` (green), `#FFFFFF` (white), `#A8D500` (lime), `#F57C00` (orange).

Configure in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        yellow: '#F5C400',
        green:  '#2D7D32',
        lime:   '#A8D500',
        orange: '#F57C00',
        white: '#FFFFFF'
      }
    }
  }
}
```

Design principles: clean, minimal, card-based, high contrast. Mobile-first. Sidebar collapses to bottom nav on mobile. All interactive elements must have a minimum 44×44px touch target. Use shadcn/ui as the base component layer — do not override shadcn styles globally, extend with Tailwind utilities at the component level.

-- Ive included a icon.jpg which is the icon emblem of the student council.
-- design a green header at the top, which in the center left of the green header will hold the student council emblem, and on the right side of the header will include all the tabs. Below the header will be the main page.
-- design the panels for role/access/rank management and other sys admin panels similar to roblox group management
-- for the announcements, design it like discord forums, where you see a bunch of rectangles with each rectangle having a title, and a description at the bottom, and opening the rectangle will open a panel on the side giving the full text.

---

## PERFORMANCE REQUIREMENTS

- All public pages (`/`, `/news`, `/events`, `/officers`, `/legacy`, `/recognition`, `/transparency`) must use `export const revalidate = 60` (ISR). Do not use `force-dynamic` on these routes.
- All images must use `next/image` with explicit `width` and `height`. Never use raw `<img>` tags.
- Fonts: use `next/font/google` to self-host. Use `Inter` for body, `Sora` for headings.
- No third-party scripts loaded in `<head>`. Vercel Analytics only.
- Forum realtime subscriptions must unsubscribe on component unmount. No memory leaks.

---

## ACCESSIBILITY

- All interactive elements must have `aria-label` or visible text.
- Color contrast must meet WCAG AA.
- Modal dialogs use `shadcn/ui Dialog` which handles focus trapping.
- All form inputs must have associated `<label>` elements.
- Images must have descriptive `alt` text or `alt=""` for decorative images.

---

## DATA PRIVACY (Philippine RA 10173)

- Render a privacy notice modal on first visit (use `localStorage` to remember dismissal).
- Registration form must include a checkbox: "I consent to the collection and use of my personal information as described in the Privacy Policy." This checkbox is required — form cannot submit without it. Store consent as a boolean on the `users` table (`privacy_consent: boolean DEFAULT false`).
- Anonymous complaint submissions: never log `submitter_id` in any server-side console output or audit trail readable by non-sysadmin users.
- Add `privacy_consent` column to `users` in migration 001.

---

## CI/CD

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
  build:
    runs-on: ubuntu-latest
    needs: lint-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

## FINAL CHECKLIST

Before marking the build complete, verify:

- [ ] `student_id` uniqueness enforced at both DB (`UNIQUE` constraint) and API level
- [ ] All tables have RLS enabled and at least one SELECT policy
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never appears in any client-side bundle (run `grep -r SERVICE_ROLE .next/` — must return empty)
- [ ] All forms use Zod validation schemas
- [ ] All admin routes check `is_sysadmin()` or a specific permission before rendering
- [ ] Forum channel read/write access is enforced by RLS, not just UI hiding
- [ ] Anonymous submissions: RLS policy verified — `submitter_id` not exposed to Officers
- [ ] `revalidate = 60` set on all public pages
- [ ] All `<Image>` components have explicit dimensions
- [ ] Privacy consent checkbox present on registration form
- [ ] Realtime subscriptions unsubscribed on unmount
- [ ] `.env.local.example` committed (never `.env.local`)
- [ ] `npm run build` passes with zero TypeScript errors
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

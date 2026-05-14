CREATE TABLE polls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  poll_type text NOT NULL DEFAULT 'single' CHECK (poll_type IN ('single','multiple','ranked')),
  visibility text NOT NULL DEFAULT 'all',
  min_access_level_id uuid REFERENCES access_levels(id),
  is_anonymous boolean NOT NULL DEFAULT false,
  is_satisfaction_poll boolean NOT NULL DEFAULT false,
  closes_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE poll_options (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  label text NOT NULL,
  order_index integer NOT NULL DEFAULT 0
);

CREATE TABLE poll_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  voted_at timestamptz DEFAULT now(),
  UNIQUE (poll_id, user_id, option_id)
);

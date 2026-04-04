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

CREATE TABLE legacy_wall_entries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  roster_id uuid NOT NULL REFERENCES officer_rosters(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

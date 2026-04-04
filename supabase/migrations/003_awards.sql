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

CREATE TABLE submissions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_type text NOT NULL CHECK (submission_type IN ('concern','suggestion','complaint','feedback')),
  subject text NOT NULL,
  body text NOT NULL,
  is_anonymous boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT false,
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

CREATE TABLE suggestion_upvotes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (submission_id, user_id)
);

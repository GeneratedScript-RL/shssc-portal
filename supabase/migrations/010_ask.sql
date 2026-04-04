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

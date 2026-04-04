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

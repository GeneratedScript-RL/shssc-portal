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

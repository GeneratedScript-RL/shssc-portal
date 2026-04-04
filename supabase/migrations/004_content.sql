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

CREATE OR REPLACE FUNCTION set_post_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION set_post_updated_at();

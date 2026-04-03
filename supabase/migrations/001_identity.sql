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
  student_id integer UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  access_level_id uuid REFERENCES access_levels(id),
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
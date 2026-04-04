ALTER TABLE officer_roster_entries
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS order_index integer NOT NULL DEFAULT 0;

WITH ranked_entries AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY roster_id
      ORDER BY order_index ASC, position_title ASC, id ASC
    ) - 1 AS next_order_index
  FROM officer_roster_entries
)
UPDATE officer_roster_entries AS entries
SET order_index = ranked_entries.next_order_index
FROM ranked_entries
WHERE entries.id = ranked_entries.id;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'legacy-media',
  'legacy-media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

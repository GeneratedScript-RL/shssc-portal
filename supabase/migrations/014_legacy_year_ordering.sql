ALTER TABLE officer_rosters
  ADD COLUMN IF NOT EXISTS order_index integer NOT NULL DEFAULT 0;

WITH ranked_rosters AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      ORDER BY school_year DESC, created_at DESC, id ASC
    ) - 1 AS next_order_index
  FROM officer_rosters
)
UPDATE officer_rosters AS rosters
SET order_index = ranked_rosters.next_order_index
FROM ranked_rosters
WHERE rosters.id = ranked_rosters.id;

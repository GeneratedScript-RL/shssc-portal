WITH permission_keys(permission) AS (
  VALUES ('delete:forum_content')
)
INSERT INTO access_level_permissions (access_level_id, permission, granted)
SELECT
  al.id,
  pk.permission,
  COALESCE(existing_moderation.granted, false) OR al.is_sysadmin
FROM access_levels al
CROSS JOIN permission_keys pk
LEFT JOIN access_level_permissions existing_moderation
  ON existing_moderation.access_level_id = al.id
  AND existing_moderation.permission = 'moderate:forums'
ON CONFLICT (access_level_id, permission) DO UPDATE
SET granted = EXCLUDED.granted;

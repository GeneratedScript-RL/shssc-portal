INSERT INTO access_levels (name, hierarchy_order, is_sysadmin) VALUES
  ('Student', 10, false),
  ('Grade Level Representative', 20, false),
  ('Committee Member', 30, false),
  ('Officer', 40, false),
  ('Sysadmin', 100, true)
ON CONFLICT (name) DO NOTHING;

WITH permission_keys(permission) AS (
  VALUES
    ('post:announcement'),
    ('post:news'),
    ('post:memorandum'),
    ('manage:events'),
    ('manage:polls'),
    ('manage:minutes'),
    ('manage:resolutions'),
    ('manage:financials'),
    ('view:complaints'),
    ('respond:complaints'),
    ('manage:users'),
    ('manage:roles'),
    ('manage:committees'),
    ('manage:awards'),
    ('manage:roster'),
    ('moderate:forums'),
    ('post:bulletin'),
    ('live_qa:respond')
)
INSERT INTO access_level_permissions (access_level_id, permission, granted)
SELECT
  al.id,
  pk.permission,
  CASE
    WHEN al.name = 'Sysadmin' THEN true
    WHEN al.name = 'Officer' THEN (
      pk.permission LIKE 'manage:%'
      OR pk.permission LIKE 'post:%'
      OR pk.permission IN ('view:complaints', 'respond:complaints', 'moderate:forums', 'live_qa:respond')
    )
    WHEN al.name = 'Committee Member' THEN pk.permission IN (
      'post:announcement',
      'post:news',
      'post:bulletin',
      'manage:events',
      'manage:polls',
      'manage:minutes',
      'moderate:forums',
      'live_qa:respond'
    )
    WHEN al.name = 'Grade Level Representative' THEN pk.permission IN (
      'post:announcement',
      'post:news',
      'post:bulletin'
    )
    ELSE false
  END
FROM access_levels al
CROSS JOIN permission_keys pk
ON CONFLICT (access_level_id, permission) DO UPDATE SET granted = EXCLUDED.granted;

INSERT INTO forum_channels (name, slug, description, channel_type, order_index, min_view_level_id, min_post_level_id)
SELECT
  values_table.name,
  values_table.slug,
  values_table.description,
  values_table.channel_type,
  values_table.order_index,
  values_table.min_view_level_id,
  values_table.min_post_level_id
FROM (
  VALUES
    (
      'Questions',
      'questions',
      'Ask anything. Open to all.',
      'open',
      1,
      NULL::uuid,
      NULL::uuid
    ),
    (
      'Bulletin',
      'bulletin',
      'Rules and official announcements.',
      'announcement',
      0,
      NULL::uuid,
      (SELECT id FROM access_levels WHERE name = 'Officer')
    ),
    (
      'Suggestions',
      'suggestions',
      'Submit ideas for the council.',
      'open',
      2,
      NULL::uuid,
      NULL::uuid
    ),
    (
      'Council Updates',
      'council-updates',
      'Updates from officers.',
      'restricted',
      3,
      (SELECT id FROM access_levels WHERE name = 'Officer'),
      (SELECT id FROM access_levels WHERE name = 'Officer')
    )
) AS values_table(name, slug, description, channel_type, order_index, min_view_level_id, min_post_level_id)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO submission_visibility (access_level_id, submission_type, can_view, can_respond)
SELECT al.id, submission_type, can_view, can_respond
FROM access_levels al
CROSS JOIN (
  VALUES
    ('concern', true, true),
    ('suggestion', true, true),
    ('complaint', true, true),
    ('feedback', true, true)
) AS visibility(submission_type, can_view, can_respond)
WHERE al.name IN ('Officer', 'Sysadmin')
ON CONFLICT (access_level_id, submission_type) DO UPDATE
SET can_view = EXCLUDED.can_view,
    can_respond = EXCLUDED.can_respond;

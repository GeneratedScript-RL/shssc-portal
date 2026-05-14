ALTER TABLE access_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_level_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_roster_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_wall_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_questions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION current_user_row_id() RETURNS uuid AS $$
  SELECT id FROM users WHERE auth_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE VIEW current_user_permissions AS
  SELECT alp.permission
  FROM users u
  JOIN access_level_permissions alp ON alp.access_level_id = u.access_level_id
  WHERE u.auth_id = auth.uid()
    AND alp.granted = true;

CREATE OR REPLACE FUNCTION has_permission(perm text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM current_user_permissions WHERE permission = perm
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION is_sysadmin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN access_levels al ON al.id = u.access_level_id
    WHERE u.auth_id = auth.uid() AND al.is_sysadmin = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION has_level_at_least(level_id uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN access_levels current_level ON current_level.id = u.access_level_id
    JOIN access_levels required_level ON required_level.id = level_id
    WHERE u.auth_id = auth.uid()
      AND current_level.hierarchy_order >= required_level.hierarchy_order
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

GRANT SELECT ON current_user_permissions TO authenticated, anon;
GRANT EXECUTE ON FUNCTION current_user_row_id() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION has_permission(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION is_sysadmin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION has_level_at_least(uuid) TO authenticated, anon;

CREATE POLICY "access_levels_select" ON access_levels
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "ranks_select" ON ranks
  FOR SELECT USING (true);

CREATE POLICY "users_select" ON users
  FOR SELECT USING (
    (is_active = true AND privacy_consent = true)
    OR id = current_user_row_id()
    OR is_sysadmin()
  );

CREATE POLICY "users_update" ON users
  FOR UPDATE USING (
    id = current_user_row_id()
    OR has_permission('manage:users')
    OR is_sysadmin()
  );

CREATE POLICY "access_level_permissions_select" ON access_level_permissions
  FOR SELECT USING (
    access_level_id = (SELECT access_level_id FROM users WHERE id = current_user_row_id())
    OR has_permission('manage:roles')
    OR is_sysadmin()
  );

CREATE POLICY "user_ranks_select" ON user_ranks
  FOR SELECT USING (true);

CREATE POLICY "committees_select" ON committees
  FOR SELECT USING (true);

CREATE POLICY "committee_members_select" ON committee_members
  FOR SELECT USING (true);

CREATE POLICY "officer_rosters_select" ON officer_rosters
  FOR SELECT USING (true);

CREATE POLICY "officer_roster_entries_select" ON officer_roster_entries
  FOR SELECT USING (true);

CREATE POLICY "legacy_wall_entries_select" ON legacy_wall_entries
  FOR SELECT USING (true);

CREATE POLICY "awards_select" ON awards
  FOR SELECT USING (true);

CREATE POLICY "user_awards_select" ON user_awards
  FOR SELECT USING (true);

CREATE POLICY "posts_select_published" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "posts_select_own_draft" ON posts
  FOR SELECT USING (author_id = current_user_row_id());

CREATE POLICY "posts_insert" ON posts
  FOR INSERT WITH CHECK (
    has_permission('post:news')
    OR has_permission('post:announcement')
    OR has_permission('post:memorandum')
    OR has_permission('manage:minutes')
    OR has_permission('manage:resolutions')
    OR is_sysadmin()
  );

CREATE POLICY "posts_update" ON posts
  FOR UPDATE USING (
    author_id = current_user_row_id()
    OR is_sysadmin()
  );

CREATE POLICY "events_select" ON events
  FOR SELECT USING (true);

CREATE POLICY "event_registrations_select" ON event_registrations
  FOR SELECT USING (
    user_id = current_user_row_id()
    OR has_permission('manage:events')
    OR is_sysadmin()
  );

CREATE POLICY "event_registrations_insert" ON event_registrations
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = current_user_row_id()
    AND EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_registrations.event_id
        AND e.is_registration_open = true
    )
  );

CREATE POLICY "polls_select" ON polls
  FOR SELECT USING (
    visibility = 'all'
    OR auth.uid() IS NOT NULL
    OR is_sysadmin()
  );

CREATE POLICY "poll_options_select" ON poll_options
  FOR SELECT USING (true);

CREATE POLICY "poll_votes_insert" ON poll_votes
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = current_user_row_id()
    AND EXISTS (
      SELECT 1 FROM polls p
      WHERE p.id = poll_votes.poll_id
        AND (p.closes_at IS NULL OR p.closes_at > now())
    )
  );

CREATE POLICY "poll_votes_select_own" ON poll_votes
  FOR SELECT USING (
    user_id = current_user_row_id()
    OR is_sysadmin()
  );

CREATE POLICY "submissions_insert" ON submissions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND submitter_id = current_user_row_id()
  );

CREATE POLICY "submissions_select_own" ON submissions
  FOR SELECT USING (
    submitter_id = current_user_row_id()
    AND NOT is_anonymous
  );

CREATE POLICY "submissions_select_privileged" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM submission_visibility sv
      JOIN users u ON u.access_level_id = sv.access_level_id
      WHERE u.auth_id = auth.uid()
        AND sv.submission_type = submissions.submission_type
        AND sv.can_view = true
    )
    OR is_sysadmin()
  );

CREATE POLICY "anon_submission_identity" ON submissions
  FOR SELECT USING (
    NOT is_anonymous
    OR submitter_id = current_user_row_id()
    OR is_sysadmin()
  );

CREATE POLICY "submissions_update_privileged" ON submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM submission_visibility sv
      JOIN users u ON u.access_level_id = sv.access_level_id
      WHERE u.auth_id = auth.uid()
        AND sv.submission_type = submissions.submission_type
        AND sv.can_respond = true
    )
    OR is_sysadmin()
  );

CREATE POLICY "submission_visibility_select" ON submission_visibility
  FOR SELECT USING (
    auth.uid() IS NOT NULL
    AND (
      access_level_id = (SELECT access_level_id FROM users WHERE id = current_user_row_id())
      OR is_sysadmin()
    )
  );

CREATE POLICY "suggestion_upvotes_select" ON suggestion_upvotes
  FOR SELECT USING (true);

CREATE POLICY "suggestion_upvotes_insert" ON suggestion_upvotes
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = current_user_row_id()
  );

CREATE POLICY "forum_channels_select" ON forum_channels
  FOR SELECT USING (
    min_view_level_id IS NULL
    OR has_level_at_least(min_view_level_id)
    OR is_sysadmin()
  );

CREATE POLICY "forum_threads_select" ON forum_threads
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM forum_channels fc
      WHERE fc.id = forum_threads.channel_id
        AND (
          fc.min_view_level_id IS NULL
          OR has_level_at_least(fc.min_view_level_id)
          OR is_sysadmin()
        )
    )
  );

CREATE POLICY "forum_threads_insert" ON forum_threads
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND author_id = current_user_row_id()
    AND EXISTS (
      SELECT 1
      FROM forum_channels fc
      WHERE fc.id = forum_threads.channel_id
        AND NOT fc.is_locked
        AND (
          fc.min_post_level_id IS NULL
          OR has_level_at_least(fc.min_post_level_id)
          OR is_sysadmin()
        )
    )
  );

CREATE POLICY "forum_threads_update" ON forum_threads
  FOR UPDATE USING (
    author_id = current_user_row_id()
    OR has_permission('moderate:forums')
    OR is_sysadmin()
  );

CREATE POLICY "forum_replies_select" ON forum_replies
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM forum_threads ft
      JOIN forum_channels fc ON fc.id = ft.channel_id
      WHERE ft.id = forum_replies.thread_id
        AND (
          fc.min_view_level_id IS NULL
          OR has_level_at_least(fc.min_view_level_id)
          OR is_sysadmin()
        )
    )
  );

CREATE POLICY "forum_replies_insert" ON forum_replies
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND author_id = current_user_row_id()
    AND EXISTS (
      SELECT 1
      FROM forum_threads ft
      JOIN forum_channels fc ON fc.id = ft.channel_id
      WHERE ft.id = forum_replies.thread_id
        AND NOT ft.is_locked
        AND NOT fc.is_locked
        AND (
          fc.min_post_level_id IS NULL
          OR has_level_at_least(fc.min_post_level_id)
          OR is_sysadmin()
        )
    )
  );

CREATE POLICY "forum_replies_update" ON forum_replies
  FOR UPDATE USING (
    author_id = current_user_row_id()
    OR has_permission('moderate:forums')
    OR is_sysadmin()
  );

CREATE POLICY "forum_reactions_select" ON forum_reactions
  FOR SELECT USING (true);

CREATE POLICY "forum_reactions_insert" ON forum_reactions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = current_user_row_id()
  );

CREATE POLICY "forum_reports_select" ON forum_reports
  FOR SELECT USING (
    has_permission('moderate:forums')
    OR is_sysadmin()
  );

CREATE POLICY "forum_reports_insert" ON forum_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "financial_summaries_select" ON financial_summaries
  FOR SELECT USING (true);

CREATE POLICY "resolutions_select" ON resolutions
  FOR SELECT USING (true);

CREATE POLICY "qa_sessions_select" ON qa_sessions
  FOR SELECT USING (true);

CREATE POLICY "qa_questions_select" ON qa_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM qa_sessions s
      WHERE s.id = qa_questions.session_id
        AND s.is_open = true
    )
    OR submitter_id = current_user_row_id()
    OR has_permission('live_qa:respond')
    OR is_sysadmin()
  );

CREATE POLICY "qa_questions_insert" ON qa_questions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND submitter_id = current_user_row_id()
    AND EXISTS (
      SELECT 1 FROM qa_sessions s
      WHERE s.id = qa_questions.session_id
        AND s.is_open = true
    )
  );

CREATE POLICY "qa_questions_update" ON qa_questions
  FOR UPDATE USING (
    has_permission('live_qa:respond')
    OR is_sysadmin()
  );

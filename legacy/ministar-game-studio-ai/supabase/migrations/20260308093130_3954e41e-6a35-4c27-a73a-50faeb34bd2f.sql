
DROP POLICY IF EXISTS "Authenticated users can insert leaderboard entry" ON public.leaderboard_entries;

CREATE POLICY "Anyone can insert leaderboard entry"
ON public.leaderboard_entries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

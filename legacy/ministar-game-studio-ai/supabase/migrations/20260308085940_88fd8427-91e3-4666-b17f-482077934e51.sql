
-- Fix overly permissive leaderboard insert policy
DROP POLICY "Anyone can insert leaderboard entry" ON public.leaderboard_entries;
-- Allow authenticated users to insert leaderboard entries
CREATE POLICY "Authenticated users can insert leaderboard entry" ON public.leaderboard_entries FOR INSERT TO authenticated WITH CHECK (true);

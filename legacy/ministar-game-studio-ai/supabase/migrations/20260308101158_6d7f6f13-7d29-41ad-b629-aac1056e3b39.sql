
-- Student profiles for XP/leveling (anonymous, identified by device fingerprint + name)
CREATE TABLE public.student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  avatar text NOT NULL DEFAULT '🦊',
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  total_games_played integer NOT NULL DEFAULT 0,
  total_correct integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  best_streak integer NOT NULL DEFAULT 0,
  device_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(device_id)
);

-- Enable RLS
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read student profiles (for leaderboards)
CREATE POLICY "Anyone can read student profiles"
  ON public.student_profiles FOR SELECT
  USING (true);

-- Anyone can insert (anonymous students)
CREATE POLICY "Anyone can insert student profile"
  ON public.student_profiles FOR INSERT
  WITH CHECK (true);

-- Anyone can update (matched by device_id in app logic)
CREATE POLICY "Anyone can update student profile"
  ON public.student_profiles FOR UPDATE
  USING (true);

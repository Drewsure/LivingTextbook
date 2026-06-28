
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('teacher', 'student');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  instruction_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Worksheets table
CREATE TABLE public.worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Worksheet',
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'pdf')),
  content_text TEXT,
  file_url TEXT,
  analysis_results JSONB,
  instruction_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can read own worksheets" ON public.worksheets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers can insert own worksheets" ON public.worksheets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers can update own worksheets" ON public.worksheets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Teachers can delete own worksheets" ON public.worksheets FOR DELETE USING (auth.uid() = user_id);

-- Games table
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worksheet_id UUID REFERENCES public.worksheets(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT NOT NULL CHECK (game_type IN ('quiz', 'spelling', 'true_false', 'drag_drop')),
  game_data JSONB NOT NULL DEFAULT '{}',
  share_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
-- Teachers can manage their games (via worksheet ownership)
CREATE POLICY "Teachers can read own games" ON public.games FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.worksheets w WHERE w.id = worksheet_id AND w.user_id = auth.uid())
);
CREATE POLICY "Teachers can insert games" ON public.games FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.worksheets w WHERE w.id = worksheet_id AND w.user_id = auth.uid())
);
CREATE POLICY "Teachers can delete own games" ON public.games FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.worksheets w WHERE w.id = worksheet_id AND w.user_id = auth.uid())
);
-- Students can read active games by share code (public access for playing)
CREATE POLICY "Anyone can read active games" ON public.games FOR SELECT USING (is_active = true);

-- Leaderboard entries
CREATE TABLE public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read leaderboard" ON public.leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Anyone can insert leaderboard entry" ON public.leaderboard_entries FOR INSERT WITH CHECK (true);

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_worksheets_updated_at BEFORE UPDATE ON public.worksheets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for worksheet uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('worksheets', 'worksheets', false);
CREATE POLICY "Teachers can upload worksheets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'worksheets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Teachers can view own worksheets" ON storage.objects FOR SELECT USING (bucket_id = 'worksheets' AND auth.uid()::text = (storage.foldername(name))[1]);

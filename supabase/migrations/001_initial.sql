-- Courses: language packs that users can download
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language VARCHAR(50) NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Words within a course
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  native_text TEXT DEFAULT '',
  audio_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- User achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'enable_microphone', 'download_course', 'practice_word',
    'practice_ten', 'reminder_7days'
  )),
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  seen BOOLEAN DEFAULT false
);

-- User progress on words
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id UUID REFERENCES words(id) ON DELETE CASCADE,
  checked BOOLEAN DEFAULT false,
  last_practiced_at TIMESTAMPTZ,
  UNIQUE(user_id, word_id)
);

-- Audio storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true);

-- RLS policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are readable by all" ON courses FOR SELECT USING (true);
CREATE POLICY "Words are readable by all" ON words FOR SELECT USING (true);
CREATE POLICY "Users manage own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Audio is publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY "Authenticated users can upload audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio' AND auth.role() = 'authenticated');

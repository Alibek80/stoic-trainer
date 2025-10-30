-- Stoic Trainer Database Schema
-- This file contains the SQL schema for the Supabase database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('morning', 'evening')),
  steps JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Virtues table
CREATE TABLE IF NOT EXISTS virtues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wisdom INTEGER NOT NULL CHECK (wisdom BETWEEN 1 AND 5),
  courage INTEGER NOT NULL CHECK (courage BETWEEN 1 AND 5),
  justice INTEGER NOT NULL CHECK (justice BETWEEN 1 AND 5),
  temperance INTEGER NOT NULL CHECK (temperance BETWEEN 1 AND 5),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Reframes table (cognitive reframing practice)
CREATE TABLE IF NOT EXISTS reframes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  situation TEXT NOT NULL,
  reaction TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  accepted BOOLEAN NOT NULL DEFAULT FALSE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  category VARCHAR(100),
  favorited_by UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mood logs table
CREATE TABLE IF NOT EXISTS mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5),
  stress INTEGER NOT NULL CHECK (stress BETWEEN 1 AND 5),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reflections_user_id ON reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_reflections_created_at ON reflections(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_virtues_user_id ON virtues(user_id);
CREATE INDEX IF NOT EXISTS idx_virtues_date ON virtues(date DESC);

CREATE INDEX IF NOT EXISTS idx_reframes_user_id ON reframes(user_id);
CREATE INDEX IF NOT EXISTS idx_reframes_created_at ON reframes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_date ON challenges(date DESC);

CREATE INDEX IF NOT EXISTS idx_quotes_author ON quotes(author);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_date ON mood_logs(date DESC);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtues ENABLE ROW LEVEL SECURITY;
ALTER TABLE reframes ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reflections
CREATE POLICY "Users can view own reflections"
  ON reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON reflections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections"
  ON reflections FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for virtues
CREATE POLICY "Users can view own virtues"
  ON virtues FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own virtues"
  ON virtues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own virtues"
  ON virtues FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own virtues"
  ON virtues FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for reframes
CREATE POLICY "Users can view own reframes"
  ON reframes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reframes"
  ON reframes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reframes"
  ON reframes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reframes"
  ON reframes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for challenges
CREATE POLICY "Users can view own challenges"
  ON challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges"
  ON challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges"
  ON challenges FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges"
  ON challenges FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for quotes (everyone can read, only users can favorite)
CREATE POLICY "Anyone can view quotes"
  ON quotes FOR SELECT
  USING (true);

CREATE POLICY "Users can update quotes to favorite"
  ON quotes FOR UPDATE
  USING (true);

-- RLS Policies for mood_logs
CREATE POLICY "Users can view own mood logs"
  ON mood_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood logs"
  ON mood_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood logs"
  ON mood_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood logs"
  ON mood_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_reflections_updated_at
  BEFORE UPDATE ON reflections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_virtues_updated_at
  BEFORE UPDATE ON virtues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default quotes
INSERT INTO quotes (author, text, category)
VALUES
  ('Марк Аврелий', 'Наша жизнь — это то, о чем мы думаем.', 'Мудрость'),
  ('Марк Аврелий', 'Вы владеете своими действиями, но не результатами. Стремитесь, но не привязывайтесь к результату.', 'Принятие'),
  ('Эпиктет', 'Главная задача в жизни — отличать то, что в моей власти от того, что не в моей власти.', 'Контроль'),
  ('Сенека', 'У нас есть ровно столько, сколько мы можем пережить в любой момент.', 'Благодарность'),
  ('Эпиктет', 'Регистрируйте учение, а не одни слова.', 'Практика'),
  ('Сенека', 'Мы страдаем чаще в воображении, чем в реальности.', 'Страх'),
  ('Марк Аврелий', 'Благополучие и болезнь находятся в руках врача. Добро и зло — в руках действий.', 'Этика'),
  ('Эпиктет', 'Пусть твоя воля никогда не противоречит природе.', 'Гармония'),
  ('Сенека', 'Живи так, как будто уже умер.', 'Осознанность'),
  ('Марк Аврелий', 'Не смотри вниз на дела других, а смотри вперед к своим целям.', 'Фокус')
ON CONFLICT DO NOTHING;

-- ─── SereneAI Database Schema ─────────────────────────────────────────
-- Run against a PostgreSQL database, or use `npm run db:push` with Drizzle Kit.

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password      TEXT NOT NULL,
  first_name    TEXT,
  last_name     TEXT,
  email         TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Mood entries
CREATE TABLE IF NOT EXISTS mood_entries (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood          TEXT NOT NULL,
  notes         TEXT,
  "timestamp"   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user ON mood_entries(user_id);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender        TEXT NOT NULL,          -- 'user' | 'ai'
  message       TEXT NOT NULL,
  sentiment     TEXT,
  suggestions   JSONB,
  "timestamp"   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  mood          TEXT,
  tags          JSONB,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user ON journal_entries(user_id);

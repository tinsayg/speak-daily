-- Run this in the Supabase SQL editor to create the required tables

create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  display_name text not null,
  password_hash text not null,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  duration_seconds integer not null,
  context text not null check (context in ('casual','interview','presentation','pitch')),
  topic text,
  speakup_score numeric(5,2) not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);

create table if not exists metric_results (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  metric text not null,
  value numeric not null,
  score numeric(4,2) not null,
  flag text
);

create table if not exists transcripts (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade unique,
  full_text text not null,
  filler_positions jsonb default '[]'
);

create table if not exists weekly_summaries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  week_start date not null,
  avg_score numeric(5,2) not null,
  most_improved text not null,
  top_flag text not null,
  streak_status integer not null default 0,
  unique(user_id, week_start)
);

-- Indexes
create index if not exists idx_sessions_user_date on sessions(user_id, date desc);
create index if not exists idx_metric_results_session on metric_results(session_id);
create index if not exists idx_summaries_user on weekly_summaries(user_id, week_start desc);

-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query)
-- after creating your project. See README.md "Setup checklist" for the full flow.

-- 1. Waitlist / pre-launch email capture (public, no auth required)
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  goal text, -- captured from the landing page quiz, e.g. "sleep", "hydration", "exercise"
  created_at timestamptz not null default now()
);

alter table waitlist enable row level security;

create policy "anyone can join the waitlist"
  on waitlist for insert
  to anon
  with check (true);

-- 2. Profile: one row per authenticated user, extends auth.users
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  goal text,                 -- from onboarding quiz
  obstacle text,             -- from onboarding quiz
  plan text not null default 'free', -- 'free' | 'plus' | 'pro'
  polar_customer_id text,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  onboarded_at timestamptz,
  sent_emails text[] not null default '{}', -- tracks which activation-sequence emails already went out
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "users manage their own profile"
  on profiles for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Habit logs: one row per daily check-in
create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  logged_on date not null default current_date,
  value numeric,          -- e.g. hours slept, glasses of water, minutes exercised
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, logged_on)
);

alter table habit_logs enable row level security;

create policy "users manage their own logs"
  on habit_logs for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Auto-create a profile row whenever someone signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

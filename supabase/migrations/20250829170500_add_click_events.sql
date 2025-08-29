-- Create table for click analytics
create table if not exists public.click_events (
  id bigint generated always as identity primary key,
  short_code text not null,
  referrer text,
  user_agent text,
  country text,
  city text,
  device text,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_click_events_code on public.click_events(short_code);
create index if not exists idx_click_events_created_at on public.click_events(created_at);
create index if not exists idx_click_events_code_created_at on public.click_events(short_code, created_at);

-- Enable RLS
alter table public.click_events enable row level security;

-- Allow public inserts from Edge function (anon key)
create policy "Allow inserts from anon" on public.click_events
  for insert to anon
  with check (true);

-- Allow public read for aggregated stats
create policy "Allow select for all" on public.click_events
  for select to anon
  using (true);

-- Optional: limit delete/update (deny by default)

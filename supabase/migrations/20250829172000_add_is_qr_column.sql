-- Add is_qr flag to identify QR-origin clicks
alter table public.click_events
  add column if not exists is_qr boolean not null default false;

-- Helpful partial index for QR queries (optional)
create index if not exists idx_click_events_code_is_qr on public.click_events(short_code, is_qr);

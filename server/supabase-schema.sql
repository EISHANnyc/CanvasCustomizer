-- server/supabase-schema.sql
-- Optional: If using Supabase instead of Cloudflare Workers

create table if not exists palette_stats (
  id uuid default gen_random_uuid() primary key,
  palette_name text not null,
  colors text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable public read & insert for anonymous telemetry
alter table palette_stats enable row level security;

create policy "Allow anonymous inserts"
  on palette_stats for insert
  to anon
  with check (true);

create policy "Allow anonymous reads"
  on palette_stats for select
  to anon
  using (true);

-- Helpful view for rankings
create or replace view palette_rankings as
select
  palette_name,
  count(*) as total_uses,
  round((count(*)::decimal / (select count(*) from palette_stats) * 100), 1) as percentage
from palette_stats
group by palette_name
order by total_uses desc;

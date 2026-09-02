-- Hip-Hop practice archive: private per-user metadata in Supabase.
-- Video bytes live in a private Cloudflare R2 bucket; only object metadata is stored here.

create extension if not exists pgcrypto;

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  practiced_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  location text not null default '',
  partners text[] not null default '{}',
  dance_style text not null default '',
  music text[] not null default '{}',
  feeling text not null default '',
  wins text not null default '',
  attention text not null default '',
  technique text not null default '',
  feedback text not null default '',
  next_step text not null default '',
  voice_note text not null default '',
  other_moves text[] not null default '{}',
  douyin_title text not null default '',
  moves jsonb not null default '[]'::jsonb,
  constraint practice_sessions_moves_array check (jsonb_typeof(moves) = 'array'),
  constraint practice_sessions_id_user_unique unique (id, user_id)
);

create index if not exists practice_sessions_user_date_idx
  on public.practice_sessions (user_id, practiced_on desc, created_at desc);

create table if not exists public.practice_media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  storage_provider text not null default 'cloudflare_r2',
  bucket_id text not null default 'hiphop-practice-videos',
  object_path text not null,
  original_name text not null,
  mime_type text not null,
  bytes bigint not null check (bytes >= 0),
  sha256 text,
  remote_etag text,
  uploaded_at timestamptz,
  created_at timestamptz not null default now(),
  constraint practice_media_session_owner_fk
    foreign key (session_id, user_id)
    references public.practice_sessions (id, user_id)
    on delete cascade,
  constraint practice_media_provider_path_unique
    unique (storage_provider, bucket_id, object_path)
);

create index if not exists practice_media_user_id_idx
  on public.practice_media (user_id);

create index if not exists practice_media_session_id_idx
  on public.practice_media (session_id);

create index if not exists practice_media_session_owner_idx
  on public.practice_media (session_id, user_id);

create unique index if not exists practice_media_one_video_per_session_idx
  on public.practice_media (session_id, user_id);

create or replace function public.set_practice_session_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_practice_session_updated_at() from public;
revoke all on function public.set_practice_session_updated_at() from anon;
revoke all on function public.set_practice_session_updated_at() from authenticated;

drop trigger if exists practice_sessions_set_updated_at on public.practice_sessions;
create trigger practice_sessions_set_updated_at
before update on public.practice_sessions
for each row execute function public.set_practice_session_updated_at();

alter table public.practice_sessions enable row level security;
alter table public.practice_sessions force row level security;
alter table public.practice_media enable row level security;
alter table public.practice_media force row level security;

drop policy if exists practice_sessions_owner_all on public.practice_sessions;
create policy practice_sessions_owner_all
  on public.practice_sessions
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists practice_media_owner_all on public.practice_media;
create policy practice_media_owner_all
  on public.practice_media
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- New Supabase projects do not expose SQL-created tables to the Data API by default.
-- Grant only the authenticated role; anonymous visitors receive no table privileges.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.practice_sessions to authenticated;
grant select, insert, update, delete on public.practice_media to authenticated;
revoke all on public.practice_sessions from anon;
revoke all on public.practice_media from anon;


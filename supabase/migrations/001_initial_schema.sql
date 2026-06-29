create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone_whatsapp text,
  city text,
  state text,
  role text not null check (role in ('admin','lecture_manager','speaker','participant')),
  status text not null default 'pending' check (status in ('pending','approved','rejected','active','inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.speakers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade unique,
  bio text,
  organization text,
  expertise_area text,
  linkedin_url text,
  approval_status text not null default 'pending' check (approval_status in ('pending','approved','rejected')),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.lectures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  theme text not null,
  description text,
  content_summary text,
  category text,
  date date not null,
  start_time time not null,
  end_time time not null,
  duration_minutes integer not null check (duration_minutes > 0),
  room text,
  location text,
  capacity integer not null check (capacity > 0),
  status text not null default 'draft' check (status in ('draft','published','closed','cancelled')),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint lectures_time_order check (start_time < end_time)
);

create table if not exists public.lecture_speakers (
  id uuid primary key default gen_random_uuid(),
  lecture_id uuid references public.lectures(id) on delete cascade,
  speaker_id uuid references public.speakers(id) on delete cascade,
  role_in_lecture text not null default 'main' check (role_in_lecture in ('main','co_speaker','assistant')),
  created_at timestamptz default now(),
  unique (lecture_id, speaker_id)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.profiles(id) on delete cascade,
  lecture_id uuid references public.lectures(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','confirmed','waitlisted','cancelled','rejected')),
  confirmed_by uuid references public.profiles(id),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (participant_id, lecture_id)
);

create table if not exists public.personal_schedule (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  lecture_id uuid references public.lectures(id) on delete cascade,
  source text not null default 'manual' check (source in ('enrollment','manual')),
  created_at timestamptz default now(),
  unique (user_id, lecture_id)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete cascade unique,
  checked_in boolean default false,
  checked_in_at timestamptz,
  checked_in_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  lecture_id uuid references public.lectures(id) on delete set null,
  channel text not null check (channel in ('email','whatsapp','system')),
  type text not null check (type in ('enrollment_confirmed','enrollment_cancelled','reminder','speaker_approved')),
  destination text,
  subject text,
  message text not null,
  status text not null default 'pending' check (status in ('pending','sent','failed','simulated')),
  provider_response jsonb,
  created_at timestamptz default now()
);

create table if not exists public.lecture_feedback (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete cascade unique,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_speakers_status on public.speakers(approval_status);
create index if not exists idx_lectures_status_date on public.lectures(status, date);
create index if not exists idx_enrollments_status on public.enrollments(status);
create index if not exists idx_enrollments_lecture on public.enrollments(lecture_id);
create index if not exists idx_schedule_user on public.personal_schedule(user_id);
create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);

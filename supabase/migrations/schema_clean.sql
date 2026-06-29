-- VIDA PLENA - SCHEMA COMPLETO
-- Cole este SQL inteiro no Supabase SQL Editor
-- Pressione Ctrl+Enter ou clique Run

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

create type user_role as enum ('admin', 'lecture_manager', 'speaker', 'participant');
create type user_status as enum ('pending', 'approved', 'rejected', 'active', 'inactive');
create type speaker_approval_status as enum ('pending', 'approved', 'rejected');
create type lecture_status as enum ('draft', 'published', 'closed', 'cancelled');
create type enrollment_status as enum ('pending', 'confirmed', 'waitlisted', 'cancelled', 'rejected');
create type speaker_role_in_lecture as enum ('main', 'co_speaker', 'assistant');
create type file_visibility as enum ('confirmed_participants', 'speakers_only', 'admin_only');
create type schedule_source as enum ('enrollment', 'manual');
create type notification_channel as enum ('email', 'whatsapp', 'system');
create type notification_type as enum ('enrollment_confirmed', 'enrollment_cancelled', 'reminder', 'speaker_approved', 'file_available');
create type notification_status as enum ('pending', 'sent', 'failed', 'simulated');

-- TABELAS

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone_whatsapp text,
  city text,
  state text,
  role user_role not null,
  status user_status not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.speakers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade unique not null,
  bio text,
  organization text,
  expertise_area text,
  linkedin_url text,
  approval_status speaker_approval_status not null default 'pending',
  approved_by uuid references public.profiles(id) on delete set null,
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
  status lecture_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint lectures_time_order check (start_time < end_time)
);

create table if not exists public.lecture_speakers (
  id uuid primary key default gen_random_uuid(),
  lecture_id uuid references public.lectures(id) on delete cascade not null,
  speaker_id uuid references public.speakers(id) on delete cascade not null,
  role_in_lecture speaker_role_in_lecture not null default 'main',
  created_at timestamptz default now(),
  unique (lecture_id, speaker_id)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.profiles(id) on delete cascade not null,
  lecture_id uuid references public.lectures(id) on delete cascade not null,
  status enrollment_status not null default 'pending',
  confirmed_by uuid references public.profiles(id) on delete set null,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (participant_id, lecture_id)
);

create table if not exists public.lecture_files (
  id uuid primary key default gen_random_uuid(),
  lecture_id uuid references public.lectures(id) on delete cascade not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size bigint,
  visibility file_visibility not null default 'confirmed_participants',
  downloads_count integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.personal_schedule (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  lecture_id uuid references public.lectures(id) on delete cascade not null,
  source schedule_source not null default 'manual',
  created_at timestamptz default now(),
  unique (user_id, lecture_id)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete cascade unique not null,
  checked_in boolean default false,
  checked_in_at timestamptz,
  checked_in_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete cascade unique not null,
  certificate_number text unique not null,
  issued_at timestamptz default now(),
  certificate_file_path text,
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  lecture_id uuid references public.lectures(id) on delete set null,
  channel notification_channel not null,
  type notification_type not null,
  destination text,
  subject text,
  message text not null,
  status notification_status not null default 'pending',
  provider_response jsonb,
  created_at timestamptz default now()
);

create table if not exists public.lecture_feedback (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete cascade unique not null,
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

-- ÍNDICES

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_status on public.profiles(status);
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_speakers_profile on public.speakers(profile_id);
create index if not exists idx_speakers_status on public.speakers(approval_status);
create index if not exists idx_lectures_status_date on public.lectures(status, date);
create index if not exists idx_lectures_created_by on public.lectures(created_by);
create index if not exists idx_lectures_date on public.lectures(date);
create index if not exists idx_lecture_speakers_lecture on public.lecture_speakers(lecture_id);
create index if not exists idx_lecture_speakers_speaker on public.lecture_speakers(speaker_id);
create index if not exists idx_enrollments_status on public.enrollments(status);
create index if not exists idx_enrollments_lecture on public.enrollments(lecture_id);
create index if not exists idx_enrollments_participant on public.enrollments(participant_id);
create index if not exists idx_lecture_files_lecture on public.lecture_files(lecture_id);
create index if not exists idx_personal_schedule_user on public.personal_schedule(user_id);
create index if not exists idx_personal_schedule_lecture on public.personal_schedule(lecture_id);
create index if not exists idx_attendance_enrollment on public.attendance(enrollment_id);
create index if not exists idx_certificates_enrollment on public.certificates(enrollment_id);
create index if not exists idx_notifications_user_status on public.notifications(user_id, status);
create index if not exists idx_notifications_created on public.notifications(created_at desc);
create index if not exists idx_lecture_feedback_enrollment on public.lecture_feedback(enrollment_id);
create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_user on public.audit_logs(user_id);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);

-- TRIGGERS

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at();
create trigger update_speakers_updated_at before update on public.speakers for each row execute function public.update_updated_at();
create trigger update_lectures_updated_at before update on public.lectures for each row execute function public.update_updated_at();
create trigger update_enrollments_updated_at before update on public.enrollments for each row execute function public.update_updated_at();

-- ROW LEVEL SECURITY

alter table public.profiles enable row level security;
alter table public.speakers enable row level security;
alter table public.lectures enable row level security;
alter table public.lecture_speakers enable row level security;
alter table public.enrollments enable row level security;
alter table public.lecture_files enable row level security;
alter table public.personal_schedule enable row level security;
alter table public.attendance enable row level security;
alter table public.certificates enable row level security;
alter table public.notifications enable row level security;
alter table public.lecture_feedback enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES POLICIES

create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admin views all profiles" on public.profiles for select using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admin updates any profile" on public.profiles for update using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- SPEAKERS POLICIES

create policy "View approved speakers" on public.speakers for select using (approval_status = 'approved');
create policy "Speakers view own profile" on public.speakers for select using (auth.uid() = profile_id);
create policy "Admin views all speakers" on public.speakers for select using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Speakers update own profile" on public.speakers for update using (auth.uid() = profile_id);
create policy "Admin updates speakers" on public.speakers for update using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- LECTURES POLICIES

create policy "View published lectures" on public.lectures for select using (status = 'published');
create policy "Speakers view own lectures" on public.lectures for select using (auth.uid() in (select ls.speaker_id from public.lecture_speakers ls where ls.lecture_id = id) or auth.uid() = created_by);
create policy "Admin views all lectures" on public.lectures for select using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin creates lectures" on public.lectures for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));

-- ENROLLMENTS POLICIES

create policy "Users view own enrollments" on public.enrollments for select using (auth.uid() = participant_id);
create policy "Speakers view lecture enrollments" on public.enrollments for select using (auth.uid() in (select ls.speaker_id from public.lecture_speakers ls where ls.lecture_id = lecture_id));
create policy "Admin views all enrollments" on public.enrollments for select using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Users create own enrollments" on public.enrollments for insert with check (auth.uid() = participant_id);
create policy "Admin updates enrollments" on public.enrollments for update using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- LECTURE FILES POLICIES

create policy "Confirmed participants view files" on public.lecture_files for select using (visibility = 'confirmed_participants' and lecture_id in (select lecture_id from public.enrollments where participant_id = auth.uid() and status = 'confirmed'));
create policy "Speakers view own lecture files" on public.lecture_files for select using (lecture_id in (select lecture_id from public.lecture_speakers where speaker_id = auth.uid()) and visibility in ('speakers_only', 'confirmed_participants'));
create policy "Admin views all files" on public.lecture_files for select using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Speakers upload files" on public.lecture_files for insert with check (auth.uid() in (select ls.speaker_id from public.lecture_speakers ls where ls.lecture_id = lecture_id));

-- NOTIFICATIONS POLICIES

create policy "Users view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Admin views all notifications" on public.notifications for select using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- OTHER POLICIES

create policy "Users view own attendance" on public.attendance for select using (auth.uid() in (select participant_id from public.enrollments where id = enrollment_id));
create policy "Admin views all attendance" on public.attendance for select using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Users view own certificates" on public.certificates for select using (auth.uid() in (select participant_id from public.enrollments where id = enrollment_id));
create policy "Admin views all certificates" on public.certificates for select using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Users view own feedback" on public.lecture_feedback for select using (auth.uid() in (select participant_id from public.enrollments where id = enrollment_id));
create policy "Users create own feedback" on public.lecture_feedback for insert with check (auth.uid() in (select participant_id from public.enrollments where id = enrollment_id));

create policy "Users view own schedule" on public.personal_schedule for select using (auth.uid() = user_id);
create policy "Users manage own schedule" on public.personal_schedule for all using (auth.uid() = user_id);

create policy "Admin views audit logs" on public.audit_logs for select using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- VIEWS

create or replace view public.lectures_with_enrollment_count as
select
  l.id, l.title, l.date, l.start_time, l.end_time, l.capacity,
  count(e.id) as enrolled_count,
  count(case when e.status = 'confirmed' then 1 end) as confirmed_count,
  count(case when e.status = 'waitlisted' then 1 end) as waitlisted_count,
  (l.capacity - count(case when e.status = 'confirmed' then 1 end)) as available_spots
from public.lectures l
left join public.enrollments e on l.id = e.lecture_id
group by l.id;

create or replace view public.speakers_with_details as
select
  s.id, s.profile_id, p.full_name, p.email, s.organization, s.expertise_area, s.approval_status,
  count(ls.lecture_id) as lecture_count
from public.speakers s
join public.profiles p on s.profile_id = p.id
left join public.lecture_speakers ls on s.id = ls.speaker_id
group by s.id, p.full_name, p.email;

-- FUNCTIONS

create or replace function public.get_user_upcoming_lectures(user_id uuid)
returns table (
  lecture_id uuid,
  title text,
  date date,
  start_time time,
  speakers text,
  status text
) as $$
select
  l.id, l.title, l.date, l.start_time,
  string_agg(p.full_name, ', ') as speakers,
  e.status
from public.enrollments e
join public.lectures l on e.lecture_id = l.id
left join public.lecture_speakers ls on l.id = ls.lecture_id
left join public.speakers s on ls.speaker_id = s.id
left join public.profiles p on s.profile_id = p.id
where e.participant_id = $1 and l.date >= current_date and e.status = 'confirmed'
group by l.id, e.status
order by l.date, l.start_time;
$$ language sql;

-- FIM

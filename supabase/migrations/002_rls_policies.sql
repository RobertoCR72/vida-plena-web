alter table public.profiles enable row level security;
alter table public.speakers enable row level security;
alter table public.lectures enable row level security;
alter table public.lecture_speakers enable row level security;
alter table public.enrollments enable row level security;
alter table public.personal_schedule enable row level security;
alter table public.attendance enable row level security;
alter table public.notifications enable row level security;
alter table public.lecture_feedback enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.current_profile_role()
returns text
language sql
stable
security invoker
set search_path = public
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'admin', false)
$$;

create or replace function public.is_lecture_manager()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('admin','lecture_manager'), false)
$$;

create or replace function public.is_speaker_for_lecture(target_lecture_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.lecture_speakers ls
    join public.speakers s on s.id = ls.speaker_id
    where ls.lecture_id = target_lecture_id
      and s.profile_id = (select auth.uid())
      and s.approval_status = 'approved'
  )
$$;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_admin());
create policy "profiles_insert_self_public_roles" on public.profiles for insert to authenticated
with check (id = (select auth.uid()) and role in ('participant','speaker'));
create policy "profiles_update_own_or_admin" on public.profiles for update to authenticated
using (id = (select auth.uid()) or public.is_admin())
with check (id = (select auth.uid()) or public.is_admin());

create policy "speakers_select_allowed" on public.speakers for select to authenticated
using (profile_id = (select auth.uid()) or public.is_admin() or public.is_lecture_manager());
create policy "speakers_insert_self" on public.speakers for insert to authenticated
with check (profile_id = (select auth.uid()));
create policy "speakers_update_admin_or_self" on public.speakers for update to authenticated
using (public.is_admin() or profile_id = (select auth.uid()))
with check (public.is_admin() or profile_id = (select auth.uid()));

create policy "lectures_public_select" on public.lectures for select to anon, authenticated
using (status = 'published' or public.is_lecture_manager() or public.is_speaker_for_lecture(id));
create policy "lectures_manage" on public.lectures for insert to authenticated
with check (public.is_lecture_manager());
create policy "lectures_update_manager_or_speaker_summary" on public.lectures for update to authenticated
using (public.is_lecture_manager() or public.is_speaker_for_lecture(id))
with check (public.is_lecture_manager() or public.is_speaker_for_lecture(id));
create policy "lectures_delete_admin" on public.lectures for delete to authenticated
using (public.is_admin());

create policy "lecture_speakers_select" on public.lecture_speakers for select to authenticated
using (public.is_lecture_manager() or public.is_speaker_for_lecture(lecture_id));
create policy "lecture_speakers_manage" on public.lecture_speakers for all to authenticated
using (public.is_lecture_manager())
with check (public.is_lecture_manager());

create policy "enrollments_select_allowed" on public.enrollments for select to authenticated
using (
  participant_id = (select auth.uid())
  or public.is_lecture_manager()
  or public.is_speaker_for_lecture(lecture_id)
);
create policy "enrollments_insert_self" on public.enrollments for insert to authenticated
with check (participant_id = (select auth.uid()));
create policy "enrollments_update_self_or_manager" on public.enrollments for update to authenticated
using (participant_id = (select auth.uid()) or public.is_lecture_manager())
with check (participant_id = (select auth.uid()) or public.is_lecture_manager());

create policy "schedule_select_own" on public.personal_schedule for select to authenticated
using (user_id = (select auth.uid()) or public.is_admin());
create policy "schedule_insert_own" on public.personal_schedule for insert to authenticated
with check (user_id = (select auth.uid()));
create policy "schedule_delete_own" on public.personal_schedule for delete to authenticated
using (user_id = (select auth.uid()));

create policy "attendance_select_allowed" on public.attendance for select to authenticated
using (
  public.is_lecture_manager()
  or exists (select 1 from public.enrollments e where e.id = enrollment_id and e.participant_id = (select auth.uid()))
);
create policy "attendance_manage_admin_manager" on public.attendance for all to authenticated
using (public.is_lecture_manager())
with check (public.is_lecture_manager());

create policy "notifications_select_own_or_admin" on public.notifications for select to authenticated
using (user_id = (select auth.uid()) or public.is_admin());
create policy "notifications_insert_admin_manager" on public.notifications for insert to authenticated
with check (public.is_lecture_manager());

create policy "feedback_select_allowed" on public.lecture_feedback for select to authenticated
using (
  public.is_lecture_manager()
  or exists (select 1 from public.enrollments e where e.id = enrollment_id and e.participant_id = (select auth.uid()))
);
create policy "feedback_insert_confirmed_participant" on public.lecture_feedback for insert to authenticated
with check (
  exists (
    select 1 from public.enrollments e
    join public.attendance a on a.enrollment_id = e.id
    where e.id = enrollment_id and e.participant_id = (select auth.uid()) and a.checked_in = true
  )
);

create policy "audit_select_admin" on public.audit_logs for select to authenticated
using (public.is_admin());
create policy "audit_insert_authenticated" on public.audit_logs for insert to authenticated
with check (user_id = (select auth.uid()) or public.is_lecture_manager());

export type UserRole = 'admin' | 'lecture_manager' | 'speaker' | 'participant'
export type AccountStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type SpeakerApprovalStatus = 'pending' | 'approved' | 'rejected'
export type TalkStatus = 'draft' | 'published' | 'encerrada' | 'cancelled' | 'archived'
export type EnrollmentStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'waitlist'
export type CheckinStatus = 'not_started' | 'checked_in' | 'no_show'
export type NotificationChannel = 'email' | 'whatsapp' | 'in_app'
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'simulated'

export interface Profile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone_whatsapp: string | null
  city: string | null
  state: string | null
  role: UserRole
  account_status: AccountStatus
  created_at: string
  updated_at: string
}

export interface SpeakerProfile {
  id: string
  profile_id: string
  professional_title: string | null
  bio: string | null
  organization: string | null
  linkedin_url: string | null
  expertise_area: string | null
  approval_status: SpeakerApprovalStatus
  approved_by: string | null
  approved_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface Talk {
  id: string
  title: string
  description: string | null
  content_summary: string | null
  category: string | null
  date: string
  start_time: string
  end_time: string
  duration_minutes: number
  room: string | null
  capacity: number
  status: TalkStatus
  cover_image_url: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface TalkSpeaker {
  id: string
  talk_id: string
  speaker_profile_id: string
  speaker_order: number
  created_at: string
}

export interface Enrollment {
  id: string
  talk_id: string
  participant_profile_id: string
  status: EnrollmentStatus
  requested_at: string
  confirmed_at: string | null
  confirmed_by: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  waitlist_position: number | null
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  talk_id: string
  participant_profile_id: string
  enrollment_id: string | null
  checkin_status: CheckinStatus
  checked_in_at: string | null
  checked_in_by: string | null
  qr_code_token: string | null
  created_at: string
  updated_at: string
}

export interface Feedback {
  id: string
  talk_id: string
  participant_profile_id: string
  rating: number | null
  comment: string | null
  created_at: string
}

export interface Certificate {
  id: string
  talk_id: string
  participant_profile_id: string
  certificate_code: string
  issued_at: string
  certificate_url: string | null
  created_at: string
}

export interface Notification {
  id: string
  recipient_profile_id: string
  channel: NotificationChannel
  subject: string
  message: string
  status: NotificationStatus
  provider_response: string | null
  sent_at: string | null
  created_at: string
}

export interface AuditLog {
  id: string
  actor_profile_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

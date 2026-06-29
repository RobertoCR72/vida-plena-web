export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone_whatsapp: string | null
          city: string | null
          state: string | null
          role: 'admin' | 'lecture_manager' | 'speaker' | 'participant'
          account_status: 'pending' | 'approved' | 'rejected' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone_whatsapp?: string | null
          city?: string | null
          state?: string | null
          role: 'admin' | 'lecture_manager' | 'speaker' | 'participant'
          account_status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone_whatsapp?: string | null
          city?: string | null
          state?: string | null
          role?: 'admin' | 'lecture_manager' | 'speaker' | 'participant'
          account_status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      speaker_profiles: {
        Row: {
          id: string
          profile_id: string
          professional_title: string | null
          bio: string | null
          organization: string | null
          linkedin_url: string | null
          expertise_area: string | null
          approval_status: 'pending' | 'approved' | 'rejected'
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          professional_title?: string | null
          bio?: string | null
          organization?: string | null
          linkedin_url?: string | null
          expertise_area?: string | null
          approval_status?: 'pending' | 'approved' | 'rejected'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          professional_title?: string | null
          bio?: string | null
          organization?: string | null
          linkedin_url?: string | null
          expertise_area?: string | null
          approval_status?: 'pending' | 'approved' | 'rejected'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'speaker_profiles_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      talks: {
        Row: {
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
          status: 'draft' | 'published' | 'encerrada' | 'cancelled' | 'archived'
          cover_image_url: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content_summary?: string | null
          category?: string | null
          date: string
          start_time: string
          end_time: string
          duration_minutes: number
          room?: string | null
          capacity?: number
          status?: 'draft' | 'published' | 'encerrada' | 'cancelled' | 'archived'
          cover_image_url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content_summary?: string | null
          category?: string | null
          date?: string
          start_time?: string
          end_time?: string
          duration_minutes?: number
          room?: string | null
          capacity?: number
          status?: 'draft' | 'published' | 'encerrada' | 'cancelled' | 'archived'
          cover_image_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          id: string
          talk_id: string
          participant_profile_id: string
          status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'waitlist'
          requested_at: string
          confirmed_at: string | null
          confirmed_by: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          waitlist_position: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          talk_id: string
          participant_profile_id: string
          status?: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'waitlist'
          requested_at?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          waitlist_position?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          talk_id?: string
          participant_profile_id?: string
          status?: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'waitlist'
          requested_at?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          waitlist_position?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          id: string
          talk_id: string
          participant_profile_id: string
          enrollment_id: string | null
          checkin_status: 'not_started' | 'checked_in' | 'no_show'
          checked_in_at: string | null
          checked_in_by: string | null
          qr_code_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          talk_id: string
          participant_profile_id: string
          enrollment_id?: string | null
          checkin_status?: 'not_started' | 'checked_in' | 'no_show'
          checked_in_at?: string | null
          checked_in_by?: string | null
          qr_code_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          talk_id?: string
          participant_profile_id?: string
          enrollment_id?: string | null
          checkin_status?: 'not_started' | 'checked_in' | 'no_show'
          checked_in_at?: string | null
          checked_in_by?: string | null
          qr_code_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          id: string
          talk_id: string
          participant_profile_id: string
          rating: number | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          talk_id: string
          participant_profile_id: string
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          talk_id?: string
          participant_profile_id?: string
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          id: string
          talk_id: string
          participant_profile_id: string
          certificate_code: string
          issued_at: string
          certificate_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          talk_id: string
          participant_profile_id: string
          certificate_code: string
          issued_at?: string
          certificate_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          talk_id?: string
          participant_profile_id?: string
          certificate_code?: string
          issued_at?: string
          certificate_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          recipient_profile_id: string
          channel: 'email' | 'whatsapp' | 'in_app'
          subject: string
          message: string
          status: 'pending' | 'sent' | 'failed' | 'simulated'
          provider_response: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipient_profile_id: string
          channel: 'email' | 'whatsapp' | 'in_app'
          subject: string
          message: string
          status?: 'pending' | 'sent' | 'failed' | 'simulated'
          provider_response?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipient_profile_id?: string
          channel?: 'email' | 'whatsapp' | 'in_app'
          subject?: string
          message?: string
          status?: 'pending' | 'sent' | 'failed' | 'simulated'
          provider_response?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          actor_profile_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_profile_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_profile_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

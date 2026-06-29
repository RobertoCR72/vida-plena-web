import { createClient } from '@/lib/supabase/client'
import { Profile, SpeakerProfile } from '@/types/database'

const supabase = createClient()

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    return data
  },

  async getProfileById(id: string): Promise<Profile | null> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    return data
  },

  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getSpeakerProfile(profileId: string): Promise<SpeakerProfile | null> {
    const { data } = await supabase
      .from('speaker_profiles')
      .select('*')
      .eq('profile_id', profileId)
      .single()
    return data
  },

  async getPendingSpeakers(): Promise<SpeakerProfile[]> {
    const { data } = await supabase
      .from('speaker_profiles')
      .select('*, profile:profiles(*)')
      .eq('approval_status', 'pending')
    return data || []
  },

  async approveSpeaker(speakerId: string, approvedBy: string) {
    const { data, error } = await supabase
      .from('speaker_profiles')
      .update({
        approval_status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      })
      .eq('id', speakerId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async rejectSpeaker(speakerId: string, reason: string) {
    const { data, error } = await supabase
      .from('speaker_profiles')
      .update({
        approval_status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', speakerId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getAllProfiles() {
    const { data } = await supabase.from('profiles').select('*')
    return data || []
  },
}

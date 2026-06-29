import { createClient } from '@/lib/supabase/client'
import { Talk } from '@/types/database'

const supabase = createClient()

export const talksService = {
  async getPublishedTalks() {
    const { data } = await supabase
      .from('talks')
      .select('*, talk_speakers(*, speaker_profiles(*, profiles(*)))')
      .eq('status', 'published')
      .order('date', { ascending: true })
    return data || []
  },

  async getTalk(id: string) {
    const { data } = await supabase
      .from('talks')
      .select('*, talk_speakers(*, speaker_profiles(*, profiles(*)))')
      .eq('id', id)
      .single()
    return data
  },

  async getAllTalks() {
    const { data } = await supabase
      .from('talks')
      .select('*, talk_speakers(*, speaker_profiles(*, profiles(*)))')
      .order('date', { ascending: true })
    return data || []
  },

  async createTalk(talk: Omit<Talk, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('talks')
      .insert(talk)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateTalk(id: string, updates: Partial<Talk>) {
    const { data, error } = await supabase
      .from('talks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async publishTalk(id: string) {
    return this.updateTalk(id, { status: 'published' })
  },

  async getTalksByDate(date: string) {
    const { data } = await supabase
      .from('talks')
      .select('*, talk_speakers(*, speaker_profiles(*, profiles(*)))')
      .eq('date', date)
      .eq('status', 'published')
      .order('start_time', { ascending: true })
    return data || []
  },

  async getParallelTalks(talkId: string) {
    const talk = await this.getTalk(talkId) as unknown as
      | { date: string; start_time: string; end_time: string }
      | null
    if (!talk) return []

    const { data } = await supabase
      .from('talks')
      .select('*')
      .eq('date', talk.date)
      .eq('status', 'published')
      .neq('id', talkId)
      .lt('start_time', talk.end_time)
      .gt('end_time', talk.start_time)
    return data || []
  },

  async getEnrolledParticipants(talkId: string) {
    const { data } = await supabase
      .from('enrollments')
      .select('*, profiles:participant_profile_id(*)')
      .eq('talk_id', talkId)
      .eq('status', 'confirmed')
    return data || []
  },
}

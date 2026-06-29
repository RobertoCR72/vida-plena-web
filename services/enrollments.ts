import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export const enrollmentsService = {
  async getUserEnrollments(profileId: string) {
    const { data } = await supabase
      .from('enrollments')
      .select('*, talks(*, talk_speakers(*, speaker_profiles(*, profiles(*))))')
      .eq('participant_profile_id', profileId)
      .order('requested_at', { ascending: false })
    return data || []
  },

  async getTalkEnrollments(talkId: string) {
    const { data } = await supabase
      .from('enrollments')
      .select('*, profiles:participant_profile_id(*)')
      .eq('talk_id', talkId)
      .order('requested_at', { ascending: false })
    return data || []
  },

  async getPendingEnrollments() {
    const { data } = await supabase
      .from('enrollments')
      .select('*, talks(*), profiles:participant_profile_id(*)')
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })
    return data || []
  },

  async createEnrollment(talkId: string, participantId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        talk_id: talkId,
        participant_profile_id: participantId,
        status: 'pending',
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async approveEnrollment(enrollmentId: string, approvedBy: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmed_by: approvedBy,
      })
      .eq('id', enrollmentId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async rejectEnrollment(enrollmentId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ status: 'rejected' })
      .eq('id', enrollmentId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async cancelEnrollment(enrollmentId: string, reason?: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
      })
      .eq('id', enrollmentId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getEnrollmentStatus(talkId: string, participantId: string) {
    const { data } = await supabase
      .from('enrollments')
      .select('*')
      .eq('talk_id', talkId)
      .eq('participant_profile_id', participantId)
      .single()
    return data
  },

  async checkConflict(participantId: string, talkId: string) {
    const talk = await (await import('./talks').then(m => m.talksService.getTalk(talkId))) as unknown as
      | { date: string; start_time: string; end_time: string }
      | null

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*, talks(*)')
      .eq('participant_profile_id', participantId)
      .eq('status', 'confirmed')

    if (!enrollments || !talk) return false

    const confirmedEnrollments = enrollments as unknown as Array<{
      talks: { date: string; start_time: string; end_time: string } | null
    }>

    return confirmedEnrollments.some(e => {
      const other = e.talks
      return Boolean(
        other &&
        other.date === talk.date &&
        !(other.end_time <= talk.start_time || other.start_time >= talk.end_time),
      )
    })
  },
}

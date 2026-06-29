import { createClient } from '@/lib/supabase/client'
import { Notification } from '@/types/database'

const supabase = createClient()

export const notificationsService = {
  async sendNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        status: 'simulated', // Default to simulated, will be overridden if real integration is available
      })
      .select()
      .single()
    if (error) throw error

    // TODO: Add real email/WhatsApp integration here if env vars are set
    // For now, everything is simulated

    return data
  },

  async getUserNotifications(profileId: string) {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_profile_id', profileId)
      .order('created_at', { ascending: false })
    return data || []
  },

  async getAllNotifications() {
    const { data } = await supabase
      .from('notifications')
      .select('*, profiles:recipient_profile_id(*)')
      .order('created_at', { ascending: false })
    return data || []
  },

  async notifyEnrollmentApproved(participantId: string, talkTitle: string) {
    return this.sendNotification({
      recipient_profile_id: participantId,
      channel: 'email',
      subject: 'Inscrição Confirmada',
      message: `Sua inscrição na palestra "${talkTitle}" foi confirmada!`,
      provider_response: null,
      sent_at: new Date().toISOString(),
      status: 'simulated',
    })
  },

  async notifySpeakerApproved(profileId: string) {
    return this.sendNotification({
      recipient_profile_id: profileId,
      channel: 'email',
      subject: 'Cadastro de Palestrante Aprovado',
      message: 'Seu cadastro como palestrante foi aprovado! Você agora pode enviar materiais.',
      provider_response: null,
      sent_at: new Date().toISOString(),
      status: 'simulated',
    })
  },

  async notifyFileUploaded(enrolledProfileIds: string[], fileName: string, talkTitle: string) {
    const notifications = enrolledProfileIds.map(profileId => ({
      recipient_profile_id: profileId,
      channel: 'email' as const,
      subject: 'Novo Material Disponível',
      message: `Um novo arquivo "${fileName}" foi adicionado à palestra "${talkTitle}"`,
      provider_response: null as string | null,
      sent_at: new Date().toISOString(),
      status: 'simulated' as const,
    }))

    for (const notif of notifications) {
      await this.sendNotification(notif)
    }
  },

  async notifyCertificateIssued(profileId: string, talkTitle: string) {
    return this.sendNotification({
      recipient_profile_id: profileId,
      channel: 'email',
      subject: 'Certificado Disponível',
      message: `Seu certificado de participação na palestra "${talkTitle}" está pronto!`,
      provider_response: null,
      sent_at: new Date().toISOString(),
      status: 'simulated',
    })
  },
}

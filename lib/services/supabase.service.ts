import { createClient } from '@/utils/supabase/client'
import type { Talk, Enrollment, SpeakerProfile } from '@/types/database'

// Tipos para inserção (sem campos auto-gerados)
type Lecture = Talk
type LectureInsert = Omit<Talk, 'id' | 'created_at' | 'updated_at'>
type EnrollmentInsert = Omit<Enrollment, 'id' | 'created_at' | 'updated_at' | 'confirmed_at' | 'cancelled_at'>
type Speaker = SpeakerProfile
type SpeakerInsert = Omit<SpeakerProfile, 'id' | 'created_at' | 'updated_at' | 'approved_at'>
type AuditLogInsert = any // Será definido no schema

const supabase = createClient()

// ============= LECTURES =============

export async function fetchLectures() {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Erro ao buscar palestras:', error?.message || error)
    return []
  }
  return data || []
}

export async function fetchLectureById(lectureId: string) {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('id', lectureId)
    .single()

  if (error) {
    console.error('Erro ao buscar palestra:', error)
    return null
  }
  return data
}

export async function createLecture(lectureData: LectureInsert) {
  const { data, error } = await supabase
    .from('lectures')
    .insert([lectureData])
    .select()

  if (error) {
    console.error('Erro ao criar palestra:', error)
    throw new Error(`Erro ao criar palestra: ${error.message}`)
  }
  return data?.[0] || null
}

export async function updateLecture(lectureId: string, lectureData: Partial<LectureInsert>) {
  const { data, error } = await supabase
    .from('lectures')
    .update({
      ...lectureData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', lectureId)
    .select()

  if (error) {
    console.error('Erro ao atualizar palestra:', error)
    throw new Error(`Erro ao atualizar palestra: ${error.message}`)
  }
  return data?.[0] || null
}

export async function deleteLecture(lectureId: string) {
  const { error } = await supabase
    .from('lectures')
    .delete()
    .eq('id', lectureId)

  if (error) {
    console.error('Erro ao deletar palestra:', error)
    throw new Error(`Erro ao deletar palestra: ${error.message}`)
  }
}

// ============= ENROLLMENTS =============

export async function fetchEnrollments() {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar inscrições:', error?.message || error)
    return []
  }
  return data || []
}

export async function fetchEnrollmentsByLecture(lectureId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('lecture_id', lectureId)

  if (error) {
    console.error('Erro ao buscar inscrições da palestra:', error)
    return []
  }
  return data || []
}

export async function createEnrollment(enrollmentData: EnrollmentInsert) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert([enrollmentData])
    .select()

  if (error) {
    console.error('Erro ao criar inscrição:', error)
    throw new Error(`Erro ao criar inscrição: ${error.message}`)
  }
  return data?.[0] || null
}

export async function updateEnrollment(enrollmentId: string, enrollmentData: Partial<EnrollmentInsert>) {
  const { data, error } = await supabase
    .from('enrollments')
    .update({
      ...enrollmentData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', enrollmentId)
    .select()

  if (error) {
    console.error('Erro ao atualizar inscrição:', error)
    throw new Error(`Erro ao atualizar inscrição: ${error.message}`)
  }
  return data?.[0] || null
}

export async function deleteEnrollment(enrollmentId: string) {
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('id', enrollmentId)

  if (error) {
    console.error('Erro ao deletar inscrição:', error)
    throw new Error(`Erro ao deletar inscrição: ${error.message}`)
  }
}

// ============= SPEAKERS =============

export async function fetchSpeakers() {
  const { data, error } = await supabase
    .from('speakers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar palestrantes:', error?.message || error)
    return []
  }
  return data || []
}

export async function fetchSpeakerById(speakerId: string) {
  const { data, error } = await supabase
    .from('speakers')
    .select('*')
    .eq('id', speakerId)
    .single()

  if (error) {
    console.error('Erro ao buscar palestrante:', error)
    return null
  }
  return data
}

export async function updateSpeaker(speakerId: string, speakerData: Partial<Speaker>) {
  const { data, error } = await supabase
    .from('speakers')
    .update({
      ...speakerData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', speakerId)
    .select()

  if (error) {
    console.error('Erro ao atualizar palestrante:', error)
    throw new Error(`Erro ao atualizar palestrante: ${error.message}`)
  }
  return data?.[0] || null
}

// ============= AUDIT LOGS =============

export async function fetchAuditLogs() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Erro ao buscar logs de auditoria:', error)
    return []
  }
  return data || []
}

export async function createAuditLog(logData: AuditLogInsert) {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert([logData])

    if (error) {
      // Silenciosamente ignorar - auditoria é não-crítica
      return
    }
  } catch (err) {
    // Silenciosamente ignorar erros de auditoria
  }
}

// ============= REAL-TIME SUBSCRIPTIONS =============
// Nota: Usando polling (2s) em vez de WebSockets para MVP
// Real-time subscriptions podem ser adicionadas depois se necessário

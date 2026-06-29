'use client'

/**
 * Adaptador que mantém a interface atual mas usa Supabase
 * Substitui lib/local-demo-store.ts gradualmente
 */

import * as supabaseService from '@/lib/services/supabase.service'
import { demoLectures, demoEnrollments, demoSpeakers, demoAuditLogs, type DemoEnrollment, type DemoLecture } from '@/lib/demo-data'
import { saveEnrollmentChange, saveSpeakerChange, saveLectureChange, deleteLectureChange, addLectureChange } from '@/lib/demo-persistence'
import type { Talk, Enrollment, SpeakerProfile } from '@/types/database'

type Lecture = Talk
type EnrollmentRow = Enrollment
type Speaker = SpeakerProfile

// ============= HELPERS =============

/**
 * Detecta se um ID é de demo data (começa com prefixo demo-like)
 */
function isDemoId(id: string): boolean {
  return /^(demo-|enrollment-|enr-|speaker-|lecture-)/.test(id)
}

// ============= CONVERSÃO DE TIPOS =============

/**
 * Converte um registro de Lecture do Supabase para DemoLecture (formato frontend)
 */
function lectureToDemo(lecture: any): DemoLecture {
  return {
    id: lecture.id,
    title: lecture.title,
    description: lecture.description || '',
    category: lecture.category || 'geral',
    date: lecture.date,
    startTime: lecture.start_time,
    endTime: lecture.end_time,
    room: lecture.room || 'Não definida',
    capacity: lecture.capacity,
    confirmed: 0,
    theme: lecture.theme || 'Geral',
    status: (lecture.status as 'draft' | 'published' | 'closed' | 'cancelled') || 'draft',
    contentSummary: lecture.content_summary || '',
    durationMinutes: lecture.duration_minutes || 60,
    location: lecture.location || 'Não definida',
    speakers: [],
    pending: 0,
    waitlisted: 0,
    rating: 0,
  } as unknown as DemoLecture
}

/**
 * Converte um DemoLecture para formato de insert do Supabase
 */
function lectureFromDemo(demo: DemoLecture, createdByUserId?: string) {
  return {
    title: demo.title,
    theme: demo.theme,
    description: demo.description,
    category: demo.category,
    date: demo.date,
    start_time: demo.startTime,
    end_time: demo.endTime,
    duration_minutes: Math.ceil((new Date(`${demo.date}T${demo.endTime}`).getTime() - new Date(`${demo.date}T${demo.startTime}`).getTime()) / 60000),
    room: demo.room,
    capacity: demo.capacity,
    status: demo.status as 'draft' | 'published' | 'closed' | 'cancelled',
    created_by: createdByUserId,
  }
}

/**
 * Converte um Enrollment do Supabase para DemoEnrollment (formato frontend)
 */
function enrollmentToDemo(enrollment: any, lecture?: DemoLecture): DemoEnrollment {
  return {
    id: enrollment.id,
    lectureId: enrollment.lecture_id,
    participant: `Participante ${enrollment.participant_id?.slice(0, 8) || 'desconhecido'}`,
    status: (enrollment.status as 'pending' | 'confirmed' | 'waitlist' | 'cancelled' | 'rejected') || 'pending',
    state: enrollment.status || 'pending',
    checkedIn: false, // Será verificado na tabela attendance
    email: '',
    whatsapp: '',
  } as unknown as DemoEnrollment
}

/**
 * Converte um Speaker do Supabase para o formato StoredSpeaker (frontend)
 */
function speakerToStored(speaker: Speaker) {
  return {
    id: speaker.id,
    name: speaker.bio || 'Palestrante',
    organization: speaker.organization || 'Não informada',
    expertise: speaker.expertise_area || 'Geral',
    status: (speaker.approval_status as 'approved' | 'pending' | 'rejected') || 'pending',
  }
}

// ============= LECTURES =============

export async function loadStoredLectures(): Promise<DemoLecture[]> {
  try {
    const lectures = await supabaseService.fetchLectures()
    const mapped = lectures.map(lectureToDemo)
    return mapped.length > 0 ? mapped : demoLectures
  } catch (error) {
    console.error('Erro ao carregar palestras do Supabase:', error)
    return demoLectures
  }
}

export async function saveStoredLectures(lectures: DemoLecture[], userId?: string) {
  // Esta função seria chamada para sincronizar mudanças locais com Supabase
  // Por enquanto, apenas log
  console.log('Sincronizando palestras com Supabase:', lectures)
}

export async function createStoredLecture(lecture: DemoLecture, userId?: string) {
  try {
    // Se for ID de demo, salvar em localStorage
    if (isDemoId(lecture.id)) {
      addLectureChange(lecture)
      return lecture
    }
    const lectureData = lectureFromDemo(lecture, userId) as any
    const created = await supabaseService.createLecture(lectureData)
    return created ? lectureToDemo(created) : null
  } catch (error) {
    console.error('Erro ao criar palestra:', error)
    throw error
  }
}

export async function updateStoredLecture(lectureId: string, lecture: Partial<DemoLecture>, userId?: string) {
  try {
    // Se for ID de demo, salvar em localStorage
    if (isDemoId(lectureId)) {
      const existing = demoLectures.find((l) => l.id === lectureId)
      const merged = existing ? { ...existing, ...lecture } : lecture
      saveLectureChange(lectureId, merged as DemoLecture)
      return merged as DemoLecture
    }
    const updates = lectureFromDemo(lecture as DemoLecture, userId) as any
    const updated = await supabaseService.updateLecture(lectureId, updates)
    return updated ? lectureToDemo(updated) : null
  } catch (error) {
    console.error('Erro ao atualizar palestra:', error)
    throw error
  }
}

export async function deleteStoredLecture(lectureId: string) {
  try {
    // Se for ID de demo, marcar como deletada em localStorage
    if (isDemoId(lectureId)) {
      deleteLectureChange(lectureId)
      return
    }
    await supabaseService.deleteLecture(lectureId)
  } catch (error) {
    console.error('Erro ao deletar palestra:', error)
    throw error
  }
}

// ============= ENROLLMENTS =============

export async function loadStoredEnrollments(): Promise<DemoEnrollment[]> {
  try {
    const enrollments = await supabaseService.fetchEnrollments()
    const lectures = await supabaseService.fetchLectures()
    const lectureMap = new Map(lectures.map(l => [l.id, l]))

    const mapped = enrollments.map(enr => {
      const lecture = lectureMap.get(enr.lecture_id)
      return enrollmentToDemo(enr, lecture ? lectureToDemo(lecture) : undefined)
    })
    return mapped.length > 0 ? mapped : demoEnrollments
  } catch (error) {
    console.error('Erro ao carregar inscrições do Supabase:', error)
    return demoEnrollments
  }
}

export async function saveStoredEnrollments(enrollments: DemoEnrollment[]) {
  console.log('Sincronizando inscrições com Supabase:', enrollments)
}

export async function updateStoredEnrollment(enrollmentId: string, status: string) {
  try {
    // Se for ID de demo, salvar em localStorage
    if (isDemoId(enrollmentId)) {
      const enrollment = demoEnrollments.find((e) => e.id === enrollmentId)
      if (enrollment) {
        saveEnrollmentChange(enrollmentId, { ...enrollment, status, state: status })
      }
      return { id: enrollmentId, status }
    }
    const updated = await supabaseService.updateEnrollment(enrollmentId, {
      status: status as 'pending' | 'confirmed' | 'waitlist' | 'cancelled' | 'rejected',
    })
    return updated
  } catch (error) {
    console.error('Erro ao atualizar inscrição:', error)
    throw error
  }
}

// ============= SPEAKERS =============

export async function loadStoredSpeakers() {
  try {
    const speakers = await supabaseService.fetchSpeakers()
    const mapped = speakers.map(speakerToStored)
    return mapped.length > 0 ? mapped : demoSpeakers
  } catch (error) {
    console.error('Erro ao carregar palestrantes do Supabase:', error)
    return demoSpeakers
  }
}

export async function saveStoredSpeakers(speakers: any[]) {
  console.log('Sincronizando palestrantes com Supabase:', speakers)
}

export async function updateStoredSpeaker(speakerId: string, status: string) {
  try {
    // Se for ID de demo, salvar em localStorage
    if (isDemoId(speakerId)) {
      const speaker = demoSpeakers.find((s) => s.id === speakerId)
      if (speaker) {
        saveSpeakerChange(speakerId, { ...speaker, status })
      }
      return { id: speakerId, status }
    }
    const updated = await supabaseService.updateSpeaker(speakerId, {
      approval_status: status as 'approved' | 'pending' | 'rejected',
    })
    return updated
  } catch (error) {
    console.error('Erro ao atualizar palestrante:', error)
    throw error
  }
}

// ============= AUDIT LOGS =============

export async function appendAudit(actor: string, action: string, entity: string, detail: string) {
  try {
    await supabaseService.createAuditLog({
      actor_id: null, // Será preenchido pelo RLS ou trigger
      action,
      entity_type: entity,
      entity_id: null,
      description: detail,
      metadata: { actor },
    })
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error)
    // Não lançar erro em auditoria
  }
}

export async function loadAuditLogs() {
  try {
    const logs = await supabaseService.fetchAuditLogs()
    return logs.length > 0 ? logs : []
  } catch (error) {
    console.error('Erro ao carregar logs de auditoria:', error)
    return []
  }
}

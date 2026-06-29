'use client'

/**
 * Sistema de persistência para dados de demo em localStorage
 * Permite que alterações em dados de demo sejam salvas e recuperadas
 */

const STORAGE_KEY = 'vida-plena-demo-changes'

export interface DemoChanges {
  enrollments: Record<string, any>
  speakers: Record<string, any>
  lectures: Record<string, any>
}

/**
 * Obter todas as alterações salvas
 */
export function getDemoChanges(): DemoChanges {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { enrollments: {}, speakers: {}, lectures: {} }
  } catch {
    return { enrollments: {}, speakers: {}, lectures: {} }
  }
}

/**
 * Salvar alteração de enrollment
 */
export function saveEnrollmentChange(id: string, enrollment: any) {
  const changes = getDemoChanges()
  changes.enrollments[id] = enrollment
  localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
}

/**
 * Salvar alteração de speaker
 */
export function saveSpeakerChange(id: string, speaker: any) {
  const changes = getDemoChanges()
  changes.speakers[id] = speaker
  localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
}

/**
 * Salvar alteração de lecture
 */
export function saveLectureChange(id: string, lecture: any) {
  const changes = getDemoChanges()
  changes.lectures[id] = lecture
  localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
}

/**
 * Deletar lecture (marcar como deletada)
 */
export function deleteLectureChange(id: string) {
  const changes = getDemoChanges()
  if (!changes.lectures[id]) {
    changes.lectures[id] = { _deleted: true }
  } else {
    changes.lectures[id]._deleted = true
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
}

/**
 * Adicionar nova lecture
 */
export function addLectureChange(lecture: any) {
  const changes = getDemoChanges()
  changes.lectures[lecture.id] = lecture
  localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
}

/**
 * Mesclar dados de demo com alterações salvas (para enrollments)
 */
export function mergeEnrollmentsWithChanges(demoEnrollments: any[]): any[] {
  const changes = getDemoChanges()

  return demoEnrollments
    .map((enrollment) => ({
      ...enrollment,
      ...changes.enrollments[enrollment.id],
    }))
    .filter((enrollment) => !changes.enrollments[enrollment.id]?._deleted)
}

/**
 * Mesclar dados de demo com alterações salvas (para speakers)
 */
export function mergeSpeakersWithChanges(demoSpeakers: any[]): any[] {
  const changes = getDemoChanges()

  return demoSpeakers
    .map((speaker) => ({
      ...speaker,
      ...changes.speakers[speaker.id],
    }))
    .filter((speaker) => !changes.speakers[speaker.id]?._deleted)
}

/**
 * Mesclar dados de demo com alterações salvas (para lectures)
 */
export function mergeLecturesWithChanges(demoLectures: any[]): any[] {
  const changes = getDemoChanges()

  // Filtrar deletadas e aplicar mudanças
  const merged = demoLectures
    .filter((lecture) => !changes.lectures[lecture.id]?._deleted)
    .map((lecture) => ({
      ...lecture,
      ...changes.lectures[lecture.id],
    }))

  // Adicionar novas lectures criadas
  for (const id in changes.lectures) {
    if (!demoLectures.find((l) => l.id === id) && !changes.lectures[id]._deleted) {
      merged.push(changes.lectures[id])
    }
  }

  return merged
}

/**
 * Limpar todas as alterações
 */
export function clearDemoChanges() {
  localStorage.removeItem(STORAGE_KEY)
}

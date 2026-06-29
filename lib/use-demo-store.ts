'use client'

import { useSyncExternalStore } from 'react'
import {
  loadAuditLogs,
  loadStoredEnrollments,
  loadStoredLectures,
  loadStoredSpeakers,
  storageKeys,
  subscribeToStoredValue,
} from './local-demo-store'
import { demoAuditLogs, demoEnrollments, demoLectures, demoSpeakers } from './demo-data'

function useStoredSnapshot<T>(key: string, load: () => T, fallback: T) {
  const getSnapshot = () => JSON.stringify(load())
  const getServerSnapshot = () => JSON.stringify(fallback)
  const snapshot = useSyncExternalStore(
    (callback) => subscribeToStoredValue(key, callback),
    getSnapshot,
    getServerSnapshot,
  )

  return JSON.parse(snapshot) as T
}

export function useStoredSpeakers() {
  return useStoredSnapshot(storageKeys.speakers, loadStoredSpeakers, demoSpeakers)
}

export function useStoredEnrollments() {
  return useStoredSnapshot(storageKeys.enrollments, loadStoredEnrollments, demoEnrollments)
}

export function useStoredAuditLogs() {
  return useStoredSnapshot(
    storageKeys.audit,
    loadAuditLogs,
    demoAuditLogs.map((log) => ({ ...log, createdAt: new Date(0).toISOString() })),
  )
}

export function useStoredLectures() {
  return useStoredSnapshot(storageKeys.lectures, loadStoredLectures, demoLectures)
}

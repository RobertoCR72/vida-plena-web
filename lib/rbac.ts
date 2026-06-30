/**
 * Sistema de Controle de Acesso Baseado em Roles (RBAC)
 */

export type UserRole = 'admin' | 'lecture_manager' | 'speaker' | 'participant'

export interface RolePermission {
  visibleMenuItems: string[]
  accessiblePages: string[]
  canCreateLectures: boolean
  canEditOwnLectures: boolean
  canEditAllLectures: boolean
  canDeleteLectures: boolean
  canApproveSpeakers: boolean
  canApproveEnrollments: boolean
  canRegisterAttendance: boolean
  canViewAuditLogs: boolean
  canViewNotifications: boolean
  canRequestEnrollment: boolean
  canViewOwnEnrollments: boolean
}

export const rolePermissions: Record<UserRole, RolePermission> = {
  admin: {
    visibleMenuItems: [
      'dashboard',
      'admin',
      'lectures',
      'speakers',
      'enrollments',
      'notifications',
      'privacy',
    ],
    accessiblePages: [
      '/dashboard',
      '/dashboard/admin',
      '/dashboard/admin/lectures',
      '/dashboard/admin/speakers',
      '/dashboard/admin/enrollments',
      '/dashboard/admin/notifications',
      '/dashboard/privacy',
    ],
    canCreateLectures: true,
    canEditOwnLectures: true,
    canEditAllLectures: true,
    canDeleteLectures: true,
    canApproveSpeakers: true,
    canApproveEnrollments: true,
    canRegisterAttendance: true,
    canViewAuditLogs: true,
    canViewNotifications: true,
    canRequestEnrollment: false,
    canViewOwnEnrollments: false,
  },

  lecture_manager: {
    visibleMenuItems: [
      'dashboard',
      'lectures',
      'speakers',
      'privacy',
    ],
    accessiblePages: [
      '/dashboard',
      '/dashboard/manager',
      '/dashboard/privacy',
    ],
    canCreateLectures: true,
    canEditOwnLectures: true,
    canEditAllLectures: false,
    canDeleteLectures: false,
    canApproveSpeakers: false,
    canApproveEnrollments: false,
    canRegisterAttendance: false,
    canViewAuditLogs: false,
    canViewNotifications: false,
    canRequestEnrollment: false,
    canViewOwnEnrollments: false,
  },

  speaker: {
    visibleMenuItems: [
      'dashboard',
      'lectures',
      'speakers',
      'speaker',
      'privacy',
    ],
    accessiblePages: [
      '/dashboard',
      '/dashboard/speaker',
      '/dashboard/privacy',
    ],
    canCreateLectures: true,
    canEditOwnLectures: true,
    canEditAllLectures: false,
    canDeleteLectures: false,
    canApproveSpeakers: false,
    canApproveEnrollments: false,
    canRegisterAttendance: false,
    canViewAuditLogs: false,
    canViewNotifications: false,
    canRequestEnrollment: false,
    canViewOwnEnrollments: false,
  },

  participant: {
    visibleMenuItems: [
      'dashboard',
      'participant',
      'schedule',
      'privacy',
    ],
    accessiblePages: [
      '/dashboard',
      '/dashboard/participant',
      '/dashboard/schedule',
      '/dashboard/privacy',
    ],
    canCreateLectures: false,
    canEditOwnLectures: false,
    canEditAllLectures: false,
    canDeleteLectures: false,
    canApproveSpeakers: false,
    canApproveEnrollments: false,
    canRegisterAttendance: false,
    canViewAuditLogs: false,
    canViewNotifications: false,
    canRequestEnrollment: true,
    canViewOwnEnrollments: true,
  },
}

/**
 * Obtém as permissões para um role específico
 */
export function getPermissions(role: UserRole): RolePermission {
  return rolePermissions[role] || rolePermissions.participant
}

/**
 * Verifica se um usuário tem acesso a uma página
 */
export function canAccessPage(role: UserRole, pathname: string): boolean {
  const permissions = getPermissions(role)
  return permissions.accessiblePages.some(page => pathname.startsWith(page))
}

/**
 * Obtém os itens visíveis do menu para um role
 */
export function getVisibleMenuItems(role: UserRole): string[] {
  return getPermissions(role).visibleMenuItems
}

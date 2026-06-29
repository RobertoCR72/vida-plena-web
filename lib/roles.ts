export const roles = {
  admin: "Administrador",
  lecture_manager: "Gestor de palestras",
  speaker: "Palestrante",
  participant: "Participante",
} as const;

export function canManageLectures(role: keyof typeof roles) {
  return role === "admin" || role === "lecture_manager";
}

export function canApproveUsers(role: keyof typeof roles) {
  return role === "admin";
}

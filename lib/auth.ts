import type { Role } from "./demo-data";

export function dashboardPathForRole(role: Role, status?: string) {
  if (role === "speaker" && status !== "approved") return "/pending-approval";
  if (role === "admin") return "/dashboard/admin";
  if (role === "lecture_manager") return "/dashboard/manager";
  if (role === "speaker") return "/dashboard/speaker";
  return "/dashboard/participant";
}

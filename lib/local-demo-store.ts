import {
  demoAuditLogs,
  demoEnrollments,
  demoLectures,
  demoSpeakers,
  type DemoLecture,
  type EnrollmentStatus,
  type Role,
} from "./demo-data";

export type DemoUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneWhatsapp?: string;
  city?: string;
  state?: string;
  role: Role;
  status: "active" | "pending" | "approved" | "rejected";
};

export type StoredSpeaker = {
  id: string;
  name: string;
  organization: string;
  expertise: string;
  status: "approved" | "pending" | "rejected";
};

export type AuditEntry = {
  actor: string;
  action: string;
  entity: string;
  detail: string;
  createdAt: string;
};

const USERS_KEY = "vida_plena_demo_users";
const SESSION_KEY = "vida_plena_demo_session";
const SPEAKERS_KEY = "speakers_data";
const ENROLLMENTS_KEY = "enrollments_data";
const AUDIT_KEY = "vida_plena_audit_logs";
const LECTURES_KEY = "vida_plena_lectures";
const STORE_EVENT = "vida-plena-store-change";

const adminUser: DemoUser = {
  id: "demo-admin",
  fullName: "Admin Demo",
  email: "admin.demo@vidaplena.org",
  password: "Admin@123456",
  role: "admin",
  status: "active",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key } }));
}

export function ensureDemoData() {
  if (typeof window === "undefined") return;

  const users = readJson<DemoUser[]>(USERS_KEY, []);
  if (!users.some((user) => user.email.toLowerCase() === adminUser.email)) {
    writeJson(USERS_KEY, [adminUser, ...users]);
  }

  if (!window.localStorage.getItem(SPEAKERS_KEY)) {
    writeJson(SPEAKERS_KEY, demoSpeakers);
  }
  if (!window.localStorage.getItem(ENROLLMENTS_KEY)) {
    writeJson(ENROLLMENTS_KEY, demoEnrollments);
  }
  if (!window.localStorage.getItem(LECTURES_KEY)) {
    writeJson(LECTURES_KEY, demoLectures);
  }
  if (!window.localStorage.getItem(AUDIT_KEY)) {
    writeJson(
      AUDIT_KEY,
      demoAuditLogs.map((log) => ({ ...log, createdAt: new Date().toISOString() })),
    );
  }
}

export function registerDemoUser(user: Omit<DemoUser, "id" | "status">) {
  ensureDemoData();
  const users = readJson<DemoUser[]>(USERS_KEY, []);
  const email = user.email.toLowerCase();

  if (users.some((stored) => stored.email.toLowerCase() === email)) {
    throw new Error("Ja existe uma conta cadastrada com este e-mail.");
  }

  const newUser: DemoUser = {
    ...user,
    id: crypto.randomUUID(),
    status: user.role === "speaker" ? "pending" : "active",
  };

  writeJson(USERS_KEY, [...users, newUser]);

  if (user.role === "speaker") {
    const speakers = readJson<StoredSpeaker[]>(SPEAKERS_KEY, demoSpeakers as StoredSpeaker[]);
    writeJson(SPEAKERS_KEY, [
      ...speakers,
      {
        id: newUser.id,
        name: newUser.fullName,
        organization: "Cadastro solicitado",
        expertise: "Aguardando analise",
        status: "pending",
      },
    ]);
    appendAudit("Sistema", "request_speaker_access", "speakers", `${newUser.fullName} solicitou cadastro como palestrante`);
  } else {
    appendAudit("Sistema", "register_participant", "profiles", `${newUser.fullName} criou conta de participante`);
  }

  return newUser;
}

export function loginDemoUser(email: string, password: string) {
  ensureDemoData();
  const users = readJson<DemoUser[]>(USERS_KEY, []);
  const user = users.find(
    (stored) => stored.email.toLowerCase() === email.toLowerCase() && stored.password === password,
  );

  if (!user) {
    throw new Error("E-mail ou senha invalidos.");
  }

  writeJson(SESSION_KEY, { userId: user.id, email: user.email, role: user.role });
  appendAudit(user.fullName, "login", "auth", `${user.fullName} acessou o sistema`);

  return user;
}

export function dashboardPathForDemoUser(user: DemoUser) {
  if (user.role === "admin") return "/dashboard/admin";
  if (user.role === "lecture_manager") return "/dashboard/manager";
  if (user.role === "speaker") return user.status === "pending" ? "/pending-approval" : "/dashboard/speaker";
  return "/dashboard/participant";
}

export function appendAudit(actor: string, action: string, entity: string, detail: string) {
  const logs = readJson<AuditEntry[]>(AUDIT_KEY, []);
  writeJson(AUDIT_KEY, [
    {
      actor,
      action,
      entity,
      detail,
      createdAt: new Date().toISOString(),
    },
    ...logs,
  ]);
}

export function loadAuditLogs() {
  return readJson<AuditEntry[]>(AUDIT_KEY, []);
}

export function loadStoredSpeakers() {
  return readJson<StoredSpeaker[]>(SPEAKERS_KEY, demoSpeakers as StoredSpeaker[]);
}

export function saveStoredSpeakers(speakers: StoredSpeaker[]) {
  writeJson(SPEAKERS_KEY, speakers);
}

export function loadStoredEnrollments() {
  return readJson<typeof demoEnrollments>(ENROLLMENTS_KEY, demoEnrollments);
}

export function saveStoredEnrollments(enrollments: typeof demoEnrollments) {
  writeJson(ENROLLMENTS_KEY, enrollments);
}

export function loadStoredLectures() {
  return readJson<DemoLecture[]>(LECTURES_KEY, demoLectures);
}

export function saveStoredLectures(lectures: DemoLecture[]) {
  writeJson(LECTURES_KEY, lectures);
}

export function subscribeToStoredValue(key: string, callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    if (event instanceof StorageEvent && event.key === key) callback();
    if (event instanceof CustomEvent && event.detail?.key === key) callback();
  };

  window.addEventListener("storage", handler);
  window.addEventListener(STORE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORE_EVENT, handler);
  };
}

export const storageKeys = {
  speakers: SPEAKERS_KEY,
  enrollments: ENROLLMENTS_KEY,
  audit: AUDIT_KEY,
  lectures: LECTURES_KEY,
};

export function isEnrollmentStatus(status: string): status is EnrollmentStatus {
  return ["pending", "confirmed", "waitlisted", "cancelled", "rejected"].includes(status);
}

import {
  Activity,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";

export type Role = "admin" | "lecture_manager" | "speaker" | "participant";
export type EnrollmentStatus =
  | "pending"
  | "confirmed"
  | "waitlisted"
  | "cancelled"
  | "rejected";
export type LectureStatus = "draft" | "published" | "closed" | "cancelled";

export type DemoLecture = {
  id: string;
  title: string;
  theme: string;
  description: string;
  contentSummary: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  room: string;
  location: string;
  capacity: number;
  status: LectureStatus;
  speakers: string[];
  confirmed: number;
  pending: number;
  waitlisted: number;
  rating: number;
};

export type DemoEnrollment = {
  id: string;
  participant: string;
  email: string;
  whatsapp: string;
  state: string;
  lectureId: string;
  status: EnrollmentStatus;
  checkedIn: boolean;
};

export const demoSpeakers = [
  {
    id: "speaker-1",
    name: "Marina Costa",
    organization: "Instituto Ponte",
    expertise: "Inclusao digital",
    status: "approved",
  },
  {
    id: "speaker-2",
    name: "Rafael Lima",
    organization: "RH Solidario",
    expertise: "Empregabilidade",
    status: "approved",
  },
  {
    id: "speaker-3",
    name: "Camila Rocha",
    organization: "Rede Comunidade Viva",
    expertise: "Saude preventiva",
    status: "pending",
  },
];

export const demoLectures: DemoLecture[] = [
  {
    id: "lecture-1",
    title: "Inclusao Digital para Jovens",
    theme: "Tecnologia cidadania",
    description: "Primeiros passos para usar ferramentas digitais com seguranca.",
    contentSummary: "E-mail, documentos online, pesquisa responsavel e servicos publicos digitais.",
    category: "Tecnologia",
    date: "2026-07-12",
    startTime: "09:00",
    endTime: "10:30",
    durationMinutes: 90,
    room: "Sala 1",
    location: "Sede Vida Plena",
    capacity: 40,
    status: "published",
    speakers: ["Marina Costa"],
    confirmed: 31,
    pending: 5,
    waitlisted: 0,
    rating: 4.7,
  },
  {
    id: "lecture-2",
    title: "Como Preparar um Curriculo Profissional",
    theme: "Empregabilidade",
    description: "Oficina pratica para montar curriculos claros e objetivos.",
    contentSummary: "Estrutura, experiencias, palavras-chave e revisao final.",
    category: "Carreira",
    date: "2026-07-12",
    startTime: "10:00",
    endTime: "11:30",
    durationMinutes: 90,
    room: "Sala 2",
    location: "Sede Vida Plena",
    capacity: 35,
    status: "published",
    speakers: ["Rafael Lima"],
    confirmed: 35,
    pending: 7,
    waitlisted: 4,
    rating: 4.5,
  },
  {
    id: "lecture-3",
    title: "Introducao ao Mercado de Trabalho",
    theme: "Primeiro emprego",
    description: "Orientacao para jovens em busca da primeira oportunidade.",
    contentSummary: "Postura, entrevista, direitos basicos e plano de acao.",
    category: "Carreira",
    date: "2026-07-13",
    startTime: "14:00",
    endTime: "15:30",
    durationMinutes: 90,
    room: "Auditorio",
    location: "Centro Comunitario",
    capacity: 80,
    status: "published",
    speakers: ["Rafael Lima", "Marina Costa"],
    confirmed: 52,
    pending: 9,
    waitlisted: 0,
    rating: 4.3,
  },
  {
    id: "lecture-4",
    title: "Saude Preventiva na Comunidade",
    theme: "Bem-estar",
    description: "Cuidados preventivos e acesso a servicos de saude.",
    contentSummary: "Vacinas, acompanhamento, prevencao e rede de apoio local.",
    category: "Saude",
    date: "2026-07-13",
    startTime: "15:00",
    endTime: "16:00",
    durationMinutes: 60,
    room: "Sala 3",
    location: "Centro Comunitario",
    capacity: 45,
    status: "published",
    speakers: ["Camila Rocha"],
    confirmed: 18,
    pending: 11,
    waitlisted: 0,
    rating: 4.8,
  },
  {
    id: "lecture-5",
    title: "Educacao Financeira Basica",
    theme: "Financas pessoais",
    description: "Organizacao financeira para familias e jovens.",
    contentSummary: "Orcamento, reserva, dividas e consumo consciente.",
    category: "Financas",
    date: "2026-07-14",
    startTime: "09:30",
    endTime: "11:00",
    durationMinutes: 90,
    room: "Sala 1",
    location: "Sede Vida Plena",
    capacity: 50,
    status: "published",
    speakers: ["Marina Costa"],
    confirmed: 42,
    pending: 4,
    waitlisted: 1,
    rating: 4.6,
  },
  {
    id: "lecture-6",
    title: "Empreendedorismo Social",
    theme: "Impacto local",
    description: "Como transformar problemas comunitarios em iniciativas sustentaveis.",
    contentSummary: "Modelo de negocio social, parcerias, validacao e indicadores de impacto.",
    category: "Impacto social",
    date: "2026-07-14",
    startTime: "14:00",
    endTime: "16:00",
    durationMinutes: 120,
    room: "Auditorio",
    location: "Sede Vida Plena",
    capacity: 70,
    status: "draft",
    speakers: ["Camila Rocha"],
    confirmed: 0,
    pending: 0,
    waitlisted: 0,
    rating: 0,
  },
];

export const demoEnrollments: DemoEnrollment[] = [
  { id: "enr-1", participant: "Ana Souza", email: "ana.demo@example.com", whatsapp: "5511990000001", state: "SP", lectureId: "lecture-1", status: "confirmed", checkedIn: true },
  { id: "enr-2", participant: "Bruno Alves", email: "bruno.demo@example.com", whatsapp: "5521990000002", state: "RJ", lectureId: "lecture-1", status: "pending", checkedIn: false },
  { id: "enr-3", participant: "Carla Mendes", email: "carla.demo@example.com", whatsapp: "5531990000003", state: "MG", lectureId: "lecture-2", status: "waitlisted", checkedIn: false },
  { id: "enr-4", participant: "Diego Ramos", email: "diego.demo@example.com", whatsapp: "5541990000004", state: "PR", lectureId: "lecture-2", status: "confirmed", checkedIn: true },
  { id: "enr-5", participant: "Elisa Nunes", email: "elisa.demo@example.com", whatsapp: "5585990000005", state: "CE", lectureId: "lecture-3", status: "confirmed", checkedIn: false },
  { id: "enr-6", participant: "Fabio Torres", email: "fabio.demo@example.com", whatsapp: "5591990000006", state: "PA", lectureId: "lecture-3", status: "rejected", checkedIn: false },
  { id: "enr-7", participant: "Gisele Prado", email: "gisele.demo@example.com", whatsapp: "5561990000007", state: "DF", lectureId: "lecture-4", status: "pending", checkedIn: false },
  { id: "enr-8", participant: "Henrique Dias", email: "henrique.demo@example.com", whatsapp: "5548990000008", state: "SC", lectureId: "lecture-5", status: "confirmed", checkedIn: true },
];

export const demoNotifications = [
  {
    id: "not-1",
    channel: "email",
    subject: "Inscricao confirmada - Inclusao Digital para Jovens",
    message: "Ola, Ana. Sua inscricao foi confirmada. A notificacao foi simulada por falta de provedor configurado.",
    status: "simulated",
  },
  {
    id: "not-2",
    channel: "whatsapp",
    subject: "Link WhatsApp gerado",
    message: "https://wa.me/5511990000001?text=Sua%20inscricao%20foi%20confirmada",
    status: "simulated",
  },
  {
    id: "not-3",
    channel: "system",
    subject: "Palestrante aprovado",
    message: "Marina Costa recebeu acesso ao painel de palestrante.",
    status: "sent",
  },
];

export const demoAuditLogs = [
  { actor: "Admin Demo", action: "confirm_enrollment", entity: "enrollments", detail: "Confirmou inscricao de Ana Souza" },
  { actor: "Admin Demo", action: "approve_speaker", entity: "speakers", detail: "Aprovou Marina Costa" },
  { actor: "Gestor Demo", action: "publish_lecture", entity: "lectures", detail: "Publicou Inclusao Digital para Jovens" },
];

export const dashboardMetrics = [
  { label: "Palestras", value: demoLectures.length, icon: CalendarCheck },
  { label: "Participantes", value: 8, icon: Users },
  { label: "Palestrantes", value: demoSpeakers.length, icon: GraduationCap },
  { label: "Pendencias", value: demoEnrollments.filter((e) => e.status === "pending").length, icon: Clock3 },
  { label: "Confirmadas", value: demoEnrollments.filter((e) => e.status === "confirmed").length, icon: CheckCircle2 },
  { label: "Check-ins", value: demoEnrollments.filter((e) => e.checkedIn).length, icon: Activity },
  { label: "Avaliacao media", value: 4.6, icon: Star },
];

export function availableSeats(lecture: DemoLecture) {
  return Math.max(lecture.capacity - lecture.confirmed, 0);
}

export function occupancyPercent(lecture: DemoLecture) {
  return Math.round((lecture.confirmed / lecture.capacity) * 100);
}

export function lectureById(id: string) {
  return demoLectures.find((lecture) => lecture.id === id);
}

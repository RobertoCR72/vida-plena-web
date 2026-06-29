import { demoEnrollments, lectureById } from "./demo-data";

export function buildWhatsAppLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export async function notifyEnrollmentConfirmed(enrollmentId: string) {
  const enrollment = demoEnrollments.find((item) => item.id === enrollmentId) || demoEnrollments[0];
  const lecture = lectureById(enrollment.lectureId);
  if (!lecture) {
    throw new Error("Palestra nao encontrada para a inscricao informada.");
  }

  const emailMessage = [
    `Ola, ${enrollment.participant}.`,
    "",
    `Sua inscricao na palestra ${lecture.title} foi confirmada.`,
    "",
    `Data: ${lecture.date}`,
    `Horario: ${lecture.startTime}`,
    `Local: ${lecture.room} - ${lecture.location}`,
    "",
    "Acesse seu painel da ONG Vida Plena para consultar seu cronograma.",
  ].join("\n");

  const whatsappMessage = `Ola, ${enrollment.participant}. Sua inscricao na palestra ${lecture.title} foi confirmada para ${lecture.date} as ${lecture.startTime}. Acesse seu painel da ONG Vida Plena para consultar seu cronograma.`;

  const providerConfigured = Boolean(
    process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || process.env.MAKE_WEBHOOK_URL,
  );

  return {
    enrollmentId,
    status: providerConfigured ? "pending" : "simulated",
    email: {
      destination: enrollment.email,
      subject: `Inscricao confirmada - ${lecture.title}`,
      message: emailMessage,
    },
    whatsapp: {
      destination: enrollment.whatsapp,
      message: whatsappMessage,
      link: buildWhatsAppLink(enrollment.whatsapp, whatsappMessage),
    },
    providerResponse: providerConfigured
      ? { mode: "provider_configured", sent: false }
      : { mode: "simulated", reason: "Nenhum provedor externo configurado." },
  };
}

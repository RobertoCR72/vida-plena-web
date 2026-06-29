import { NextResponse } from "next/server";
import { toCsv } from "@/lib/csv";
import { demoEnrollments, lectureById } from "@/lib/demo-data";

export async function GET() {
  const csv = toCsv(
    demoEnrollments.map((enrollment) => ({
      participante: enrollment.participant,
      email: enrollment.email,
      whatsapp: enrollment.whatsapp,
      estado: enrollment.state,
      palestra: lectureById(enrollment.lectureId)?.title,
      status: enrollment.status,
      check_in: enrollment.checkedIn ? "sim" : "nao",
    })),
  );

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="vida-plena-inscricoes.csv"',
    },
  });
}

import { NextResponse } from "next/server";
import { notifyEnrollmentConfirmed } from "@/lib/notifications";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const enrollmentId = typeof body.enrollmentId === "string" ? body.enrollmentId : "enr-1";
  const result = await notifyEnrollmentConfirmed(enrollmentId);

  return NextResponse.json({
    ok: true,
    notification: result,
  });
}

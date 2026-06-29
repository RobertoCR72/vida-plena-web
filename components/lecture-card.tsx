import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { availableSeats, occupancyPercent, type DemoLecture } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

export function LectureCard({ lecture, actionHref }: { lecture: DemoLecture; actionHref?: string }) {
  const occupancy = occupancyPercent(lecture);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">{lecture.theme}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">{lecture.title}</h3>
        </div>
        <StatusBadge status={lecture.status} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{lecture.description}</p>
      <div className="mt-4 grid gap-2 text-sm text-slate-700">
        <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-700" />{formatDate(lecture.date)} das {lecture.startTime} as {lecture.endTime}</span>
        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-700" />{lecture.room}, {lecture.location}</span>
        <span className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-700" />{availableSeats(lecture)} vagas disponiveis de {lecture.capacity}</span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Ocupacao</span>
          <span>{occupancy}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(occupancy, 100)}%` }} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{lecture.category}</p>
        <Link className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800" href={actionHref || "/login"}>
          Solicitar inscricao
        </Link>
      </div>
    </article>
  );
}

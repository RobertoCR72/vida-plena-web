import { AlertTriangle } from "lucide-react";
import type { DemoLecture } from "@/lib/demo-data";
import { findConflicts, groupLecturesByDate } from "@/lib/schedule";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

export function ScheduleTimeline({ lectures }: { lectures: DemoLecture[] }) {
  const groups = groupLecturesByDate(lectures);

  return (
    <div className="grid gap-5">
      {Object.entries(groups).map(([date, items]) => (
        <section key={date} className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-950">{formatDate(date)}</h2>
          <div className="mt-4 grid gap-3">
            {items.map((lecture) => {
              const conflicts = findConflicts(lecture, lectures);
              return (
                <div key={lecture.id} className="rounded-md border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-950">{lecture.startTime} - {lecture.endTime}</p>
                      <p className="text-sm text-slate-600">{lecture.title} em {lecture.room}</p>
                    </div>
                    <StatusBadge status={lecture.status} />
                  </div>
                  {conflicts.length > 0 && (
                    <p className="mt-3 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      <AlertTriangle className="h-4 w-4" />
                      Conflito com {conflicts.map((item) => item.title).join(", ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

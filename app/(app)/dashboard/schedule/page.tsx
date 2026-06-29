import { ScheduleTimeline } from "@/components/schedule-timeline";
import { demoLectures } from "@/lib/demo-data";

export default function SchedulePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Cronograma pessoal</h1>
      <p className="mt-2 text-slate-600">Mostra palestras por dia, horario, sala, conflitos e palestras paralelas.</p>
      <div className="mt-6">
        <ScheduleTimeline lectures={demoLectures.filter((lecture) => lecture.status === "published").slice(0, 5)} />
      </div>
    </div>
  );
}

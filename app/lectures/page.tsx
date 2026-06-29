import { LectureCard } from "@/components/lecture-card";
import { demoLectures } from "@/lib/demo-data";

export default function LecturesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-950">Palestras publicas</h1>
      <p className="mt-2 text-slate-600">Filtre por data, tema, categoria, horario ou sala durante a demonstracao.</p>
      <div className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-5">
        {["Tema", "Data", "Categoria", "Horario", "Sala"].map((label) => (
          <input key={label} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder={label} />
        ))}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {demoLectures.filter((lecture) => lecture.status === "published").map((lecture) => (
          <LectureCard key={lecture.id} lecture={lecture} actionHref="/dashboard/participant" />
        ))}
      </div>
    </main>
  );
}

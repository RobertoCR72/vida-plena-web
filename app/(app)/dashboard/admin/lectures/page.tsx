'use client'

import { useMemo, useState, useEffect } from 'react'
import { CalendarDays, Edit3, Save, Trash2 } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { ClientOnly } from '@/components/client-only'
import { demoSpeakers, type DemoLecture, type LectureStatus } from '@/lib/demo-data'
import {
  appendAudit,
  createStoredLecture,
  updateStoredLecture,
  deleteStoredLecture,
} from '@/lib/adapters/supabase-adapter'
import { useSupabaseLectures } from '@/lib/use-supabase-store'
import { formatDate } from '@/lib/utils'

// Helper para detectar IDs de demo
function isDemoId(id: string): boolean {
  return /^(demo-|enrollment-|enr-|speaker-|lecture-)/.test(id)
}

type LectureFormState = {
  title: string
  theme: string
  description: string
  contentSummary: string
  category: string
  date: string
  startTime: string
  endTime: string
  durationMinutes: string
  room: string
  location: string
  capacity: string
  status: LectureStatus
  speaker: string
}

const emptyForm: LectureFormState = {
  title: '',
  theme: '',
  description: '',
  contentSummary: '',
  category: '',
  date: '2026-07-15',
  startTime: '09:00',
  endTime: '10:00',
  durationMinutes: '60',
  room: '',
  location: 'Sede Vida Plena',
  capacity: '30',
  status: 'draft',
  speaker: demoSpeakers[0]?.name || '',
}

function formFromLecture(lecture: DemoLecture): LectureFormState {
  return {
    title: lecture.title,
    theme: lecture.theme,
    description: lecture.description,
    contentSummary: lecture.contentSummary,
    category: lecture.category,
    date: lecture.date,
    startTime: lecture.startTime,
    endTime: lecture.endTime,
    durationMinutes: String(lecture.durationMinutes),
    room: lecture.room,
    location: lecture.location,
    capacity: String(lecture.capacity),
    status: lecture.status,
    speaker: lecture.speakers[0] || demoSpeakers[0]?.name || '',
  }
}

function lectureFromForm(form: LectureFormState, existing?: DemoLecture): DemoLecture {
  return {
    id: existing?.id || crypto.randomUUID(),
    title: form.title.trim(),
    theme: form.theme.trim(),
    description: form.description.trim(),
    contentSummary: form.contentSummary.trim(),
    category: form.category.trim(),
    date: form.date,
    startTime: form.startTime,
    endTime: form.endTime,
    durationMinutes: Number(form.durationMinutes) || 60,
    room: form.room.trim(),
    location: form.location.trim(),
    capacity: Number(form.capacity) || 1,
    status: form.status,
    speakers: [form.speaker].filter(Boolean),
    confirmed: existing?.confirmed || 0,
    pending: existing?.pending || 0,
    waitlisted: existing?.waitlisted || 0,
    rating: existing?.rating || 0,
  }
}

export default function AdminLecturesPage() {
  const { lectures: initialLectures, refetch } = useSupabaseLectures(2000) // Auto-refresh a cada 2s
  const [lectures, setLectures] = useState<DemoLecture[]>(initialLectures)
  const [form, setForm] = useState<LectureFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Sincronizar dados do hook com estado local
  useEffect(() => {
    setLectures(initialLectures)
  }, [initialLectures])

  const editingLecture = useMemo(
    () => lectures.find((lecture) => lecture.id === editingId),
    [editingId, lectures],
  )

  const updateForm = (field: keyof LectureFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const saveLecture = async () => {
    if (!form.title.trim() || !form.theme.trim()) {
      setMessage('Informe pelo menos titulo e tema antes de salvar.')
      return
    }

    try {
      setIsSaving(true)
      const saved = lectureFromForm(form, editingLecture)

      if (editingLecture) {
        // Atualizar palestra existente
        await updateStoredLecture(editingLecture.id, saved)

        // Se for ID de demo, atualizar estado local imediatamente
        if (isDemoId(editingLecture.id)) {
          setLectures((current) =>
            current.map((item) =>
              item.id === editingLecture.id ? saved : item,
            ),
          )
        }

        await appendAudit(
          'Admin Demo',
          'update_lecture',
          'lectures',
          `${saved.title} atualizada`,
        )
        setMessage(`Palestra "${saved.title}" atualizada com sucesso!`)
      } else {
        // Criar nova palestra
        const created = await createStoredLecture(saved)
        if (created) {
          setEditingId(created.id)

          // Se for ID de demo, adicionar ao estado local
          if (isDemoId(created.id)) {
            setLectures((current) => [...current, created])
          }

          await appendAudit(
            'Admin Demo',
            'create_lecture',
            'lectures',
            `${saved.title} criada com status ${saved.status}`,
          )
          setMessage(`Palestra "${saved.title}" criada com sucesso!`)
        }
      }

      // Recarregar lista do Supabase (se não for demo)
      if (!editingLecture || !isDemoId(editingLecture.id)) {
        await refetch()
      }
      resetForm()
    } catch (error) {
      setMessage(`Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const editLecture = (lecture: DemoLecture) => {
    setEditingId(lecture.id)
    setForm(formFromLecture(lecture))
    setMessage(`Editando "${lecture.title}".`)
  }

  const updateLectureStatus = async (lecture: DemoLecture, status: LectureStatus) => {
    try {
      await updateStoredLecture(lecture.id, { ...lecture, status })

      // Se for ID de demo, atualizar estado local imediatamente
      if (isDemoId(lecture.id)) {
        setLectures((current) =>
          current.map((item) =>
            item.id === lecture.id ? { ...item, status } : item,
          ),
        )
      }

      await appendAudit('Admin Demo', 'update_lecture_status', 'lectures', `${lecture.title} alterada para ${status}`)
      setMessage(`Status de "${lecture.title}" atualizado para ${status}.`)

      // Recarregar dados do Supabase (se não for demo)
      if (!isDemoId(lecture.id)) {
        await refetch()
      }
    } catch (error) {
      setMessage(`Erro ao atualizar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  const deleteLecture = async (lecture: DemoLecture) => {
    if (!window.confirm(`Tem certeza que deseja deletar "${lecture.title}"?`)) return

    try {
      await deleteStoredLecture(lecture.id)

      // Se for ID de demo, remover do estado local imediatamente
      if (isDemoId(lecture.id)) {
        setLectures((current) =>
          current.filter((item) => item.id !== lecture.id),
        )
      }

      await appendAudit('Admin Demo', 'delete_lecture', 'lectures', `${lecture.title} removida`)
      if (editingId === lecture.id) resetForm()
      setMessage(`Palestra "${lecture.title}" removida.`)

      // Recarregar dados do Supabase (se não for demo)
      if (!isDemoId(lecture.id)) {
        await refetch()
      }
    } catch (error) {
      setMessage(`Erro ao deletar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Palestras</h1>
      <p className="mt-2 text-slate-600">Crie, edite, publique, cancele e remova palestras. Tudo fica salvo no navegador e registrado nos logs.</p>
      {message && <div className="mt-4 rounded-md bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">{message}</div>}

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{editingId ? 'Editar palestra' : 'Nova palestra'}</h2>
          <button type="button" onClick={resetForm} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100">
            Limpar formulario
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input value={form.title} onChange={(event) => updateForm('title', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Titulo" />
          <input value={form.theme} onChange={(event) => updateForm('theme', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Tema" />
          <input value={form.category} onChange={(event) => updateForm('category', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Categoria" />
          <input value={form.date} onChange={(event) => updateForm('date', event.target.value)} type="date" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={form.startTime} onChange={(event) => updateForm('startTime', event.target.value)} type="time" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={form.endTime} onChange={(event) => updateForm('endTime', event.target.value)} type="time" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={form.durationMinutes} onChange={(event) => updateForm('durationMinutes', event.target.value)} type="number" min="1" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Duracao" />
          <input value={form.capacity} onChange={(event) => updateForm('capacity', event.target.value)} type="number" min="1" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Capacidade" />
          <input value={form.room} onChange={(event) => updateForm('room', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Sala" />
          <input value={form.location} onChange={(event) => updateForm('location', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Local" />
          <select value={form.status} onChange={(event) => updateForm('status', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="draft">Rascunho</option>
            <option value="published">Publicada</option>
            <option value="closed">Encerrada</option>
            <option value="cancelled">Cancelada</option>
          </select>
          <select value={form.speaker} onChange={(event) => updateForm('speaker', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            {demoSpeakers.map((speaker) => <option key={speaker.id}>{speaker.name}</option>)}
          </select>
          <textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Descricao" />
          <textarea value={form.contentSummary} onChange={(event) => updateForm('contentSummary', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Resumo do conteudo" />
          <button
            type="button"
            onClick={saveLecture}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Salvando...' : editingId ? 'Salvar edicao' : 'Criar palestra'}
          </button>
        </div>
      </section>

      <ClientOnly>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {lectures.map((lecture) => (
          <article key={lecture.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-blue-700">{lecture.theme}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">{lecture.title}</h3>
              </div>
              <StatusBadge status={lecture.status} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{lecture.description}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-700">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-700" />{formatDate(lecture.date)} das {lecture.startTime} as {lecture.endTime}</span>
              <span>{lecture.room}, {lecture.location} - capacidade {lecture.capacity}</span>
              <span>Palestrante: {lecture.speakers.join(', ') || 'Nao vinculado'}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => editLecture(lecture)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100">
                <Edit3 className="h-4 w-4" />
                Editar
              </button>
              <button type="button" onClick={() => updateLectureStatus(lecture, 'published')} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Publicar</button>
              <button type="button" onClick={() => updateLectureStatus(lecture, 'closed')} className="rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">Encerrar</button>
              <button type="button" onClick={() => updateLectureStatus(lecture, 'cancelled')} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Cancelar</button>
              <button type="button" onClick={() => deleteLecture(lecture)} className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>
          </article>
        ))}
        </div>
      </ClientOnly>
    </div>
  )
}

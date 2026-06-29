import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const signupSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  phone_whatsapp: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  role: z.enum(['participant', 'speaker']),
  terms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de uso',
  }),
})

export const profileSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone_whatsapp: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
})

export const speakerProfileSchema = z.object({
  professional_title: z.string().optional(),
  bio: z.string().optional(),
  organization: z.string().optional(),
  linkedin_url: z.string().url('URL do LinkedIn inválida').optional().or(z.literal('')),
  expertise_area: z.string().optional(),
})

export const createTalkSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  description: z.string().optional(),
  content_summary: z.string().optional(),
  category: z.string().optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Data inválida'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  duration_minutes: z.number().min(15, 'Duração mínima 15 minutos'),
  room: z.string().optional(),
  capacity: z.number().min(1, 'Capacidade mínima 1'),
})

export const enrollmentSchema = z.object({
  talk_id: z.string().uuid('ID da palestra inválido'),
})

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5, 'Classificação de 1 a 5'),
  comment: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type SpeakerProfileInput = z.infer<typeof speakerProfileSchema>
export type CreateTalkInput = z.infer<typeof createTalkSchema>
export type EnrollmentInput = z.infer<typeof enrollmentSchema>
export type FeedbackInput = z.infer<typeof feedbackSchema>

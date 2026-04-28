import type { User } from '@/entities/auth';
import type { Psychologist } from '@/entities/psychologist/types';

export interface Appointment {
  id: string;
  patient: User;
  psychologist: Psychologist;
  application_id: string | null;
  type: AppointmentType;
  reason: string | null;
  status: AppointmentStatus;
  scheduled_time: string;
  remind_time: string | null;
  last_change_time: string;
  venue: string;
  comment: string | null;
  cancel_reason: string | null;
  conclusion: string | null;
}

export type AppointmentStatus = 'awaiting' | 'cancelled' | 'done';
export type AppointmentType = 'Offline' | 'Online';

export interface AppointmentCreateRequest {
  application_id: string | null;
  patient_id: string;
  psychologist_id: string;
  type: AppointmentType;
  scheduled_time: string;
  reason: string | null;
  remind_time: string | null;
  venue: string | null;
  comment: string | null;
}

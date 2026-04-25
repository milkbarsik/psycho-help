export interface Appointment {
  id: string;
  patient_id: string;
  patient_first_name: string;
  patient_last_name: string;
  psychologist_id: string;
  type: AppointmentType;
  reason: string | null;
  status: AppointmentStatus;
  scheduled_time: string;
  remind_time: string | null;
  last_change_time: string;
  venue: string;
  comment: string | null;
}

export type AppointmentStatus = 'awaiting' | 'cancelled' | 'done';
export type AppointmentType = 'Offline' | 'Online';

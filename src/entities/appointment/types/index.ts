import { EAppointmentStatus, EAppointmentType } from '@/entities/appointment/enums';

export type Appointment = {
  id?: string;
  patient_id?: string;
  therapist_id?: string;
  type?: EAppointmentType;
  reason?: string;
  status?: EAppointmentStatus;
  remind_time: string;
  last_change_time?: string;
  venue?: string;
  date?: string;
  time?: string;
};

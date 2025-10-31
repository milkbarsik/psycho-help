import { combineDateAndTime } from '@/shared/lib/dateFunctions';
import type { Appointment } from '@/entities/appointment/types';

export default class AppointmentDto {
  patient_id: string;
  therapist_id: string;
  type: string;
  reason: string;
  venue: string;
  remind_time: string;

  constructor(appointment: Appointment, userId: string | undefined) {
    this.patient_id = userId ? userId : '';
    this.therapist_id = appointment.therapist_id ?? '';
    this.type = appointment.type ?? '';
    this.reason = appointment.reason ?? '';
    this.venue = appointment.venue ?? '';
    this.remind_time = combineDateAndTime(appointment?.date ?? '', appointment?.time ?? '');
  }
}

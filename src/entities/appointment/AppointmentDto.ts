import type { Appointment } from '@/entities/appointment/types';

export default class AppointmentDto {
  patient_id: string;
  psychologist_id: string;
  type: string;
  reason: string;
  venue: string;

  constructor(appointment: Appointment, userId: string | undefined) {
    this.patient_id = userId ? userId : '';
    this.psychologist_id = appointment.psychologist_id ?? '';
    this.type = appointment.type ?? '';
    this.reason = appointment.reason ?? '';
    this.venue = appointment.venue ?? '';
  }
}

// Зачем это вообще нужно? Нигде не используется, да и можно напрямую использовать тип Appointment...

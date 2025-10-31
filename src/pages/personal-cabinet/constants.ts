import type { Appointment } from '@/entities/appointment/types';
import { EAppointmentStatus, EAppointmentType } from '@/entities/appointment/enums';

export const appointmentsConsts: Appointment[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    patient_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    therapist_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    type: EAppointmentType.OFFLINE,
    reason: 'String',
    status: EAppointmentStatus.ACCEPTED,
    remind_time: '2025-05-09T07:59:17.799Z',
    last_change_time: '2025-04-29T07:59:17.800Z',
    venue: 'место проведения',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    patient_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    therapist_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    type: EAppointmentType.OFFLINE,
    reason: 'String',
    status: EAppointmentStatus.APPROVED,
    remind_time: '2025-05-05T07:59:17.799Z',
    last_change_time: '2025-05-01T07:59:17.800Z',
    venue: 'место проведения',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
    patient_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    therapist_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    type: EAppointmentType.ONLINE,
    reason: 'string',
    status: EAppointmentStatus.APPROVED,
    remind_time: '2025-04-30T07:59:17.799Z',
    last_change_time: '2025-04-30T07:59:17.800Z',
    venue: 'место проведения',
  },
];

import type { ApplicationStatus } from '@/entities/application/types';
import type { AppointmentStatus } from '@/entities/appointment/types';

export const APPOINTMENT_STATUS_TAG: Record<
  AppointmentStatus,
  { text: string; className: string }
> = {
  Approved: { text: 'Ожидается (не должно показываться)', className: 'styles.tagRed' },
  Accepted: { text: 'Ожидается', className: 'styles.tagGreen' },
  Done: { text: 'Завершено', className: 'styles.tagGray' },
  Cancelled: { text: 'Отменено', className: 'styles.tagRed' },
};

export const APPLICATION_STATUS_TAG: Record<
  ApplicationStatus,
  { text: string; className: string }
> = {
  new: { text: 'Новая', className: 'styles.tagBlue' },
  in_progress: { text: 'В работе', className: 'styles.tagOrange' },
  awaiting_user_confirmation: { text: 'Ожидает подтверждения', className: 'styles.tagGreen' },
  completed: { text: 'Завершено', className: 'styles.tagGray' },
  rejected: { text: 'Отменено', className: 'styles.tagRed' },
  cancelled: { text: 'Отменено', className: 'styles.tagRed' },
  expired: { text: 'Отменено', className: 'styles.tagRed' },
};

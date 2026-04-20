import type { ApplicationStatus } from '@/entities/application/types';
import type { AppointmentStatus } from '@/entities/appointment/types';

export const APPOINTMENT_STATUS_TAG: Record<
  AppointmentStatus,
  { text: string; className: string }
> = {
  awaiting: { text: 'Ожидается', className: 'tagAwaiting' },
  done: { text: 'Завершено', className: 'tagDone' },
  cancelled: { text: 'Отменено', className: 'tagCancelled' },
};

export const APPLICATION_STATUS_TAG: Record<
  ApplicationStatus,
  { text: string; className: string }
> = {
  new: { text: 'Новая', className: 'tagNew' },
  in_progress: { text: 'В работе', className: 'tagInProgress' },
  awaiting_user_confirmation: {
    text: 'Ожидает подтверждения',
    className: 'tagAwaitingUserConfirmation',
  },
  completed: { text: 'Завершено', className: 'tagCompleted' },
  rejected: { text: 'Отменено', className: 'tagCancelled' },
  cancelled: { text: 'Отменено', className: 'tagCancelled' },
  expired: { text: 'Отменено', className: 'tagCancelled' },
};

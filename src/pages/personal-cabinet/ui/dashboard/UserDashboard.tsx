import { useMemo, useState, useCallback } from 'react';
import type { FC } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { message, Modal, Input } from 'antd';
import { therapistQueries } from '@/entities/therapist/api';
import {
  appointmentQueries,
  appointmentQueryKey,
  createAppointment,
  cancelAppointment,
} from '@/entities/appointment/api';
import {
  applicationQueries,
  applicationQueryKey,
  confirmApplication,
  cancelApplication,
} from '@/entities/application/api';
import type { Appointment } from '@/entities/appointment/types';
import type { Therapist } from '@/entities/therapist/types';
import type { Application } from '@/entities/application/types';
import GreetingCard from '@/features/personal-cabinet/ui/greeting-card/GreetingCard';
import AppointmentCard from '@/features/personal-cabinet/ui/appointment-card/AppointmentCard';
import PageLoader from '@/shared/ui/PageLoader';
import { useAuth } from '@/features/auth/api/useAuth';
import styles from './Dashboard.module.scss';

interface UserDashboardProps {
  userName: string;
  onBookClick: () => void;
}

const MEETING_TYPE_LABELS: Record<string, string> = {
  online: 'Онлайн',
  offline: 'Очно',
};

const UserDashboard: FC<UserDashboardProps> = ({ userName, onBookClick }) => {
  const queryClient = useQueryClient();
  const user = useAuth((s) => s.user);

  const [commentModalId, setCommentModalId] = useState<string | null>(null);

  // Стейт для модального окна отмены
  const [cancelModal, setCancelModal] = useState<{
    visible: boolean;
    type: 'appointment' | 'application';
    id: string;
  }>({ visible: false, type: 'appointment', id: '' });
  const [cancelReason, setCancelReason] = useState('');

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery(therapistQueries.list());
  const { data: serverAppointments, isLoading: isLoadingAppointments } = useQuery(
    appointmentQueries.list(),
  );
  const { data: applications, isLoading: isLoadingApplications } = useQuery(
    applicationQueries.list(),
  );

  const getTherapistName = useCallback(
    (therapistId?: string) => {
      if (!therapistId) return 'Специалист не назначен';
      if (!doctors) return 'Загрузка данных...';
      const doctor = doctors.find((d: Therapist) => d.id === therapistId);
      if (!doctor) return 'Неизвестный специалист';
      return `${doctor.last_name} ${doctor.first_name} ${doctor.middle_name || ''}`.trim();
    },
    [doctors],
  );

  // Ближайшие и прошедшие записи
  const { upcoming, past } = useMemo(() => {
    const now = dayjs();
    const upc: Appointment[] = [];
    const pst: Appointment[] = [];

    (serverAppointments || []).forEach((item) => {
      const appointmentDate = dayjs(item.scheduled_time);
      if (appointmentDate.isValid()) {
        if (appointmentDate.isAfter(now) && item.status !== 'Cancelled') {
          upc.push(item);
        } else {
          pst.push(item);
        }
      }
    });

    upc.sort((a, b) => dayjs(a.scheduled_time).diff(dayjs(b.scheduled_time)));
    pst.sort((a, b) => dayjs(b.scheduled_time).diff(dayjs(a.scheduled_time)));

    return { upcoming: upc, past: pst };
  }, [serverAppointments]);

  // Заявки: Требующие подтверждения и В обработке
  const { awaitingConfirmation, inProcessing } = useMemo(() => {
    const awaiting: Application[] = [];
    const processing: Application[] = [];

    (applications || []).forEach((app) => {
      if (app.status === 'awaiting_user_confirmation') {
        awaiting.push(app);
      } else if (app.status === 'new' || app.status === 'in_progress') {
        processing.push(app);
      }
    });

    return { awaitingConfirmation: awaiting, inProcessing: processing };
  }, [applications]);

  // --- Мутации ---

  // Подтверждение заявки
  const confirmMutation = useMutation({
    mutationFn: async (app: Application) => {
      const apptType = app.meeting_type === 'online' ? 'Online' : 'Offline';
      const scheduledTime = app.scheduled_at || new Date().toISOString();

      const createdAppointment = await createAppointment({
        application_id: app.id,
        patient_id: user!.id,
        psychologist_id: app.psychologist_id!,
        type: apptType,
        scheduled_time: scheduledTime,
        reason: app.problem_description,
        venue: app.location_address || app.preferred_campus || undefined,
      });

      return confirmApplication(app.id, createdAppointment.id);
    },
    onSuccess: () => {
      message.success('Заявка успешно подтверждена');
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] });
      queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.list] });
    },
    onError: () => {
      message.error('Не удалось подтвердить заявку');
    },
  });

  const handleConfirm = (app: Application) => {
    Modal.confirm({
      title: 'Подтверждение записи',
      content: 'Вы уверены, что хотите подтвердить предложенное время и дату?',
      okText: 'Подтвердить',
      cancelText: 'Назад',
      onOk: () => confirmMutation.mutate(app),
    });
  };

  // Отмена записи или заявки
  const cancelMutation = useMutation({
    mutationFn: async ({
      id,
      type,
      reason,
    }: {
      id: string;
      type: 'appointment' | 'application';
      reason: string;
    }) => {
      if (type === 'application') {
        return cancelApplication(id, { cancel_reason: reason, cancel_initiator: 'user' });
      } else {
        return cancelAppointment(id, reason);
      }
    },
    onSuccess: () => {
      message.success('Успешно отменено');
      setCancelModal({ visible: false, type: 'appointment', id: '' });
      setCancelReason('');
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] });
      queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.list] });
    },
    onError: () => {
      message.error('Ошибка при отмене');
    },
  });

  const handleCancelSubmit = () => {
    if (!cancelReason.trim()) {
      message.error('Пожалуйста, укажите причину отмены');
      return;
    }
    cancelMutation.mutate({
      id: cancelModal.id,
      type: cancelModal.type,
      reason: cancelReason.trim(),
    });
  };

  const isLoading = isLoadingDoctors || isLoadingAppointments || isLoadingApplications;

  if (isLoading) {
    return (
      <div className={styles.pageLoaderWrapper}>
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <GreetingCard userName={userName} onBookClick={onBookClick} />

      {/* --- ВАШИ ЗАПИСИ (Показывается всегда, есть заглушка) --- */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Ваши записи</h3>
        <div className={styles.cardsGrid}>
          {upcoming.length > 0 ? (
            upcoming.map((app) => (
              <AppointmentCard
                key={app.id}
                date={dayjs(app.scheduled_time).format('D MMMM, HH:mm')}
                doctorName={getTherapistName(app.psychologist_id)}
                address={app.venue || (app.type === 'Online' ? 'Онлайн сессия' : 'Офлайн')}
                type="upcoming"
                status={app.status}
                onCancel={() => setCancelModal({ visible: true, type: 'appointment', id: app.id })}
              />
            ))
          ) : (
            <p className={styles.emptyText}>У вас пока что нет активных записей</p>
          )}
        </div>
      </section>

      {/* --- В ОБРАБОТКЕ (Скрывается, если пусто) --- */}
      {inProcessing.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>В обработке у специалиста</h3>
          <div className={styles.cardsGrid}>
            {inProcessing.map((app) => {
              const meetingTypeStr = app.meeting_type
                ? MEETING_TYPE_LABELS[app.meeting_type] || app.meeting_type
                : 'Тип встречи не указан';
              const locationStr =
                app.meeting_type === 'offline'
                  ? app.location_address || app.preferred_campus || 'Адрес уточняется'
                  : app.meeting_url || 'Ссылка будет отправлена позже';
              const scheduledStr = app.scheduled_at
                ? dayjs(app.scheduled_at).format('D MMMM, HH:mm')
                : 'Время подбирается специалистом';

              return (
                <AppointmentCard
                  key={app.id}
                  date={scheduledStr}
                  doctorName={getTherapistName(app.psychologist_id || undefined)}
                  address={`${meetingTypeStr} — ${locationStr}`}
                  type="upcoming"
                  status={app.status}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* --- ТРЕБУЮТ ПОДТВЕРЖДЕНИЯ (Скрывается, если пусто) --- */}
      {awaitingConfirmation.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Требуют подтверждения</h3>
          <div className={styles.cardsGrid}>
            {awaitingConfirmation.map((app) => {
              const meetingTypeStr = app.meeting_type
                ? MEETING_TYPE_LABELS[app.meeting_type] || app.meeting_type
                : 'Не указан';
              const locationStr =
                app.meeting_type === 'offline'
                  ? app.location_address || app.preferred_campus || 'Адрес не указан'
                  : app.meeting_url || 'Ссылка будет отправлена';
              const scheduledStr = app.scheduled_at
                ? dayjs(app.scheduled_at).format('D MMMM, HH:mm')
                : 'Время не назначено';

              return (
                <AppointmentCard
                  key={app.id}
                  date={scheduledStr}
                  doctorName={getTherapistName(app.psychologist_id || undefined)}
                  address={`${meetingTypeStr} — ${locationStr}`}
                  type="confirmation"
                  status={app.status}
                  onConfirm={() => handleConfirm(app)}
                  onCancel={() =>
                    setCancelModal({ visible: true, type: 'application', id: app.id })
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      {/* --- ПОСЛЕДНИЕ СЕССИИ (Скрывается, если пусто) --- */}
      {past.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Последние сессии</h3>
          <div className={styles.cardsGrid}>
            {past.map((app, index) => {
              let mockRating: 'good' | 'bad' | null = null;
              if (index % 3 === 1) mockRating = 'good';
              if (index % 3 === 2) mockRating = 'bad';

              return (
                <AppointmentCard
                  key={app.id}
                  date={dayjs(app.scheduled_time).format('D MMMM, HH:mm')}
                  doctorName={getTherapistName(app.psychologist_id)}
                  address={app.venue || (app.type === 'Online' ? 'Онлайн сессия' : 'Офлайн')}
                  type="past"
                  rating={mockRating}
                  status={app.status}
                  onComment={() => setCommentModalId(app.id)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* --- МОДАЛЬНОЕ ОКНО КОММЕНТАРИЯ (Заглушка) --- */}
      <Modal
        title="Комментарий психолога"
        open={!!commentModalId}
        onCancel={() => setCommentModalId(null)}
        footer={null}
      >
        <p>
          {commentModalId
            ? 'Комментарий к сессии будет доступен после обновления системы.'
            : 'Комментарий отсутствует.'}
        </p>
      </Modal>

      {/* --- МОДАЛЬНОЕ ОКНО ОТМЕНЫ ЗАПИСИ --- */}
      <Modal
        title="Отмена"
        open={cancelModal.visible}
        onCancel={() => {
          setCancelModal({ visible: false, type: 'appointment', id: '' });
          setCancelReason('');
        }}
        onOk={handleCancelSubmit}
        confirmLoading={cancelMutation.isPending}
        okText="Подтвердить отмену"
        cancelText="Назад"
        okButtonProps={{ danger: true }}
      >
        <p style={{ marginBottom: 12 }}>Пожалуйста, укажите причину отмены:</p>
        <Input.TextArea
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Например: Изменились планы, заболел(а)"
        />
      </Modal>
    </>
  );
};

export default UserDashboard;

import { useMemo, useState, useCallback } from 'react';
import type { FC } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { message, Modal } from 'antd';
import { therapistQueries } from '@/entities/therapist/api';
import { appointmentQueries, appointmentQueryKey, createAppointment } from '@/entities/appointment/api';
import { applicationQueries, applicationQueryKey, confirmApplication } from '@/entities/application/api';
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
  const [commentModalId, setCommentModalId] = useState<string | null>(null);

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

  // Разделение записей на ближайшие и прошедшие
  const { upcoming, past } = useMemo(() => {
    const now = dayjs();
    const upc: Appointment[] = [];
    const pst: Appointment[] = [];

    (serverAppointments || []).forEach((item) => {
      const appointmentDate = dayjs(item.scheduled_time);
      if (appointmentDate.isValid()) {
        if (appointmentDate.isAfter(now)) {
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

  const user = useAuth((s) => s.user);

  // Заявки, требующие подтверждения пользователя
  const awaitingConfirmation = useMemo(
    () =>
      (applications || []).filter((app) => app.status === 'awaiting_user_confirmation'),
    [applications],
  );

  // Мутация подтверждения: сначала создаём appointment, затем подтверждаем заявку
  const confirmMutation = useMutation({
    mutationFn: async (app: Application) => {
      // Определяем тип встречи
      const apptType: 'Offline' | 'Online' = app.meeting_type === 'online' ? 'Online' : 'Offline';
      const scheduledTime = app.scheduled_at || new Date().toISOString();

      // 1. Создаём appointment
      const createdAppointment = await createAppointment({
        application_id: app.id,
        patient_id: user!.id,
        psychologist_id: app.psychologist_id!,
        type: apptType,
        scheduled_time: scheduledTime,
        reason: app.problem_description,
        venue: app.location_address || app.preferred_campus || undefined,
      });

      // 2. Подтверждаем заявку с appointment_id
      return confirmApplication(app.id, createdAppointment.id);
    },
    onSuccess: () => {
      message.success('Заявка подтверждена');
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] });
      queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.list] });
    },
    onError: () => {
      message.error('Не удалось подтвердить заявку');
    },
  });

  const handleConfirm = (app: Application) => {
    Modal.confirm({
      title: 'Подтверждение заявки',
      content: 'Вы уверены, что хотите подтвердить эту заявку?',
      okText: 'Подтвердить',
      cancelText: 'Отмена',
      onOk: () => confirmMutation.mutate(app),
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

      {/* Ближайшие записи */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Ближайшие записи</h3>
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
              />
            ))
          ) : (
            <p className={styles.emptyText}>Вы ещё не записаны на сессию</p>
          )}
        </div>
      </section>

      {/* Последние сессии */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Последние сессии</h3>
        <div className={styles.cardsGrid}>
          {past.length > 0 ? (
            past.map((app, index) => {
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
                  onComment={() => setCommentModalId(app.id)}
                />
              );
            })
          ) : (
            <p className={styles.emptyText}>Вы ещё не были на сессии у психолога</p>
          )}
        </div>
      </section>

      {/* Требуют подтверждения */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Требуют подтверждения</h3>
        <div className={styles.cardsGrid}>
          {awaitingConfirmation.length > 0 ? (
            awaitingConfirmation.map((app) => {
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
                />
              );
            })
          ) : (
            <p className={styles.emptyText}>Нет заявок, требующих подтверждения</p>
          )}
        </div>
      </section>

      {/* Модалка комментария (заглушка) */}
      <Modal
        title="Комментарий психолога"
        open={!!commentModalId}
        onCancel={() => setCommentModalId(null)}
        footer={null}
      >
        <p>
          {commentModalId
            ? 'Комментарий к сессии будет доступен после обновления системы комментариев.'
            : 'Комментарий отсутствует.'}
        </p>
      </Modal>
    </>
  );
};

export default UserDashboard;

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, message, Empty } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import {
  appointmentQueries,
  appointmentQueryKey,
  completeAppointment,
} from '@/entities/appointment/api';
import { Role } from '@/entities/role/helpers';
import { useAuth } from '@/features/auth/api/useAuth';
import { useCabinetTab } from '@/features/personal-cabinet/model/personal-cabinet-tab';
import Sidebar from '@/features/personal-cabinet/ui/sidebar/Sidebar';
import Loader from '@/shared/ui/loader/loader';
import { AppointmentStatusTag } from '@/pages/personal-cabinet/constants';
import { getTabsForRole, type TabId } from '@/pages/personal-cabinet/config/tabs';
import PsychologistRejectModal from '@/features/personal-cabinet/ui/PsychologistRejectModal';
import { usePsychologistDrafts } from '@/features/personal-cabinet/model/psychologist-drafts';
import styles from './PsychologistAppointmentPage.module.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ru');

const MOSCOW_TZ = 'Europe/Moscow';

const TYPE_LABELS: Record<string, string> = {
  Online: 'Онлайн',
  Offline: 'Очно',
};

const PSYCHOLOGIST_TABS = getTabsForRole('psychologist');
const CABINET_PATH = '/cabinet';

const formatDateTime = (iso?: string | null) => {
  if (!iso) return null;
  return dayjs(iso).tz(MOSCOW_TZ).format('D MMMM YYYY, HH:mm');
};

const PsychologistAppointmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuth((s) => s.user);
  const appointmentId = id ?? '';
  const setSavedTab = useCabinetTab((s) => s.setActiveTab);

  const isPsychologist = useMemo(
    () => (user?.roles ? new Role(user.roles).isPsychologist() : false),
    [user?.roles],
  );

  const handleSidebarTabChange = useCallback(
    (tabId: string) => {
      setSavedTab(tabId as TabId);
      navigate(CABINET_PATH);
    },
    [navigate, setSavedTab],
  );

  const { data: appointment, isLoading } = useQuery({
    ...appointmentQueries.byId(id!),
    enabled: isPsychologist && !!id,
  });

  const comment = usePsychologistDrafts((state) =>
    appointmentId ? (state.conclusionDrafts[appointmentId] ?? '') : '',
  );
  const hasCommentDraft = usePsychologistDrafts((state) =>
    appointmentId
      ? Object.prototype.hasOwnProperty.call(state.conclusionDrafts, appointmentId)
      : false,
  );
  const setConclusionDraft = usePsychologistDrafts((state) => state.setConclusionDraft);
  const clearConclusionDraft = usePsychologistDrafts((state) => state.clearConclusionDraft);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    if (!appointment?.id || hasCommentDraft || appointment.comment == null) return;

    setConclusionDraft(appointment.id, appointment.comment);
  }, [appointment?.id, appointment?.comment, hasCommentDraft, setConclusionDraft]);

  const completeMutation = useMutation({
    mutationFn: () => completeAppointment(id!, comment),
    onSuccess: () => {
      message.success('Запись завершена');
      if (appointmentId) {
        clearConclusionDraft(appointmentId);
      }
      queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.list] });
      queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.byId, id] });
      navigate(-1);
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail;
      message.error(detail || 'Не удалось завершить запись');
    },
  });

  if (!isPsychologist) return <Navigate to="/" replace />;
  if (isLoading) return <Loader />;
  if (!appointment) return <Empty description="Запись не найдена" />;

  const isActive = appointment.status === 'awaiting';

  // TODO: Оно наверное пока что упадёт, надо будет поправить
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverCancelReason = (appointment as any).cancel_reason;

  const statusUI = AppointmentStatusTag[appointment.status];
  const patientName =
    [
      appointment.patient?.last_name,
      appointment.patient?.first_name,
      appointment.patient?.middle_name,
    ]
      .filter(Boolean)
      .join(' ') || 'Имя не указано';

  return (
    <div className={styles.page}>
      <div className={styles.sidebarWrapper}>
        <Sidebar
          user={user}
          activeTab="appointments"
          onChangeTab={handleSidebarTabChange}
          tabs={PSYCHOLOGIST_TABS}
        />
      </div>

      <article className={styles.wrapper}>
        <button className={styles.back} onClick={() => navigate(-1)} type="button">
          <span>&lt;</span>
          <span>Вернуться назад</span>
        </button>

        <h2 className={styles.title}>Запись</h2>

        {appointment.status === 'cancelled' && serverCancelReason && (
          <div className={styles.reasonBlockCancelled}>
            <span className={styles.reasonLabel}>Причина отмены:</span>
            <span className={styles.reasonText}>{serverCancelReason}</span>
          </div>
        )}

        <div className={styles.infoBlock}>
          {patientName && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Пациент</span>
              <span className={styles.infoName}>{patientName}</span>
            </div>
          )}
          {statusUI && (
            <div className={styles.infoRow}>
              <span className={styles.statusLabel}>Статус</span>
              <div className={styles['status']}>
                <div className={clsx(styles['status-dot'], styles[statusUI.className])}></div>
                <span className={styles['status-text']}>{statusUI.text}</span>
              </div>
            </div>
          )}
          {appointment.patient?.email && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email пациента</span>
              <span className={styles.infoValueEmail}>{appointment.patient.email}</span>
            </div>
          )}
          {appointment.patient?.phone_number && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Телефон пациента</span>
              <span className={styles.infoValuePhone}>{appointment.patient.phone_number}</span>
            </div>
          )}
          <div className={styles.infoGrid}>
            {appointment.patient?.social_media && (
              <div className={styles.infoRowGrid}>
                <span className={styles.infoLabel}>Соцсети</span>
                <span className={styles.infoValueGrid}>{appointment.patient.social_media}</span>
              </div>
            )}
            {appointment.scheduled_time && (
              <div className={styles.infoRowGrid}>
                <span className={styles.infoLabel}>Дата и время</span>
                <span className={styles.infoValueGrid}>
                  {formatDateTime(appointment.scheduled_time)}
                </span>
              </div>
            )}
            {appointment.type && (
              <div className={styles.infoRowGrid}>
                <span className={styles.infoLabel}>Формат</span>
                <span className={styles.infoValueGrid}>
                  {TYPE_LABELS[appointment.type] ?? appointment.type}
                </span>
              </div>
            )}
            {appointment.venue && (
              <div className={styles.infoRowGrid}>
                <span className={styles.infoLabel}>Место</span>
                <span className={styles.infoValueGrid}>{appointment.venue}</span>
              </div>
            )}
          </div>

          {appointment.reason && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Причина записи</span>
              <span className={styles.infoValue}>{appointment.reason}</span>
            </div>
          )}
          {appointment.remind_time && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Напоминание</span>
              <span className={styles.infoValue}>{formatDateTime(appointment.remind_time)}</span>
            </div>
          )}
          {appointment.last_change_time && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Последнее изменение</span>
              <span className={styles.infoValue}>
                {formatDateTime(appointment.last_change_time)}
              </span>
            </div>
          )}

          {isActive && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Заключение</span>
              <span className={styles.infoValue}>
                <Input.TextArea
                  rows={4}
                  value={comment}
                  onChange={(e) => setConclusionDraft(appointment.id, e.target.value)}
                  placeholder="Введите заключение по консультации"
                  // maxLength={2000}
                  // showCount
                />
              </span>
            </div>
          )}
        </div>

        {isActive && (
          <div className={styles.actions}>
            <button
              className={styles.actionButtonCancel}
              onClick={() => setCancelModalOpen(true)}
              disabled={completeMutation.isPending}
              type="button"
            >
              Отменить
            </button>
            <button
              className={styles.actionButtonEnd}
              onClick={() => completeMutation.mutate()}
              disabled={comment.trim().length === 0 || completeMutation.isPending}
              type="button"
            >
              {completeMutation.isPending ? 'Завершение...' : 'Завершить'}
            </button>
          </div>
        )}

        <PsychologistRejectModal
          type="appointment"
          entityId={cancelModalOpen ? id! : null}
          onClose={() => setCancelModalOpen(false)}
          onSuccess={() => {
            message.success('Запись отменена');
            queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.byId, id] });
            navigate(-1);
          }}
        />
      </article>
    </div>
  );
};

export default PsychologistAppointmentPage;

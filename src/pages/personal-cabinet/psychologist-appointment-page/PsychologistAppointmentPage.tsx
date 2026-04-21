import { useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, message, Empty } from 'antd';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import {
  appointmentQueries,
  appointmentQueryKey,
  completeAppointment,
} from '@/entities/appointment/api';
import { authQueries } from '@/entities/auth/api/queries';
import { Role } from '@/entities/role/helpers';
import { useAuth } from '@/features/auth/api/useAuth';
import Loader from '@/shared/ui/loader/loader';
import { AppointmentStatusTag } from '@/pages/personal-cabinet/constants';
import PsychologistRejectModal from '@/features/personal-cabinet/ui/PsychologistRejectModal';
import styles from './PsychologistAppointmentPage.module.scss';

const TYPE_LABELS: Record<string, string> = {
  Online: 'Онлайн',
  Offline: 'Очно',
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return null;
  return dayjs(iso).format('D MMMM YYYY, HH:mm');
};

const PsychologistAppointmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuth((s) => s.user);

  const isPsychologist = useMemo(() => !!user && new Role(user.roles).isPsychologist(), [user]);

  const { data: appointment, isLoading } = useQuery({
    ...appointmentQueries.byId(id!),
    enabled: isPsychologist && !!id,
  });

  const { data: patient, isLoading: isPatientLoading } = useQuery({
    ...authQueries.getUserById(appointment?.patient_id ?? ''),
    enabled: isPsychologist && !!appointment?.patient_id,
  });

  const [comment, setComment] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [commentInitializedForId, setCommentInitializedForId] = useState<string | null>(null);

  if (appointment?.comment && appointment.id !== commentInitializedForId) {
    setCommentInitializedForId(appointment.id);
    setComment(appointment.comment);
  }

  const completeMutation = useMutation({
    mutationFn: () => completeAppointment(id!, comment),
    onSuccess: () => {
      message.success('Запись завершена');
      setComment('');
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
  if (isLoading || isPatientLoading) return <Loader />;
  if (!appointment) return <Empty description="Запись не найдена" />;

  const isActive = appointment.status === 'awaiting';

  // TODO: Оно наверное пока что упадёт, надо будет поправить
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverCancelReason = (appointment as any).cancel_reason;

  const statusUI = AppointmentStatusTag[appointment.status];

  const patientName = [patient?.last_name, patient?.first_name, patient?.middle_name]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={styles.wrapper}>
      <button type="button" onClick={() => navigate(-1)} className={styles.back}>
        Назад
      </button>

      <h2 className={styles.title}>Запись на консультацию</h2>

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
            <span className={styles.infoValue}>{patientName}</span>
          </div>
        )}
        {patient?.email && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email пациента</span>
            <span className={styles.infoValue}>{patient.email}</span>
          </div>
        )}
        {patient?.phone_number && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Телефон пациента</span>
            <span className={styles.infoValue}>{patient.phone_number}</span>
          </div>
        )}
        {patient?.social_media && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Соцсети</span>
            <span className={styles.infoValue}>{patient.social_media}</span>
          </div>
        )}
        {formatDateTime(appointment.scheduled_time) && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Дата и время</span>
            <span className={styles.infoValue}>{formatDateTime(appointment.scheduled_time)}</span>
          </div>
        )}
        {appointment.type && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Формат</span>
            <span className={styles.infoValue}>
              {TYPE_LABELS[appointment.type] ?? appointment.type}
            </span>
          </div>
        )}
        {appointment.venue && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Место</span>
            <span className={styles.infoValue}>{appointment.venue}</span>
          </div>
        )}
        {appointment.reason && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Причина записи</span>
            <span className={styles.infoValue}>{appointment.reason}</span>
          </div>
        )}
        {formatDateTime(appointment.remind_time) && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Напоминание</span>
            <span className={styles.infoValue}>{formatDateTime(appointment.remind_time)}</span>
          </div>
        )}
        {formatDateTime(appointment.last_change_time) && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Последнее изменение</span>
            <span className={styles.infoValue}>{formatDateTime(appointment.last_change_time)}</span>
          </div>
        )}
        {statusUI && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Статус</span>
            <span className={clsx(styles.statusTag, styles[statusUI.className])}>
              {statusUI.text}
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
                onChange={(e) => setComment(e.target.value)}
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
            type="button"
            onClick={() => completeMutation.mutate()}
            // loading={completeMutation.isPending}
            disabled={comment.trim().length === 0}
          >
            Завершить
          </button>
          <button onClick={() => setCancelModalOpen(true)}>Отменить</button>
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
  );
};

export default PsychologistAppointmentPage;
